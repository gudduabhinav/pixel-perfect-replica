<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- 360 viewer is a lazy R3F component behind ClientOnly — Three.js must never run during SSR.
- Wall areas come from RGBA mask PNGs (r=Wall A, g=Wall B, b=Accent, a=Ceiling) aligned to each panorama — the shader and click-picking both read these channels.
