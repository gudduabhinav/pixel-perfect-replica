import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createWallMaterial } from "./WallShader";

export type PaintState = {
  /** hex colour per mask channel (Wall A, Wall B, Accent, Ceiling) */
  colors: (string | null)[];
};

type ViewerProps = {
  pano: string;
  mask: string;
  paint: PaintState;
  blendMode: number;
  reveal: number;
  paintOn: boolean;
  highlight: number | null;
  onPickSurface: (index: number | null) => void;
  onReady: (api: { capture: () => string | null }) => void;
};

function hexToVec3(hex: string) {
  const v = hex.replace("#", "");
  return new THREE.Vector3(
    parseInt(v.slice(0, 2), 16) / 255,
    parseInt(v.slice(2, 4), 16) / 255,
    parseInt(v.slice(4, 6), 16) / 255,
  );
}

function useTexture(url: string, srgb: boolean) {
  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(url);
    t.colorSpace = THREE.NoColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.wrapS = THREE.RepeatWrapping;
    t.generateMipmaps = false;
    return t;
  }, [url]);
  useEffect(() => () => texture.dispose(), [texture]);
  void srgb;
  return texture;
}

/** Reads the mask PNG into a 2D canvas so clicks can resolve a surface. */
function useMaskSampler(url: string) {
  const ref = useRef<{ data: Uint8ClampedArray; w: number; h: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const w = 512;
      const h = 256;
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      ref.current = { data: ctx.getImageData(0, 0, w, h).data, w, h };
    };
    img.src = url;
    return () => {
      cancelled = true;
      ref.current = null;
    };
  }, [url]);

  return (u: number, v: number): number | null => {
    const m = ref.current;
    if (!m) return null;
    const x = Math.min(m.w - 1, Math.max(0, Math.floor(u * m.w)));
    const y = Math.min(m.h - 1, Math.max(0, Math.floor((1 - v) * m.h)));
    const i = (y * m.w + x) * 4;
    let best = -1;
    let bestVal = 40; // ignore near-empty mask pixels
    for (let c = 0; c < 4; c++) {
      const v = m.data[i + c] ?? 0;
      if (v > bestVal) {
        bestVal = v;
        best = c;
      }
    }
    return best >= 0 ? best : null;
  };
}

function PanoSphere({
  pano,
  mask,
  paint,
  blendMode,
  reveal,
  paintOn,
  highlight,
  onPickSurface,
}: Omit<ViewerProps, "onReady">) {
  const base = useTexture(pano, true);
  const maskTex = useTexture(mask, false);
  const sample = useMaskSampler(mask);
  const { size } = useThree();

  const material = useMemo(() => createWallMaterial(base, maskTex), [base, maskTex]);
  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    const u = material.uniforms;
    for (let i = 0; i < 4; i++) {
      const hex = paint.colors[i];
      if (hex) {
        u.uTargetColor.value[i]?.copy(hexToVec3(hex));
        u.uStrength.value[i] = 1;
      } else {
        u.uStrength.value[i] = 0;
      }
    }
    u.uBlendMode.value = blendMode;
    u.uReveal.value = reveal;
    u.uPaintOn.value = paintOn ? 1 : 0;
    u.uHighlight.value = highlight === null ? 0 : highlight + 1;
  }, [material, paint, blendMode, reveal, paintOn, highlight]);

  useEffect(() => {
    material.uniforms.uResolution.value.set(
      size.width * window.devicePixelRatio,
      size.height * window.devicePixelRatio,
    );
  }, [material, size]);

  useFrame(({ clock }) => {
    material.uniforms.uHighlightPulse.value =
      highlight === null ? 0 : 0.5 + 0.5 * Math.sin(clock.elapsedTime * 4);
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!e.uv) return;
    e.stopPropagation();
    onPickSurface(sample(e.uv.x, e.uv.y));
  };

  return (
    <mesh scale={[-1, 1, 1]} onClick={handleClick} material={material}>
      <sphereGeometry args={[500, 60, 40]} />
    </mesh>
  );
}

function FovZoom() {
  const { camera, gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cam = camera as THREE.PerspectiveCamera;
      cam.fov = THREE.MathUtils.clamp(cam.fov + e.deltaY * 0.05, 30, 95);
      cam.updateProjectionMatrix();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [camera, gl]);
  return null;
}

function CaptureBridge({ onReady }: { onReady: ViewerProps["onReady"] }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    onReady({
      capture: () => {
        gl.render(scene, camera);
        return gl.domElement.toDataURL("image/png");
      },
    });
  }, [gl, scene, camera, onReady]);
  return null;
}

export default function RoomViewer360(props: ViewerProps) {
  const { onReady, ...rest } = props;
  return (
    <Canvas
      className="h-full w-full"
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      camera={{ fov: 75, position: [0, 0, 0.1], near: 0.1, far: 1100 }}
    >
      <PanoSphere {...rest} />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={-0.32}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI - 0.35}
      />
      <FovZoom />
      <CaptureBridge onReady={onReady} />
    </Canvas>
  );
}
