# r186 check

Sep 29, 2026 · Brad

**Status: fixes applied Sep 29, 2026.** Every three.js claim in the repo was checked against the installed `three@0.186.0`, and Brad approved fixing everything the check found. Item 5 in `docs/brief-interview-review.md` asked for this check. The findings below are kept as the record; "Fixes applied" at the end says what changed.

## What was checked

- `docs/concept-inventory.md`, all of it.
- All 21 built Loop 1 pages: 12 in Domain 1 and 9 in Domain 2. For each page that means `README.md`, `questions.ts` and `scenes.ts`, plus its concept card.
- Every quiz question: 89 in total. For each one, the checks confirmed that the marked answer is right, every wrong choice is really wrong, and the explanation is accurate.
- `CLAUDE.md`, `docs/writing-pages.md`, `docs/addendum-write-the-check.md`, and the harness code.

## How it was checked

- **API names and deprecations:** the r186 source and its deprecation warnings.
- **Behavior that runs in Node:** proven with a script. This covers math, transforms, raycasting, bounds, projection and glTF parsing.
- **Rendering behavior:** read from the renderer source, with file and line cited.
- **Claims that aren't about three.js** (GPU, glTF spec, GLSL, Unreal): confirmed from an official source, or labelled a rule of thumb.
- **Typecheck:** `npm run typecheck` passes against `@types/three@0.186.0`. That confirms every API name used in real code exists.

About 800 claims were checked in all. Each one is listed with its evidence in the five ledgers in `evidence/`.

## Bottom line

- **No quiz has a wrong answer marked,** and no wrong choice turns out to be correct.
- **No page or harness code uses a deprecated API.** The inventory has one outdated claim: the second UV set, below.
- **3 claims are wrong and 1 is outdated.** They're listed first below.
- **98 claims are true but misleading.** Most need one clause added. The ones that matter most in an interview, or for Loop 3's bugs, are listed below. The rest are in the ledgers, each with a suggested rewrite.
- **75 claims are rules of thumb,** such as cost estimates and GPU behavior in general. They're fine to keep if labelled as guidance.
- **2 claims couldn't be checked.** Neither is about three.js; see below.

| Verdict | Count |
| --- | --- |
| OK | ~570 |
| Not three.js, confirmed from a source | 56 |
| Rule of thumb | 75 |
| True but misleading | 98 |
| Outdated | 1 |
| Wrong | 3 |
| Unverified | 2 |

## Wrong or outdated

1. **Draw sorting.** At `concept-inventory.md:355`, the inventory says opaque objects sort "front to back and by program."
   - In r186, opaque objects sort by render order, then by **material**, and only then front to back. Program isn't a sort key.
   - Transparent objects sort by render order, then back to front.
   - Objects with transmission get their own list, drawn between the two.
   - Source: `WebGLRenderLists.js:1–51`.
2. **Reflection page, raycast normals.** At `drills/1/math/reflection/read-the-code-1/README.md:39`, the page says "raycast hit normals are already length 1."
   - `hit.normal` is the smoothed normal. It isn't renormalized; it measured 0.902 on a sphere.
   - Only `hit.face.normal` has length 1.
   - Both are in the object's own space, not world space.
3. **Compose quiz explanation.** At `drills/1/transforms/compose-decompose/read-the-code-1/questions.ts:15`, the explanation says passing `rotation` instead of `quaternion` makes "every number" NaN.
   - Only 6 of the 16 are NaN. The answer is still right: copy 0 vanishes.
   - A side effect the page misses: raycasts then miss every copy.
4. **Outdated: the second UV set.** At `concept-inventory.md:240` and `:395`, the inventory says AO and light maps use the second UV set.
   - Since r151, every map reads the UV set chosen by `texture.channel`, which defaults to 0.
   - The second set is named `uv1`, not `uv2`.
   - glTF files set the channel for you.

## Fix first: misleading in a way that matters

These are true as written but would mislead in an interview or become the wrong bug in Loop 3.

**Spaces and transforms**
- **`rotateOnWorldAxis` and `premultiply`** act in the **parent's** space. The r186 source says the method "assumes no rotated parent." Affects inventory :195 and :204, and the TRS page :84.
- **`transformDirection`** applies scale as well as rotation, then sets the length back to 1. Using it on a velocity loses the speed. Affects inventory :174 and `writing-pages.md:21`.
- **`matrixAutoUpdate = false`** saves almost nothing on its own: world matrices are still recomputed every frame. Affects inventory :184.
- **`getWorldPosition`** doesn't refresh an object that has `matrixAutoUpdate = false`, even when its parent moved. Affects the update timing page :66 and :126.
- **Which calls update matrices for you:**
  - The `getWorld*` methods, `localToWorld`/`worldToLocal`, and `lookAt` do.
  - Raycasting, frustum tests, `project()`, and reading `.matrixWorld` directly don't.
  - Affects inventory :171.
- **The view matrix ignores any scale on the camera.** With a scaled camera, `project` and then `unproject` don't return the starting point. Affects inventory :212.
- **Spot and directional lights** aim at their `.target` object. `lookAt` doesn't aim them. Affects inventory :198.
- **Euler `'XYZ'`** means X, then Y, then Z about the object's own axes. That's Z, then Y, then X about fixed axes. Affects inventory :192.
- **The drag's last step** is `parent.worldToLocal`, because `position` is in the parent's space. Affects inventory :295 and :344.

**Raycasting and normals** (your focus)
- **`hit.face.normal` and `hit.normal` are in the object's own space.**
  - `hit.normal` isn't unit length.
  - `hit.normal` is flipped to face the ray; `face.normal` is not.
  - For world space, use `Matrix3().getNormalMatrix(mesh.matrixWorld)`, not the object's `.normalMatrix`, which is view space.
  - Affects inventory :305 and :507, and the normalize page :57.
- **Layers apply to one object only.** Children of a filtered parent are still rendered and still hit. Affects inventory :287 and :306.
- **Raycasting ignores `visible`**, including `material.visible = false`. Helpers get hit too: grid, axes, and the TransformControls picker meshes.
- **`intersectObject` is recursive by default.**
- **Ray–triangle:** r186 uses a watertight method, not Möller–Trumbore. The hit's barycentric coordinates come back as `hit.barycoord`. Affects inventory :309.
- **`Raycaster.set`** doesn't normalize the direction you give it. `setFromCamera` does. Affects the normalize page :57.
- **Pointer `clientX`/`clientY` are relative to the viewport,** not the canvas. Subtract the canvas rect. Affects inventory :329.
- **`Box3.setFromObject`** is loose by default; pass `true` for a tight fit. It also counts hidden children and uses a cached geometry box that can be stale. Affects inventory :285.

**Assets**
- **GLTFLoader renames nodes.** `Rack.001` becomes `Rack001`, a duplicate becomes `Rack001_1`, and `Shelf Top` becomes `Shelf_Top`. The original name is kept in `userData.name`. Affects inventory :283.
- **`compileAsync`** pre-warms shaders only. `renderer.initTexture` pre-uploads textures. Set up lights and the environment before either. Affects inventory :262.
- **KTX2** falls back to raw RGBA on devices without a compressed format. Meshopt's usual quantization really does use less GPU memory. Affects inventory :263 and :264.

**GPU, materials, and color**
- **An EffectComposer without `OutputPass`** loses tone mapping and sRGB output.
  - r186 also adds `renderer.setEffects()` with `outputBufferType`, which applies both for you.
  - Neither is named in the inventory.
- **Transparent materials keep writing depth** unless you set `depthWrite: false`. The same goes for additive particles. Affects inventory :358 and :491.
- **Shadow passes use a depth material,** not your vertex shader. Displacement needs a `customDepthMaterial`. Affects inventory :426.
- **`MeshNormalMaterial` shows view-space normals.** This matters for the "normals as color" drill. Affects inventory :444 and :518.
- **Physical material cost** depends on which features are on. Transmission adds a whole extra render. Affects inventory :463.
- **Tone mapping** is off by default. `NeutralToneMapping` exists for keeping product colors true. Affects inventory :388.
- **The stencil buffer** is off unless you create the renderer with `stencil: true`. Affects inventory :357.
- **Degenerate cases rarely give NaN in three.js's math:**
  - A zero-length `normalize()` returns (0,0,0).
  - `lookAt` nudges its axis rather than failing.
  - A zero-scale matrix inverts to all zeros.
  - Ray–plane returns `null`.
  - Affects inventory :440 and the normalize card.

**Built Domain 1 pages**
- **Dot product:**
  - The heading "Only for length-1 directions" suggests the dot product needs unit vectors. Only the −1 to 1 range does.
  - The "In short" line also drops the length-1 condition.
- **Cross product:** nearly parallel edges, as in sliver triangles, give a tiny cross product. It normalizes to a random length-1 vector, not (0,0,0). Quiz Q4 calls exactly parallel edges a "sliver."
- **Point vs direction quiz Q1:** a per-second velocity is added without `delta`.
- **Float tolerance:**
  - `toBeCloseTo` defaults to a 0.005 tolerance, not 1e-6.
  - Far from the origin, an ordinary mesh doesn't crumple, because three.js combines object and camera matrices in 64-bit on the CPU. Only huge vertex numbers crumple.
- **Triple product:** three.js already handles a mirrored mesh (`scale.x = -1`) by flipping which side counts as the front.

## For Brad to decide

- **`Object3D.pivot`** is new in r186. It rotates and scales an object around a chosen point with no extra group. The Pivots page mentions it in B, but the page opening and the card present the group as the only way. Should Loop 1 teach both?
- **Four misconceptions on the Domain 1 cards state true facts:**
  - "Parallel inputs give zero."
  - "acos of an unclamped dot returns NaN."
  - "A zero vector can't be normalized."
  - "The poles are degenerate."

  The wording comes from the inventory. Rewrite them as the wrong belief. For example, "Normalizing a zero vector throws or gives a default direction."
- **Names the inventory should add:**
  - `BatchedMesh` (Domain 14)
  - `OutputPass` and `renderer.setEffects` (Domain 10)
  - `HDRLoader`, not the deprecated `RGBELoader` (Domain 11)
  - `texture.colorSpace` and `renderer.outputColorSpace` (Domain 11)
  - `NeutralToneMapping` and `RectAreaLight` (Domain 11)
  - `renderer.initTexture` (Domain 14)
  - `readRenderTargetPixelsAsync` (Domain 10)
  - `customDepthMaterial` (Domain 11)

  Several of these overlap the tour pages in the brief.
- **Labelling rules of thumb:** mark the 75 rules of thumb in the inventory as guidance, or leave them as they are? I'd leave them. A page that uses one can say "usually" in plain words.
- **Raycasting wording:** the Möller–Trumbore and "build them by hand" wording in Domain 8 is already covered by the brief's decision 3, and these findings back that decision.

## Not verified

- **Chrome's GPU track in the Performance panel** (inventory :364). The Chrome docs weren't fetched.
- **The CLAUDE.md Vitest gotcha:** it says `--silent=false` brings back hidden test output. Vitest does switch to a minimal reporter for AI agents, but whether this flag restores the output wasn't confirmed.

## Evidence and re-running

`evidence/` holds the five ledgers and the proof scripts. Each ledger lists every claim, its verdict, and the evidence as a `node_modules/three` file and line or as script output.

| Ledger | Covers |
| --- | --- |
| `inventory-A.md` | Inventory lines 1–226: brief, primer, Domains 1–4 |
| `inventory-B.md` | Inventory lines 228–345: Domains 5–9 |
| `inventory-C.md` | Inventory lines 347–537: Domains 10–15, cross-domain drills |
| `pages-domain1.md` | Domain 1 pages, cards, and 42 quiz questions |
| `pages-domain2-docs.md` | Domain 2 pages, cards, 47 quiz questions, docs, and harness |

Run any script from the repo root, for example `node docs/r186-check/evidence/quiz.mjs`. All twelve run clean on r186. After a three.js upgrade, re-run them and compare the output with the ledgers to see what changed.

## Fixes applied

Sep 29, 2026, after Brad said to fix everything the check found.

- **Wrong, outdated, and misleading claims:** every one is fixed, in the inventory, the 12 Domain 1 pages, the Domain 2 pages, `writing-pages.md`, the addendum, and `CLAUDE.md`. Rules of thumb and "not three.js" items are unchanged. Two findings on the Domain 2 pages had already been fixed by the session that built them.
- **Misconceptions:**
  - Every misconception cell in the inventory now starts with a quoted wrong belief.
  - The concept cards match the inventory, and each card keeps its existing slugs.
  - Update timing gained a second belief (`parents-refresh`), which its quiz already exposed.
- **r186 names:** all names from the "For Brad to decide" list are in the inventory. `RGBELoader` is marked deprecated.
- **`Object3D.pivot`:**
  - **Pages and cards:** the Pivots page teaches both ways to turn around another point (the offset group, and `pivot`, added in r183, [three.js #32745](https://github.com/mrdoob/three.js/pull/32745)). It has a "What changed with pivot" section and two new quiz questions for the two new misconceptions. The inventory row and card list the same two.
  - **What checking found:**
    - `attach` and `applyMatrix4` make an object with a pivot jump.
    - GLTFExporter writes a pivot as an offset group, and GLTFLoader turns that back into a pivot.
    - An r186 bug: saving a turned object that has a pivot with `toJSON` and loading it with `ObjectLoader` puts it in the wrong place.
- **Quiz answer keys:** none changed. Only snippets and explanations did, plus one choice, compose Q1.
- **Checks:** typecheck and `npm run coverage` pass, and all 36 misconceptions on the written cards are exposed by a drill. The edited pages load in the viewer with no console errors.
