# Experiments

Sandboxes for tech the core curriculum leaves out. The concept inventory lists WebGPU/TSL and Gaussian splats as out of scope, so nothing here has drills, concept cards, placement checks, or coverage, and `pick.ts` never suggests it. AI tools are fine here. (The Domain 15 VFX elective is written in TSL, but its pages live with the curriculum, not here.)

Run `npm run dev` and open the root page, or go straight to a sandbox:

| Sandbox | Path | Stack |
| --- | --- | --- |
| TSL | `/experiments/tsl/` | `three/webgpu` + `three/tsl`. WebGPURenderer falls back to WebGL 2 where WebGPU is missing. |
| Gaussian splats | `/experiments/splats/` | [Spark](https://sparkjs.dev) 2.2 on WebGLRenderer. Loads Spark's sample splat from sparkjs.dev; change `SPLAT_URL` to load your own .spz, .ply, .splat, .ksplat, or .sog. |

Both use the same pinned three.js (r186) as the curriculum. Keep each experiment on its own page: TSL pages import `three/webgpu`, and the drill harness imports `three`.
