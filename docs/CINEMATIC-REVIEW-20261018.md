# Cinematic journey review — 18 October 2026

## Repository and deployments
- Repository: https://github.com/alvaradom1304/la-central-del-queso
- Base main: 73519f0416e9c63146662a8572b564f5b3dd6eec.
- hito2-exterior-realista: 39e87b018d3df3852dce66c1986380906952188d.
- Application code is identical between these two refs. Only .gitignore and PROJECT_STATUS.md differ.
- Public URL inspected: https://web-psi-bice-72.vercel.app. CLI authentication verified production deployment dpl_6J2BUCNU2GPkm6bkZpJTBx6ShWB4, main at 73519f0416e9c63146662a8572b564f5b3dd6eec. The connector account returns 404 for web and its project ID prj_7yfjYYyGDtQcttlz4V7zS4zTj2KS; the local CLI can access the project.
- The connector exposes project la-central-del-queso-5qyq (prj_IkPIX1RZDdgXKPBCAXzxejMZZNk3). Its latest main and hito2 builds fail because its Root Directory src/web does not exist. This is distinct from the actual public web project, whose CLI inspection confirms root directory `.`. No project settings or production aliases were changed.
- Preview: https://web-bzshu64lf-altiora13.vercel.app, deployment dpl_EtaG7UGvU8MXF6PAUXayQ2FtKiGx. CLI target preview; response target null and productionUrl null. Remote production-mode build and types passed in 39 seconds. Home first-load JavaScript reported by Next: 167 kB (not the complete lazy scene or media payload). Authentication protection retained.

## Diagnosis and implementation
1. Reduced motion enables lite mode and intentionally removes video/3D. Public browser observation confirms video can appear after disabling lite mode; negative media z-index was a fragile stacking implementation, not a proven universal explanation for disappearance.
2. Old video scrubbing performs a single damped seek per scroll event and never restarts after seeking. A second video buffer was declared but never rendered. Replaced with persistent photographic backgrounds, adjacent video loading, chapter crossfades, continuous frame scheduling while visible, and recoverable per-clip media fallback. Decoder seeking is gated to avoid overlapping seeks. This does not make separate source clips a genuine single camera take.
3. Old entry leaves occupy only 26vw each and never close the center. New timber leaves fill the opening, have hinge origins, wood textures, iron fittings and diagonal braces. A second timber opening appears at the cava. CSS perspective provides interaction without another WebGL context.
4. Original tasting camera visibly crops the wheel and serving board. Pulled camera back, assigned an explicit viewport height and absolute canvas bounds, paused rendering out of view, and retained a photographic WebGL fallback. Wood texture and less glossy rind improve the existing procedural sculpture. The sculpture remains a stylized wheel, not an accurate model of every product category.
5. Original business logic and prices preserved. Cart restoration no longer overwrites saved items on initial mount; add confirmation has a live region; drawer traps keyboard focus and returns it on close. Reduced motion also disables the smooth-scroll wrapper. Removed an unmeasured 120 FPS claim from the physics UI.
6. Header chapter map duplicated the story navigation and crowded the brand/actions at intermediate desktop widths. Hidden that map; story chapters and footer navigation remain. Added labels for icon controls and visible focus outlines.
7. Font loading stalled during local verification. System serif/sans/mono stacks remove the build-time font network dependency.

## Storyboard and camera path
- 0–16%: two closed textured entry leaves swing on outer hinges; slow forward scale; nameplate Finca Doña Martha.
- 16–25%: reveal landscape and clear the timber frame.
- 25–50%: pasture chapter; gentle forward dolly and 700ms crossfade.
- 50–76%: dairy chapter; approach the craft process.
- 76–100%: cellar and second door opening; warm dark timber transition, reveal the tasting table through ordinary document scroll.
- Following sections: persistent document-flow table, family selection, interactive cut, prices, catalog and calculator. Direct skip remains available throughout.
- Reduced motion: no doors, video or dolly; photographs and direct navigation.

## Technique comparison
A. Existing compressed MP4 + poster + CSS hinged doors: chosen for immediate reuse, low dependency cost, per-clip fallbacks and inspectable source. Existing clips total 35,084,629 bytes; loading all four eagerly was avoided.
B. Scroll image sequence: not chosen because no matched frame sequence is supplied, extraction expands asset count and requires a measured mobile memory/network budget. It would not repair inconsistent source cinematography by itself.
C. Full procedural farm: not chosen for noninteractive travel; current assets do not establish photographic vegetation/material continuity. Keep WebGL for the interactive product only.
No new library, paid generation, stock purchase or external service was introduced. Existing package versions are in package-lock.json. Existing assets retain their current provenance; redistribution rights have not been independently established.

## Verification
Protocol: https://github.com/alvaradom1304/Altiora-Immersive-Web-Lab/blob/main/protocols/IMMERSIVE-QUALITY-PROTOCOL.md (blob 3794136967bab5790907422906f5f13627e9858b).
Types passed before visual iteration; final build and browser results are recorded separately after testing. No field p75 LCP/CLS/INP or FPS claim is made. Human art-direction approval remains required. Production publication is not authorized.
