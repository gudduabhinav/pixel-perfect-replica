import * as THREE from "three";

/**
 * Panorama repaint shader.
 *
 * Keeps the photographed luminance (shadows, texture, highlights) of the base
 * equirectangular image and swaps only hue/saturation on masked surfaces.
 *
 * Mask encoding (RGBA):
 *   r -> Wall A, g -> Wall B, b -> Accent Wall, a -> Ceiling
 */

export const wallVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const wallFragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D uBaseTexture;
uniform sampler2D uMaskTexture;
uniform vec3 uTargetColor[4];
uniform float uStrength[4];
uniform float uBlendMode;   // 0 multiply, 1 overlay, 2 soft-light
uniform float uReveal;      // 0..1 horizontal split: left = painted
uniform float uPaintOn;     // global toggle
uniform vec2 uResolution;
uniform float uHighlight;   // channel index +1 of hovered/selected surface, 0 = none
uniform float uHighlightPulse;

varying vec2 vUv;

vec3 rgb2hsl(vec3 c) {
  float mx = max(c.r, max(c.g, c.b));
  float mn = min(c.r, min(c.g, c.b));
  float l = (mx + mn) * 0.5;
  float h = 0.0;
  float s = 0.0;
  float d = mx - mn;
  if (d > 0.00001) {
    s = l > 0.5 ? d / (2.0 - mx - mn) : d / (mx + mn);
    if (mx == c.r) h = (c.g - c.b) / d + (c.g < c.b ? 6.0 : 0.0);
    else if (mx == c.g) h = (c.b - c.r) / d + 2.0;
    else h = (c.r - c.g) / d + 4.0;
    h /= 6.0;
  }
  return vec3(h, s, l);
}

float hue2rgb(float p, float q, float t) {
  if (t < 0.0) t += 1.0;
  if (t > 1.0) t -= 1.0;
  if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
  if (t < 1.0 / 2.0) return q;
  if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
  return p;
}

vec3 hsl2rgb(vec3 hsl) {
  float h = hsl.x, s = hsl.y, l = hsl.z;
  if (s <= 0.00001) return vec3(l);
  float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
  float p = 2.0 * l - q;
  return vec3(
    hue2rgb(p, q, h + 1.0 / 3.0),
    hue2rgb(p, q, h),
    hue2rgb(p, q, h - 1.0 / 3.0)
  );
}

vec3 blendMultiply(vec3 base, vec3 paint) {
  return base * paint * 2.0;
}

vec3 blendOverlay(vec3 base, vec3 paint) {
  return mix(2.0 * base * paint, 1.0 - 2.0 * (1.0 - base) * (1.0 - paint), step(0.5, base));
}

vec3 blendSoftLight(vec3 base, vec3 paint) {
  return mix(
    2.0 * base * paint + base * base * (1.0 - 2.0 * paint),
    sqrt(base) * (2.0 * paint - 1.0) + 2.0 * base * (1.0 - paint),
    step(0.5, paint)
  );
}

vec3 repaint(vec3 base, vec3 target) {
  vec3 baseHsl = rgb2hsl(base);
  vec3 targetHsl = rgb2hsl(target);

  // Luminance transfer: keep the photo's shading relative to the surface's
  // own average brightness, re-centred on the chosen paint lightness.
  float shading = baseHsl.z - 0.72;            // deviation from a lit wall
  float l = clamp(targetHsl.z + shading * (0.55 + 0.9 * targetHsl.z), 0.02, 0.99);
  vec3 hueSwapped = hsl2rgb(vec3(targetHsl.x, targetHsl.y, l));

  vec3 blended;
  if (uBlendMode < 0.5) blended = blendMultiply(base, target);
  else if (uBlendMode < 1.5) blended = blendOverlay(base, target);
  else blended = blendSoftLight(base, target);

  // Hue-swapped result carries the colour, blend mode carries micro-contrast.
  return clamp(mix(hueSwapped, blended, 0.35), 0.0, 1.0);
}

void main() {
  vec4 base = texture2D(uBaseTexture, vUv);
  vec4 mask = texture2D(uMaskTexture, vUv);
  vec3 color = base.rgb;

  float m[4];
  m[0] = mask.r; m[1] = mask.g; m[2] = mask.b; m[3] = mask.a;

  if (uPaintOn > 0.5) {
    for (int i = 0; i < 4; i++) {
      float w = clamp(m[i], 0.0, 1.0) * clamp(uStrength[i], 0.0, 1.0);
      if (w > 0.001) {
        color = mix(color, repaint(base.rgb, uTargetColor[i]), w);
      }
    }
  }

  if (uHighlight > 0.5) {
    int hi = int(uHighlight - 1.0);
    float hw = 0.0;
    for (int i = 0; i < 4; i++) {
      if (i == hi) hw = clamp(m[i], 0.0, 1.0);
    }
    color += hw * uHighlightPulse * 0.12;
  }

  float painted = step(gl_FragCoord.x / uResolution.x, uReveal);
  gl_FragColor = vec4(mix(base.rgb, color, painted), 1.0);
}
`;

export type WallUniforms = {
  uBaseTexture: { value: THREE.Texture };
  uMaskTexture: { value: THREE.Texture };
  uTargetColor: { value: THREE.Vector3[] };
  uStrength: { value: number[] };
  uBlendMode: { value: number };
  uReveal: { value: number };
  uPaintOn: { value: number };
  uResolution: { value: THREE.Vector2 };
  uHighlight: { value: number };
  uHighlightPulse: { value: number };
};

export type WallMaterial = THREE.ShaderMaterial & { uniforms: WallUniforms };

export function createWallMaterial(base: THREE.Texture, mask: THREE.Texture): WallMaterial {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      uBaseTexture: { value: base },
      uMaskTexture: { value: mask },
      uTargetColor: {
        value: [
          new THREE.Vector3(1, 1, 1),
          new THREE.Vector3(1, 1, 1),
          new THREE.Vector3(1, 1, 1),
          new THREE.Vector3(1, 1, 1),
        ],
      },
      uStrength: { value: [0, 0, 0, 0] },
      uBlendMode: { value: 2 },
      uReveal: { value: 1 },
      uPaintOn: { value: 1 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uHighlight: { value: 0 },
      uHighlightPulse: { value: 0 },
    },
    vertexShader: wallVertexShader,
    fragmentShader: wallFragmentShader,
  }) as WallMaterial;
}
