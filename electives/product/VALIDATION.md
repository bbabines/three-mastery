# Product Look Development validation

## Review fixes (October 12, 2026, Brad's Mac)

An independent review measured the shared stage against the two WebGi captures and found nine issues. All were fixed, then the stage was measured again on the same Mac (M4 Pro, pinned r186, installed Chrome), mounting the real stage at both captured cameras on a 657 × 966 canvas at DPR 1 (`.pick/review/stage-compare.html`, git-ignored). Numbers are the average difference per color channel in sRGB levels (0–255); in brackets, the stage's average minus WebGi's.

| Region | Default, before | Default, after | Front, before | Front, after |
| --- | --- | --- | --- | --- |
| Whole image | 3.73 (+2.1) | 3.09 (0.0) | 2.58 (+1.1) | 2.33 (−0.7) |
| Dial | 13.13 (+11.5) | 8.31 (+3.0) | 9.71 (+7.7) | 6.54 (−0.4) |
| Strap top | 6.36 (+0.9) | 6.52 (−2.7) | 4.54 (−0.4) | 5.37 (−3.7) |
| Case | 10.04 (+6.6) | 8.76 (+0.7) | 10.52 (−2.0) | 10.84 (−6.7) |
| Floor shadow | 10.20 (+10.1) | 4.28 (+2.6) | 7.74 (+7.7) | 2.44 (+0.8) |
| Lower strap | 19.33 (+10.1) | 16.75 (−0.8) | 15.16 (+5.5) | 15.11 (−7.8) |

The lower-strap box (named `floorNear` in the comparison page) mostly covers the near strap; its large remaining difference is the leather grain, which looks sharper and more contrasty than WebGi's.

What each fix did:

1. **Crystal blur.** r186 reads what's behind a transmissive surface through a smoothing (bicubic) filter, at a blurrier detail level than roughness 0 asks for. The crystal now reads the sharp picture directly while its roughness is 0. Dial alone: 13.13 → 10.60 (default), 9.71 → 7.84 (front); the hands are crisp, as on WebGi.
2. **Studio light 10–20% strong.** Probable cause, read from the three.js source: r163 (under WebGi) cuts a partly metallic surface's diffuse share of studio light by its whole reflectance; r186 cuts it only by the non-metal part's. r163 also uses an older formula for how much studio light a surface reflects. Rebuilding both r163 formulas in the stage's shaders (with the old AO, intensity 1) gave whole 3.27 / 2.36, dial 9.98 / 6.85, case 9.22 / 9.32, but floor shadow 5.81 (−4.3) / 5.45 (−5.4): better, but too dark on the floor, so the cause isn't fully pinned. Instead `ENVIRONMENT_CALIBRATION = 0.9` multiplies the live value 1 (still recorded as the source value; `lab.useCalibratedEnvironment(false)` restores it). Tried 0.86–0.94 with the AO strengths below; 0.9 and 0.92 tied on total error, and 0.9 matched the floor shadow more closely.
3. **Ambient occlusion.** GTAO is now worked out before the scene is drawn and applied inside the watch's materials to environment light only (diffuse directly, reflections through three.js's specular occlusion), the way WebGi's SSAO patch does; the key light is untouched, and the ground and crystal receive none. Its strength is an exponent on GTAO's result. Measured: exponent 1, 2, 3, 4.5 gave summed region error 89.7, 89.8, 93.7, 99.6 at studio 0.9; 2 was kept, since it darkens the case more (about 3 levels; WebGi's SSAO darkens it about 7) at no extra error. Stronger occlusion darkened the strap past WebGi's.
4. **Cost.** The contact-shadow depth picture is drawn and blurred only when the watch or ground moves (draw calls 142 → 118, including two new backdrop draws). MSAA is now used only for a frame's first, unshifted sample, which is all a moving view shows; the composer's other targets and the 31 shifted samples of a still skip it. GPU time from WebGL timer queries, median of 7 runs, per still sample: **11.9 → 6.8 ms** at DPR 1 and **38.7 → 23.5 ms** at DPR 2; a moving frame, **10.4 → 8.9 ms** and **31.5 → 22.7 ms**. These timer values run higher than wall-clock time on this Mac while other tabs share the GPU, so read them as before/after ratios. Wall-clock medians of a 32-sample still, divided by 32, were noisy for the same reason: about 4.4 → 2.8 ms at DPR 1 and 24.7 → 9.9 ms at DPR 2.
5. **Black behind the crystal.** The scene pass now draws the white backdrop as its first object, so the picture the crystal looks through shows white, not tone mapped, where nothing solid is behind it. Measured together with fix 6, no region changed by more than 0.1 at the captured cameras, where the dial is always behind the glass.
6. **Bright edges.** Real but small: at the outline, the output blended untone-mapped and tone-mapped light, and the product's HDR light could leak through the untone-mapped share and clip an edge to pure white. That share is now capped at white. The blend itself remains an approximation (README).
7. **Delivery readout.** It now says the counts cover one whole stage frame, and says when it is showing a settled still's frozen counts.
8. **Capstone.** Opens on the reference studio; authored panels are one option or slider away.
9. The lens lab's comment now says 16 units, and the studio rotation is read from `reference-capture.json`.

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `node scripts/verify-product-state.mjs` | 4/4 runtime regressions pass (installed Chrome, headless) |
| `node scripts/verify-product.mjs` | 11/11 pages, 22 scenes, controls exercised, no browser errors (installed Chrome, headless). It reported 0 learner-progress writes intercepted, where the earlier run reported 11 |
| Viewer pages in the dev server (spot check) | Reference color, camera and finishing, delivery and validation, and the capstone loaded without console errors; the delivery readout's frozen-still label and the capstone's opening studio checked by hand |

Not re-run: `npm run verify`, `npm run coverage`, the mobile pass, and a visual pass over every experiment.

## Reference look (October 12, 2026, Brad's Mac)

Checked after the stage gained the reference look (the GLB's key light, the reference ground, the finishing chain, the camera-following studio, and WebGi's captured cameras), on an M4 Pro Mac with pinned three.js r186. Playwright's own Chromium isn't downloaded on this Mac, so the product scripts ran in the installed Chrome.

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `node --import tsx --test scripts/lib/electives.test.ts` | 6/6 pass: discovery and track membership (Look dev and Everything), prerequisites, VFX and effects scheduling |
| `node scripts/verify-product-state.mjs` | 4/4 runtime regressions pass |
| `PRODUCT_HEADED=1 node scripts/verify-product.mjs` | 11/11 pages, 22 scenes, controls exercised; 11 progress writes intercepted. A headless run stalled partway (on a page reload caused by editing a README during the run), so the passing run used a visible Chrome window |
| Reference manifest | All 11 files (9 source assets and the two live-site captures) match their recorded SHA-256 and byte counts |

Measured by the agent that built the reference look, on the same Mac with a 657 × 966 canvas, against the recaptured live site:

- Average difference per color channel (sRGB, 0–255): default view 18.24 for the earlier stage, 3.72 for the reference look; front view 16.42 and 2.58.
- A moving frame: about 5 ms at DPR 1 and 22 ms at DPR 2 (earlier stage: 2.2 and 4.9 ms). Draw calls: 43 → about 141 a frame. A settled 32-frame still: about 110 ms at DPR 1. These are browser frame intervals on one desktop, not GPU timings or phone results.

`npm run verify`, `npm run coverage`, the 390 × 844 mobile pass, and the visual inspection of every experiment capture were not re-run after this change; their results below are from the earlier stage.

## Reference capture

`reference-webgi.png` was recaptured on October 12, 2026 with the rewritten `electives/product/tools/capture-source.mjs --headed`: the installed Chrome on the real GPU (ANGLE Metal, Apple M4 Pro), light mode, interaction prompt off, hands at the GLB's rest pose, showcase effects pinned, after the site's 32-frame accumulation settled. The same run added `reference-webgi-front.png`. The previous capture was taken on a software GPU right after load, mid-animation, with the interaction cursor showing, so it wasn't a fair target.

## Earlier stage (October 12, 2026, Windows)

Validated on Windows with pinned three.js r186 and Playwright Chromium. Browser rendering used SwiftShader, a software GPU; these results do not establish hardware GPU or phone performance.

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

The live-site captures are the quality target. The stage restores the real model, standard materials, external leather normal, HDR, and key light, and rebuilds the ground and finishing with native r186 passes. It does not claim exact WebGi parity. Its studio is calibrated to 0.9 of the live intensity, a measured stand-in for a shading difference between three r163 and r186 that isn't fully pinned. What still differs: WebGi's screen-space reflections put dark watch parts into the bezel and dial, so the default view's dial stays about 3 levels brighter; one studio factor leaves the front view's case about 7 levels darker; GTAO occludes less than WebGi's SSAO; the leather grain is crisper than WebGi's; the floor reflection is a planar mirror; and bloom glows only from the product. Artistic reference values and synthetic teaching maps are labeled. Visual acceptance of every finish/view combination and real-device performance remain exercises for the learner; automated checks don't grade photorealism. Asset reuse rights are described in the reference README.
