# Product Look Development validation

Validated October 12, 2026 on Windows with pinned three.js r186 and Playwright Chromium. Browser rendering used SwiftShader; these results do not establish hardware GPU or phone performance.

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `node --import tsx --test scripts/lib/electives.test.ts` | 4/4 pass: complete discovery, prerequisites, track membership, preserved VFX scheduling |
| `node scripts/verify-product.mjs` | 11/11 pages, 22 scenes; all selects, sliders, and non-export experiment buttons exercised; no browser errors |
| `node scripts/verify-product-state.mjs` | 4/4 runtime regressions pass after the visibility correction |
| `npm run verify` | 533/533 reference solutions pass; 533/533 starters fail as intended; 121/121 regression checks reject broken code |
| `npm run coverage` | Pass; core coverage output unchanged |
| Reference manifest | All 9 binary assets match recorded SHA-256 and byte counts |
| `git diff --check` | Pass |

The whole-elective browser pass validates nonblank comparison PNGs, capstone settings/orbit downloads, and a 390 × 844 mobile viewport without page overflow. Its 11 track/progress POSTs were intercepted. The focused verifier makes no learner writes and checks:

- Paused surface picking and orbit update the actual reflection arrows and the exported reflection equation together.
- Paused auto-rotation does not advance the camera during PNG/JSON capture or control changes. All 36 orbit tiles contain rendered detail; camera, target, damping, and automatic rotation are restored, and motion resumes.
- Paused composer captures reflect DPR and bloom changes while preserving the camera.
- Loading inside a closed section or `display:none` preserves a finite projection and does not report readiness; reopening produces a nonblank frame.

The focused follow-up covers the final visibility guard: Chromium can retain dimensions for a closed `details` element, so dimensions alone are insufficient. Earlier browser capture testing also found a transparent empty PNG; comparison export now copies the freshly drawn WebGL buffer synchronously before asynchronous PNG encoding. Manual redraws have an explicit update hook and temporarily freeze automatic motion.

All 22 experiment captures, the original WebGi target, the mobile capture, and orbit output were inspected visually. Runtime reports and screenshots are generated under ignored `.pick/product-validation/` and `.pick/product-state-validation/`; run the scripts to reproduce them. Learner progress was not changed.

## Independent review

Separate agents authored foundations, lighting, and delivery units, then reviewed other units. A fresh reviewer assessed scheduling, shared-stage ownership, async cleanup, capture behavior, and composer integration. No P0/P1 findings remained. Its three P2 findings—paused reflection updates, automatic camera movement during capture, and hidden initialization—were addressed through the bounded redraw seam and the focused runtime checks above.

## Evidence limits

The source capture is the quality target. Native lessons restore the real model, standard materials, external leather normal, and HDR; they do not claim exact WebGi custom anisotropy, contrast, reflection, or ground parity. Artistic reference values and synthetic teaching maps are labeled. Visual acceptance of every finish/view combination and real-device performance remain exercises for the learner; software-GPU checks do not grade photorealism. Asset reuse rights are described in the reference README.
