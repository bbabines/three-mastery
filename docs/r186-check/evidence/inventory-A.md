# Inventory slice A: verification against three@0.186.0

Scope: `docs/concept-inventory.md` lines 1–226 (builder brief, loops, tiers, Primer, Domains 1–4 with lens notes).
Installed: `three@0.186.0` (`THREE.REVISION` prints `186`), `@types/three@0.186.0`, pinned exactly in `package.json:17,21`.
Source paths below are relative to `node_modules/three/src/` unless stated.

Proof scripts (run from the repo directory):
- `docs/r186-check/evidence/checkA.mjs` — one script, each output line tagged `[id]`. Full output is quoted where used.
- An inline `node --input-type=module` normal-matrix check (output quoted under D2 Normal matrix).
- `docs/r186-check/evidence/count.mjs` — counts concepts in `scripts/lib/domains.ts`.

None of the three.js APIs named in the slice are deprecated or renamed in r186. The only deprecation warnings in `math/`, `core/Object3D.js` and `cameras/` are `Matrix3.scale/rotate/translate` (r185, `math/Matrix3.js:419,436,454`) and ColorManagement renames. The slice doesn't use any of these.

## Findings

Ordered by line. Anything not listed here is OK or GENERAL-OK in the ledger.

### F1. docs/concept-inventory.md:128 — "Vertex shader, once per vertex per pass"
- **Verdict:** RULE-OF-THUMB
- **Evidence:** GPUs cache transformed vertices, so with indexed geometry a shared vertex is usually shaded once, but it can be shaded again if the cache evicts it. Non-indexed geometry has three separate vertices per triangle. Shadow and depth passes also count as passes. Nothing here is three.js-specific.
- **Suggested wording:** "Vertex shader, roughly once per vertex per pass (indexed geometry lets triangles share vertices; non-indexed repeats them)."

### F2. docs/concept-inventory.md:129 — "Fragment shader, once per covered pixel, including overdraw"
- **Verdict:** RULE-OF-THUMB
- **Evidence:** The shader runs once per pixel *per triangle* that covers the pixel. GPUs shade in 2×2 pixel blocks, so small or thin triangles pay for extra helper pixels. Early depth testing can skip hidden pixels. With MSAA it still runs once per pixel, not once per sample. General GPU behavior.
- **Suggested wording:** "Fragment shader, about once per pixel per triangle covering it (overdraw); tiny triangles cost more than their pixel count."

### F3. docs/concept-inventory.md:130 — GPU memory "Cost scales with: Vertex data size, texture dimensions"
- **Verdict:** IMPRECISE (minor)
- **Evidence:** The row names render targets but leaves out what they scale with. The canvas drawing buffer and render targets (color + depth, times the MSAA sample count) scale with width × height × DPR². `WebGLRenderer.js:683-684` sets `canvas.width = floor(width * pixelRatio)`. Index buffers also live in GPU memory.
- **Suggested wording:** "Vertex and index data size, texture dimensions, and render-target/canvas size (which grows with DPR²)."

### F4. docs/concept-inventory.md:131 — Upload happens on "First use of a buffer or texture, or after `needsUpdate`"; cost scales with "Size of changed data"
- **Verdict:** IMPRECISE
- **Evidence:**
  - *When a texture uploads.* A texture uploads only when `texture.version > 0` (`renderers/webgl/WebGLTextures.js:559`). `version` starts at 0 (`textures/Texture.js:324`) and goes up only when `needsUpdate = true` (`Texture.js:754`). Loaders and `CanvasTexture` (`CanvasTexture.js:39`) set it for you. A hand-built `new Texture(image)` or `new DataTexture(...)` never uploads until you set `needsUpdate = true`. Script `[new Texture(img).version] 0 DataTexture version 0`.
  - *How much uploads.* Setting `needsUpdate` re-sends the **whole** buffer (`WebGLAttributes.js:87-90`, `bufferSubData(…, 0, array)`), not just the changed part. A partial upload needs `attribute.addUpdateRange()` (`WebGLAttributes.js:92-142`) or `texture.addUpdateRange()` (`Texture.js:442`).
- **Suggested wording:** "Upload: first use of a buffer, a loaded texture's first use, or any time after `needsUpdate = true` (a texture you build yourself uploads only after you set it). Cost scales with the whole buffer or texture size, unless you mark an update range."

### F5. docs/concept-inventory.md:133 — "CPU and GPU work overlap, so the slower side sets frame time"
- **Verdict:** RULE-OF-THUMB (the 16.67 ms / 8.33 ms arithmetic is GENERAL-OK)
- **Evidence:** The overlap is real only while the browser pipelines frames. A sync point stalls it, for example `readPixels`, `getError` or `getParameter` (MDN, *WebGL best practices*, "Avoid blocking API calls in production"). Vsync then snaps frame time to whole refresh intervals.
- **Suggested wording:** Keep it, marked as a rule of thumb: "Usually the slower of CPU and GPU sets frame time, unless something forces them to wait for each other (a readback, a sync query)."

### F6. docs/concept-inventory.md:136 — "An uncompressed texture costs width × height × 4 bytes, plus about a third more for mipmaps"
- **Verdict:** IMPRECISE (minor)
- **Evidence:** The 4 bytes per pixel holds only for 8-bit RGBA, which is the default for loaded images. HalfFloat RGBA is 8 bytes per pixel: `TextureUtils.getByteLength(1024,1024,RGBAFormat,HalfFloatType)` → 8388608 vs 4194304 for UnsignedByte (script). Float RGBA is 16. HDR environment maps and render targets often use half or full float. The mip chain adds exactly 1/3 (script `[mip chain ratio] 1.333333`); MDN rounds this to "only 30% overhead". r186 ships `THREE.TextureUtils.getByteLength(w, h, format, type)` (`extras/TextureUtils.js:100,289`) for exact numbers.
- **Suggested wording:** "An uncompressed 8-bit RGBA texture costs width × height × 4 bytes, plus a third more for mipmaps. Half-float is ×8 and float is ×16. `TextureUtils.getByteLength` gives the exact figure."

### F7. docs/concept-inventory.md:146 — Normalize: "A zero vector can't be normalized."
- **Verdict:** IMPRECISE
- **Evidence:** This is true in the math, but three.js doesn't fail. `normalize()` is `divideScalar(this.length() || 1)` (`math/Vector3.js:792-796`). A zero vector silently stays `(0, 0, 0)`: no NaN, no warning (script `[normalize0] (0, 0, 0)`). The bug shows up later, as a zero-length "direction".
- **Suggested wording:** "A zero vector has no direction. three.js's `normalize()` silently returns (0, 0, 0) rather than failing, so check the length first when the input can be zero."

### F8. docs/concept-inventory.md:153 — Spherical: "azimuth theta around Y"
- **Verdict:** IMPRECISE
- **Evidence:** The line doesn't say where theta starts counting from. three.js measures theta from **+Z** toward +X: `theta = Math.atan2(x, z)` (`math/Spherical.js:125`). Many math texts count from +X, so a reader could easily assume that. Script `[spherical +X] phi 1.570796 theta 1.570796, +Z phi 1.570796 theta 0`, and `setFromSphericalCoords(1, π/2, 0)` → (0, 0, 1). The poles really are degenerate: at the pole theta is set to 0 (script `top {"phi":0,"theta":0}`), and `Spherical.makeSafe()` clamps phi to [1e-6, π−1e-6] (`Spherical.js:84-87`). Also, many physics and math texts swap the names phi and theta.
- **Suggested wording:** "Radius; polar angle phi measured down from +Y (0 at the top, π at the bottom); azimuth theta around Y, measured from +Z toward +X. Other sources often swap phi and theta."

### F9. docs/concept-inventory.md:160 — "`new Vector3()` in a per-frame loop feeds the garbage collector"
- **Verdict:** RULE-OF-THUMB
- **Evidence:** The direction is right: modern JS engines collect short-lived objects cheaply, but many allocations per frame can still cause GC pauses. The cost depends on the engine and on how many objects are allocated. The claim is fine as guidance, not as a guarantee. three.js itself follows it and uses module-level scratch vectors (e.g. `_vector` in `Vector3.js`, `_m1`/`_q1` in `Object3D.js`).
- **Suggested wording:** Keep it, marked as guidance.

### F10. docs/concept-inventory.md:161 — "lengthSq over length matters only in hot loops"
- **Verdict:** RULE-OF-THUMB
- **Evidence:** A single square root is cheap, so the saving only adds up in loops that run many times. That's performance guidance and can't be proven either way. The *correctness* claim on line 145 (comparing squared distances gives the same order) is OK.
- **Suggested wording:** Keep it, marked as guidance.

### F11. docs/concept-inventory.md:169 — "world is the scene root's frame"
- **Verdict:** IMPRECISE (minor)
- **Evidence:** World space is the frame the root is *placed in*, not the root's own local frame. The root's own `matrix` still applies: for a root, `matrixWorld.copy(this.matrix)` (`core/Object3D.js:1186`). If the Scene itself is moved, every child moves in world space. Script `[scene offset -> child world] (5, 0, 0)` for `scene.position.x = 5` and a child at the origin. In practice the scene sits at the identity, so the wording holds in the usual case.
- **Suggested wording:** "World space is the frame everything ends up in after every parent's transform, including the scene's own (normally identity)."

### F12. docs/concept-inventory.md:171 — Update timing: "updateMatrix and updateMatrixWorld refresh matrices; render does it automatically"
- **Verdict:** IMPRECISE
- **Evidence:** The misconception itself is confirmed. Setting `position` leaves `matrixWorld` stale until an update runs (script `[matrixWorld stale] (0, 0, 0)`). What the line leaves out is which calls update for you and which don't, which is the practical skill:
  - **Update themselves:** `getWorldPosition/Quaternion/Scale/Direction` (`Object3D.js:998,1012,1028,1044`), `localToWorld` and `worldToLocal` (`Object3D.js:665,679`), `lookAt` (`Object3D.js:710`), and `attach` (`Object3D.js:880`). Script: `getWorldPosition (1, 2, 3)` right after the move; `localToWorld` returns the fresh (9, 9, 9).
  - **Updates only the object itself, not its parents:** `Box3.setFromObject` / `expandByObject` (`math/Box3.js:308`, `updateWorldMatrix(false, false)`).
  - **Don't update at all:** reading `.matrixWorld`, `Raycaster` / `Mesh.raycast` (`objects/Mesh.js:242`), `Frustum.intersectsObject` (`math/Frustum.js:152,160`), and `Vector3.project/unproject` (`Vector3.js:499-515`).
  - **Render updates only when enabled:** `render` updates only when `scene.matrixWorldAutoUpdate === true`, and it updates the camera separately only when the camera has no parent (`renderers/WebGLRenderer.js:1663,1667`).
- **Suggested wording:** "Setting position doesn't touch matrixWorld until an update runs. render() runs it each frame. The getWorld* helpers, localToWorld/worldToLocal and lookAt update for you. Reading .matrixWorld directly, raycasting, frustum tests and Vector3.project don't, so call updateMatrixWorld() first."

### F13. docs/concept-inventory.md:174 — "Points use w=1 … directions use w=0. / 'applyMatrix4 works for directions.'"
- **Verdict:** IMPRECISE
- **Evidence:**
  - **`applyMatrix4` does a perspective divide.** It uses an implicit w=1, then divides by the resulting w (`Vector3.js:450-462`).
  - **`transformDirection` normalizes.** It is the w=0 method three.js offers, but it **normalizes** its result (`Vector3.js:525-537`), so it throws away length and scale. For the listed use context "transforming a velocity" it silently loses speed. Script, for a matrix with translation (10, 0, 0) and scale 3:

    ```
    [applyMatrix4 dir (1,0,0)] (13, 0, 0)
    transformDirection (1, 0, 0)
    applyMatrix3(setFromMatrix4) (3, 0, 0)
    [Vector4 w=0] 3 0 0 0
    ```
  - **Vector3 has no w.** The w=1/w=0 choice is made by which method you call.
- **Suggested wording:** "Points pick up translation (`applyMatrix4`, implicit w=1). Directions must not: use `transformDirection` for a unit direction (it re-normalizes), or `applyMatrix3(new Matrix3().setFromMatrix4(m))` or a `Vector4` with w=0 when length matters, like a velocity."

### F14. docs/concept-inventory.md:175 — "'Inverse equals transpose.' True only for pure rotation."
- **Verdict:** IMPRECISE (minor)
- **Evidence:** Inverse equals transpose for any *orthonormal* matrix with no translation: rotations **and mirror reflections**. Script `[rot inv==T] true reflection inv==T true rot+translation inv==T false`. A 4×4 world matrix with any translation or scale fails.
- **Suggested wording:** "True only when the matrix is a pure rotation (or rotation plus a mirror) with no translation or scale."

### F15. docs/concept-inventory.md:176 — "attach keeps the world transform"
- **Verdict:** IMPRECISE
- **Evidence:** r186 documents a limit: "This method does not support scene graphs having non-uniformly-scaled nodes(s)" (`core/Object3D.js:867,878`). `attach` works by decomposing a matrix into position, rotation and scale (`object.applyMatrix4`), so the shear from a non-uniformly scaled parent is lost. Script `[attach to non-uniform parent keeps world matrix] false`. Otherwise it's confirmed: `[add world] (1, 3, 0) attach world (6, 0, 0) (was 6,0,0)`.
- **Suggested wording:** "attach keeps the world transform, as long as no parent involved has non-uniform scale."

### F16. docs/concept-inventory.md:177 — Pivots: "Rotate or scale around a point … through a parent offset"
- **Verdict:** IMPRECISE (r186-specific omission)
- **Evidence:** r186 has a built-in `Object3D.pivot` (a `Vector3` or `null`, default `null`; `core/Object3D.js:381-388`): "When set, rotation and scale are applied around this point instead of the object's origin". `updateMatrix` applies it (`Object3D.js:1148-1158`), and `@types/three@0.186.0` declares it (`src/core/Object3D.d.ts:319`). Script: `pivot = (1, 0, 0)` with `rotation.z = π` maps the origin to `(2, 0, 0)`. The parent-offset group is still the portable technique and what older answers and forums show.
- **Suggested wording:** "Rotate or scale around a point other than the origin, either with a parent offset group (works in every version) or, since recent releases, by setting `object.pivot`."
- **For Brad to decide:** whether the page should teach `pivot`.

### F17. docs/concept-inventory.md:184 — "updateMatrixWorld walks the whole subtree every frame. Static objects can set matrixAutoUpdate to false."
- **Verdict:** IMPRECISE (the implied saving is mostly wrong)
- **Evidence:**
  - **What the flag skips.** `matrixAutoUpdate = false` skips only the `compose()` of the object's local matrix (`Object3D.js:1178`).
  - **The walk and the world multiply still run.** The walk always visits every child (`Object3D.js:1206-1212`). The Scene root keeps `matrixAutoUpdate = true`, so its `updateMatrix()` sets `matrixWorldNeedsUpdate = true` (`Object3D.js:1161`) and pushes `force = true` down the tree (`Object3D.js:1196`). Every descendant, static or not, still recomputes `matrixWorld` every frame.
  - **Script, 100 static children and one frame:**

    ```
    [100 static kids, 1 frame: composes] 1 world multiplies 100
    [same with scene.matrixAutoUpdate=false: composes] 0 world multiplies 0
    ```
  - **What actually stops the work.** Make the ancestors static too, or turn off `scene.matrixWorldAutoUpdate` / an object's `matrixWorldAutoUpdate` (`Object3D.js:265,1182`; `WebGLRenderer.js:1663`) and update by hand.
- **Suggested wording:** "updateMatrixWorld walks the whole tree every frame. `matrixAutoUpdate = false` only saves rebuilding that object's local matrix. Its world matrix is still recomputed whenever an ancestor updates, and the root updates every frame by default."

### F18. docs/concept-inventory.md:192 — Euler: "Three angles applied in a set order; three.js defaults to XYZ."
- **Verdict:** IMPRECISE
- **Evidence:** The default is confirmed (`Euler.DEFAULT_ORDER = 'XYZ'`, `math/Euler.js:447`; script `[default order] XYZ XYZ`). But "applied in a set order" is ambiguous. `'XYZ'` builds `Rx · Ry · Rz`. Script `[XYZ == Rx*Ry*Rz] true, XYZ == Rz*Ry*Rx false`. That means:
  - about the object's own (moving) axes: X first, then Y, then Z;
  - about fixed parent axes: Z first, then Y, then X.

  This is a classic interview trap. The "rotation.y is always yaw" misconception is confirmed; yaw/pitch cameras use `'YXZ'`.
- **Suggested wording:** "Three angles and an order. 'XYZ' (the default) means rotate about the object's own X, then its new Y, then its new Z, which is the same as rotating about the fixed axes Z, then Y, then X."

### F19. docs/concept-inventory.md:195 — Quaternions: "q.premultiply(d) applies it in world space"
- **Verdict:** IMPRECISE
- **Evidence:** `object.quaternion` is relative to the **parent**, so `premultiply` applies `d` in the parent's frame. That equals world space only when no ancestor is rotated. r186's own `rotateOnWorldAxis`, which is just `quaternion.premultiply` (`Object3D.js:551-561`), carries the comment "method assumes no rotated parent" (`Object3D.js:555`). Script: with a parent rotated 90° about Z, `rotateOnWorldAxis(X, 90°)` doesn't match a true world-X rotation (`[rotated parent: …] false`). The rest is confirmed:
  - `multiply` is local: `rotateOnAxis` is `quaternion.multiply` (`Object3D.js:531-541`);
  - `q` and `−q` rotate identically (script: both give (0.540302, 0, −0.841471));
  - multiplication isn't commutative (script `false`).
- **Suggested wording:** "q.multiply(d) applies d in the object's local frame; q.premultiply(d) applies it in the parent's frame, which is world space only when the parent isn't rotated."

### F20. docs/concept-inventory.md:197 — Basis: "The columns are the object's rotated right, up, and forward axes."
- **Verdict:** IMPRECISE
- **Evidence:** Two gaps.
  - **Scale.** The columns of an object's `matrix`/`matrixWorld` carry scale, so they aren't unit length. Script with scale 2: `extractBasis` → (0, 0, −2) (0, 2, 0) (2, 0, 0). `extractBasis` doesn't normalize (`math/Matrix4.js:239-255`).
  - **Which column is "forward".** Column 3 is local **+Z**. That's "forward" for ordinary objects (`getWorldDirection` reads elements 8–10, `Object3D.js:1042-1048`). For a camera, forward is **−Z** (`cameras/Camera.js:106-108` negates it). Script: `[camera col3] (1, 0, 0) camera getWorldDirection (-1, 0, 0)`.
- **Suggested wording:** "The columns are the object's local +X, +Y, +Z axes after rotation, multiplied by scale (normalize them). +Z is forward for ordinary objects; a camera looks down −Z, so its forward is the negated third column."

### F21. docs/concept-inventory.md:198 — lookAt: "Cameras and lights look down −Z" and use context "Aiming a spotlight"
- **Verdict:** IMPRECISE
- **Evidence:** `Object3D.lookAt` does treat cameras and lights specially (`Object3D.js:714-722`). Script: an object's +Z and a camera's −Z both end up pointing at the target. But **SpotLight and DirectionalLight ignore their own rotation**. The renderer computes their direction from `light.position − light.target.position` (`renderers/webgl/WebGLLights.js:578-580, 592-594`), and `SpotLight.target` is a separate `Object3D` (`lights/SpotLight.js:69`). Calling `spotLight.lookAt()` doesn't change where it shines. The degeneracy is confirmed: `Matrix4.lookAt` nudges `z` by 0.0001 when forward is parallel to up (`Matrix4.js:498-513`). Script: a camera looking straight down gives finite output, direction `(0, −1, −0.0001)`, with an arbitrary roll. `lookAt` also doesn't support non-uniformly-scaled parents (`Object3D.js:688,696`).
- **Suggested wording:** "Cameras look down −Z; other objects point +Z at the target. Spot and directional lights aim at their `.target` object, not by rotation: move the target (and add it to the scene) instead of calling lookAt."

### F22. docs/concept-inventory.md:204 — Lens: "rotateOnWorldAxis and premultiply act in world space"
- **Verdict:** IMPRECISE
- **Evidence:** Same as F19. It's the parent's frame, and `Object3D.js:555` says "assumes no rotated parent".
- **Suggested wording:** "rotateX and multiply act in local space; rotateOnWorldAxis and premultiply act in the parent's space (world space only when the parent isn't rotated)."

### F23. docs/concept-inventory.md:212 — View matrix: "camera.matrixWorldInverse maps world into camera space. … It's the inverse."
- **Verdict:** IMPRECISE (r186 behavior)
- **Evidence:** In r186 the view matrix is the inverse of the camera's world transform **with scale removed**: "exclude scale from view matrix to be glTF conform" (`cameras/Camera.js:116-128`, and again in `updateWorldMatrix` at `Camera.js:132-146`). Knock-on effect: `Vector3.project` uses `matrixWorldInverse`, which has no scale, while `unproject` uses `matrixWorld`, which does (`Vector3.js:501,514`). For a scaled camera, or one under a scaled parent, they stop being inverses of each other. Script:

  ```
  [scaled camera: matrixWorldInverse == inverse(matrixWorld)?] false
  [scaled camera project->unproject returns] (2, 2, -10) expected (1,1,0)
  ```

  It is also refreshed only by `camera.updateMatrixWorld` / `updateWorldMatrix`.
- **Suggested wording:** "camera.matrixWorldInverse (the view matrix) maps world into camera space. It is the inverse of the camera's world transform, ignoring any scale on the camera. Don't scale cameras."

### F24. docs/concept-inventory.md:220 — "World size per pixel: At distance d: 2·d·tan(fov/2) ÷ viewport height."
- **Verdict:** IMPRECISE
- **Evidence:** The formula is exact only when:
  - `d` is the depth **along the view direction**, not straight-line distance to the camera;
  - fov is in radians (three.js `camera.fov` is in degrees, `cameras/PerspectiveCamera.js:49-55`);
  - `camera.zoom` is 1 (`updateProjectionMatrix` divides by zoom, `PerspectiveCamera.js:356`);
  - the camera is perspective.

  Script, fov 50 and viewport height 800:

  ```
  [1 world-px at depth d -> pixels] 1
  [using Euclidean distance off-axis -> pixels] 1.25
  [with zoom=2 -> pixels] 2
  ```

  Height in CSS pixels vs device pixels also changes the answer by DPR.
- **Suggested wording:** "At view depth d (distance along the camera's forward axis): 2·d·tan(fov/2) ÷ (viewport height × zoom). Convert camera.fov from degrees, and use the same kind of pixels (CSS or device) as your hotspot size."

### F25. docs/concept-inventory.md:221 — "right from forward × up"
- **Verdict:** IMPRECISE
- **Evidence:** The direction is correct: −Z × +Y = +X (right-handed system; `Vector3.js:870-881`). But the result is only unit length when the camera is level. It shrinks with pitch and collapses when looking straight up or down. Script:

  ```
  [pitched camera fwd x up] (0.362358, 0, 0) length 0.362358
  [looking straight down fwd x up length] 0.0001
  ```

  Forward from `getWorldDirection` is confirmed: cameras negate +Z (`Camera.js:106-108`), and it self-updates (`Object3D.js:1044`).
- **Suggested wording:** "Right from forward × up, normalized. It breaks when looking straight up or down; take right from the camera's matrix (first column) instead."

### F26. docs/concept-inventory.md:226 — "projecting hundreds of labels per frame is fine CPU work; thousands belong in a shader or points"
- **Verdict:** RULE-OF-THUMB
- **Evidence:** A `project()` call is two matrix multiplies (`Vector3.js:501`). With DOM labels, the real cost is usually writing CSS transforms and the browser's layout and paint, not the math. The thresholds depend on the device.
- **Suggested wording:** Keep it, marked as guidance. Optionally add: "for DOM labels, updating the elements usually costs more than the projection."

### F27. docs/concept-inventory.md:82,84 — Loop 4 "~45" drills; "Placement checks … cut that by an estimated 25–40%"
- **Verdict:** RULE-OF-THUMB (estimates)
- **Evidence:** The arithmetic that can be checked holds:
  - 152 = Loop 1 total;
  - Loop 2: 72×2 + 80/2 = 184;
  - Loop 3: 72 + 80/2 = 112;
  - 152 + 184 + 112 + 45 = 493 ≈ 490, and 490/30.4 ≈ 16.1 months.

  The ~45 depends on the AI-review and teach-back counts, which aren't specified; the cross-domain table has 15 rows. 25–40% is a guess.
- **Suggested wording:** No change; they're already labelled "Est." and "estimated".

## Ledger

Kinds: API (exists in r186), Dep (deprecated/renamed), Beh (r186 behavior), Gen (not three.js-specific), Meta (repo/process numbers).

### Builder brief, loops, tiers (lines 1–119)

| Location | Claim (short) | Kind | Verdict | Evidence (short) |
| --- | --- | --- | --- | --- |
| :24 | Stack: Vite, TS, three pinned, Vitest | Meta | OK | package.json:17 `"three": "0.186.0"`, vite 8.3.1, vitest 5.0.2 |
| :79 | Loop 1 ~152 (one per concept) | Meta | OK | domains.ts total 152 (count.mjs) |
| :80 | Loop 2 ~184 | Meta | OK | 72×2 + 80/2 = 184 |
| :81 | Loop 3 ~112 | Meta | OK | 72 + 80/2 = 112 |
| :82 | Loop 4 ~45 | Meta | RULE-OF-THUMB | F27 |
| :84 | ~490 total, ~16 months at one a day | Meta | OK | 493; 490/30.4 = 16.1 |
| :84 | placement cuts 25–40% | Meta | RULE-OF-THUMB | F27 |
| :102 | 72 core of 152; 80 light | Meta | OK | count.mjs: core 72, light 80. Core lists in :106–119 sum to 72 |
| :106–109 | D1–D4 core names match concept rows | Meta | OK | Every name appears in its domain table and in domains.ts |

### Primer (lines 121–136)

| Location | Claim (short) | Kind | Verdict | Evidence (short) |
| --- | --- | --- | --- | --- |
| :127 | CPU does matrix updates, traversal, frustum culling, sorting, issuing draws | Beh | OK | WebGLRenderer.js:1663 (updateMatrixWorld), 1860–1972 projectObject + `intersectsFrustum` (1892), 1716 `sort` |
| :127 | Raycasting on CPU | Beh | OK | Mesh.raycast in JS, objects/Mesh.js:242–267 |
| :127 | Cost scales with objects, draws, allocations | Gen | RULE-OF-THUMB | general |
| :128 | VS once per vertex per pass; × instances × passes | Gen | RULE-OF-THUMB | F1 |
| :129 | FS once per covered pixel incl. overdraw | Gen | RULE-OF-THUMB | F2 |
| :130 | GPU memory: vertex buffers, textures, RTs | Gen | IMPRECISE | F3 |
| :131 | Upload on first use / after needsUpdate; scales with changed data | Beh | IMPRECISE | F4; WebGLTextures.js:559, WebGLAttributes.js:87–90 |
| :133 | 16.67 ms @60 Hz, 8.33 ms @120 Hz | Gen | GENERAL-OK | 1000/60, 1000/120 |
| :133 | slower side sets frame time | Gen | RULE-OF-THUMB | F5 |
| :134 | render() returning fast proves nothing about the GPU | Gen | GENERAL-OK | MDN *WebGL best practices*: commands are queued; flush/readPixels/getError sync |
| :135 | pixels scale with DPR²; DPR 2 = 4× | Beh/Gen | OK | WebGLRenderer.js:683–684 canvas w and h each × pixelRatio |
| :136 | w×h×4 bytes + ~1/3 for mips | Gen | IMPRECISE | F6; script mip ratio 1.333; TextureUtils.getByteLength |
| :131 | `needsUpdate` (API) | API | OK | Texture.js:754 setter; BufferAttribute version (BufferAttribute.js:137) |

### Domain 1 (lines 138–161)

| Location | Claim (short) | Kind | Verdict | Evidence (short) |
| --- | --- | --- | --- | --- |
| :140 | `Vector3` | API | OK | math/Vector3.js |
| :144 | point − point = direction | Gen | OK | `subVectors`; standard affine geometry |
| :144 | misconception "Vector3 is always a position" is wrong | Beh | OK | the same class holds directions/velocities (`transformDirection` exists) |
| :144 | w=1 vs w=0 context | Beh | OK | see F13 for the API nuance |
| :145 | length; lengthSq skips sqrt | API/Beh | OK | Vector3.js:758 (`lengthSq`), 767 (`length` = sqrt) |
| :145 | comparing distances doesn't need real length | Gen | OK | sqrt is monotonic; `distanceToSquared` Vector3.js:967 |
| :146 | normalize = scale to length 1 | API/Beh | OK | Vector3.js:792 |
| :146 | zero vector can't be normalized | Beh | IMPRECISE | F7; returns (0,0,0) silently |
| :146 | "Always normalize" is a misconception | Gen | OK | e.g. `projectOnVector` divides by lengthSq itself (Vector3.js:889–897) |
| :147 | dot = ‖a‖‖b‖cosθ, continuous | Gen/Beh | OK | Vector3.js:745; script (3,0,0)·(2,2,0) = 6 |
| :147 | not only −1/0/1; not always in [−1,1] | Beh | OK | script `dot-nonunit 6` |
| :147 | acos of an unclamped dot → NaN | Beh | OK | script: unit·unit = 1.0000000000000002 → `Math.acos` NaN; `angleTo` clamps (Vector3.js:933–945) |
| :148 | cross ⟂ both; length ‖a‖‖b‖sinθ; right-hand rule | Beh | OK | Vector3.js:870–881; script x×y = +z, (2,0,0)×(0,3,0) length 6 |
| :148 | not unit; order matters; parallel → 0 | Beh | OK | script y×x = −z; (1,2,3)×(2,4,6) = 0 |
| :148 | `cross` mutates receiver (not stated, relevant) | Beh | OK | script `cross mutates receiver (0,0,1)` |
| :149 | projection / rejection | API/Beh | OK | `projectOnVector` Vector3.js:889 (no need to normalize), `projectOnPlane` 908 = rejection; script (0,4,0) / (3,0,5) |
| :149 | zeroing an axis only works for axis-aligned planes | Gen | OK | geometry (through the origin; offset planes need the plane constant) |
| :150 | r = d − 2(d·n)n, n unit | API/Beh | OK | `reflect` Vector3.js:922–926 "(normalized) normal" |
| :150 | "n doesn't need normalizing" is wrong | Beh | OK | script: n length 2 gives (1,7,0) not (1,1,0) |
| :151 | lerp = a + (b−a)t | API/Beh | OK | Vector3.js:820–828 |
| :151 | lerped unit vectors not unit; t not clamped | Beh | OK | script length 0.707107; t=2 → (2,0,0) |
| :152 | angleTo unsigned, 0 to π | API/Beh | OK | Vector3.js:933–945 acos(clamp) ∈ [0,π]; script a→b = b→a = 1.5708. (Returns π/2 if either vector is zero) |
| :152 | signed = atan2(cross·axis, dot) | Gen | OK | script ±1.570796 for swapped inputs |
| :153 | Spherical: phi from +Y | API/Beh | OK | math/Spherical.js:13, 126 |
| :153 | theta around Y | Beh | IMPRECISE | F8 (measured from +Z) |
| :153 | "phi from equator" wrong; poles degenerate | Beh | OK | Spherical.js:120–121 (theta=0 at pole), `makeSafe` 84–87 |
| :154 | a·(b×c) signed volume, sign = orientation | Gen | OK | script x·(y×z) = 1; `Matrix4.determinant` (Matrix4.js:626) of makeScale(−1,1,1) = −1 |
| :154 | tetrahedron volume context | Gen | OK | = triple product / 6 (worth stating on the page) |
| :155 | compare with epsilon, not == | Beh | OK | `Vector3.equals` is exact === (Vector3.js:1154–1158); script 0.1+0.2 vs 0.3 → false |
| :159 | dot/cross need a shared space | Gen | OK | geometric definition |
| :160 | `new Vector3()` per frame feeds GC; scratch vectors | Gen | RULE-OF-THUMB | F9 |
| :161 | lengthSq matters only in hot loops | Gen | RULE-OF-THUMB | F10 |

### Domain 2 (lines 163–184)

| Location | Claim (short) | Kind | Verdict | Evidence (short) |
| --- | --- | --- | --- | --- |
| :169 | each object has its own frame | Beh | OK | Object3D position/quaternion/scale relative to parent |
| :169 | world = scene root's frame | Beh | IMPRECISE | F11 |
| :169 | "object.position is world position" wrong | Beh | OK | `getWorldPosition` Object3D.js:996; script |
| :170 | matrix = local TRS rel. parent | API/Beh | OK | `updateMatrix` → `compose` Object3D.js:1144–1146 |
| :170 | matrixWorld = parent.matrixWorld × matrix | Beh | OK | Object3D.js:1190; script equality true |
| :170 | "matrixWorld is always current" wrong | Beh | OK | script stale (0,0,0) |
| :171 | `updateMatrix`, `updateMatrixWorld` | API | OK | Object3D.js:1144, 1176 |
| :171 | render updates automatically | Beh | OK (with caveat) | WebGLRenderer.js:1663, 1667 (only if matrixWorldAutoUpdate) |
| :171 | stale read right after set | Beh | OK | script |
| :171 | overall framing of update timing | Beh | IMPRECISE | F12 |
| :172 | scale, then rotate, then translate | Beh | OK | `compose` T·R·S Matrix4.js:1022; script (1,0,0) → (10,2,0) |
| :172 | `multiply` vs `premultiply` choose frame | API/Beh | OK | Matrix4.js:536–552; script local (10,0,0) vs parent (0,10,0) |
| :172 | order matters; non-uniform parent scale shears rotated children | Beh | OK | script child basis x·y = −0.6 (not 0) |
| :173 | `compose` / `decompose` | API | OK | Matrix4.js:1022, 1071 |
| :173 | shear lost on decompose | Beh | OK | script compose(decompose(M)) ≠ M, max diff 0.448 |
| :173 | (not stated) negative det → sx negated | Beh | OK (note) | Matrix4.js:1093; script scale(1,−1,1) → (−1,1,1) + 180° about Z |
| :174 | points w=1 + translation; directions w=0 | Beh | IMPRECISE | F13 |
| :174 | `applyMatrix4` wrong for directions | API/Beh | OK | Vector3.js:450; script (13,0,0) |
| :174 | `transformDirection` (implied) | API | OK / see F13 | Vector3.js:525 normalizes |
| :175 | inverse maps back | API/Beh | OK | `Matrix4.invert` Matrix4.js:735 |
| :175 | `worldToLocal` | API/Beh | OK | Object3D.js:677–683 (self-updates, uses inverse) |
| :175 | inverse = transpose only for pure rotation | Gen | IMPRECISE | F14 |
| :175 | building a view matrix context | Beh | OK | Camera.js:122 |
| :176 | `add` keeps local values, may jump | API/Beh | OK | Object3D.js:746; script (1,3,0) |
| :176 | `attach` keeps world transform | API/Beh | IMPRECISE | F15 |
| :176 | "reparenting never moves" wrong | Beh | OK | script |
| :177 | pivot via parent offset | Beh | IMPRECISE | F16 (`Object3D.pivot` exists in r186) |
| :177 | rotation isn't around geometry center | Beh | OK | rotation is about the object origin (or `pivot`), Object3D.js:1144–1158 |
| :178 | normals use inverse transpose of upper 3×3 | API/Beh | OK | `Matrix3.getNormalMatrix` Matrix3.js:352–354; `applyNormalMatrix` Vector3.js:437 (normalizes) |
| :178 | normals-as-directions breaks under non-uniform scale | Beh | OK | inline script: scale(3,1,1) normal·tangent = 0.80 as direction vs 0.00 with normal matrix; uniform scale + rotation: identical |
| :178 | (note) built-in `normalMatrix` uniform is view space | Beh | OK (note) | WebGLRenderer.js:2161 from modelViewMatrix |
| :179 | negative determinant mirrors | Gen/Beh | OK | script det = −1 |
| :179 | three.js flips culling for mirrored objects | Beh | OK | WebGLRenderer.js:1200 `object.isMesh && matrixWorld.determinantAffine() < 0` → frontFaceCW. Meshes only, based on matrixWorld; InstancedMesh per-instance mirrors aren't detected |
| :179 | not for mirrored vertex data | Beh | OK | BufferGeometry.applyMatrix4 (BufferGeometry.js:376) transforms positions/normals but never reorders the index |
| :183 | this domain is the space lens | Meta | OK | — |
| :184 | updateMatrixWorld walks subtree every frame | Beh | OK | Object3D.js:1206–1212; WebGLRenderer.js:1663 |
| :184 | static objects: `matrixAutoUpdate = false` | API/Beh | IMPRECISE | F17; script 100 world multiplies still happen |

### Domain 3 (lines 186–204)

| Location | Claim (short) | Kind | Verdict | Evidence (short) |
| --- | --- | --- | --- | --- |
| :192 | default order XYZ | API | OK | Euler.js:447 |
| :192 | "applied in a set order" | Beh | IMPRECISE | F18; script XYZ == Rx·Ry·Rz |
| :192 | order matters; rotation.y isn't always yaw | Beh | OK | matrix products don't commute (script) |
| :193 | gimbal lock at middle axis ±90° | Beh | OK | Euler.js:202 (|m13| ≥ 0.9999999 branch sets z=0); script (0.4, π/2, 0.3) → (0.7, π/2, 0), same rotation |
| :193 | not a library bug | Gen | OK | inherent to three-angle representations |
| :194 | axis-angle: angle around unit axis | API | OK | `Quaternion.setFromAxisAngle` Quaternion.js:378; `Matrix4.makeRotationAxis` 943; `Vector3.applyAxisAngle` 405 |
| :194 | `rotateOnAxis` is local | API/Beh | OK | Object3D.js:531–541 (`quaternion.multiply`); script +Z → (0,−1,0) vs world (1,0,0) |
| :194 | `rotateOnWorldAxis` | API | OK (see F19) | Object3D.js:551, "assumes no rotated parent" :555 |
| :195 | unit 4D; q ≡ −q | Beh | OK | script identical results; `applyQuaternion` assumes unit (Vector3.js:473) |
| :195 | multiply local / premultiply world | API/Beh | IMPRECISE | F19 (premultiply = parent frame) |
| :195 | components aren't angles; order matters | Beh | OK | script multiply non-commutative |
| :195 | orientation from two vectors | API | OK | `setFromUnitVectors` Quaternion.js:463 (inputs must be normalized) |
| :196 | slerp constant speed, shortest arc | API/Beh | OK | Quaternion.js:709–757 (negates when dot < 0; lerp+normalize when dot ≥ 0.9995); script 0.75/1.5/2.25 and −qb → 1.5 |
| :196 | lerping Euler ≠ slerp | Gen | OK | — |
| :197 | columns = rotated axes | Beh | IMPRECISE | F20 (scale; camera −Z) |
| :197 | `makeBasis`, `extractBasis` | API | OK | Matrix4.js:267, 239 |
| :198 | `lookAt` builds basis from forward + up | API/Beh | OK | Matrix4.js:483–531 |
| :198 | degenerates when forward ∥ up | Beh | OK | Matrix4.js:498–513 nudges by 0.0001; script |
| :198 | cameras/lights −Z; objects +Z at target | Beh | IMPRECISE | F21 (spot/directional aim via `.target`) |
| :199 | rotate about a point: translate, rotate, translate back | Gen | OK | standard; also `Object3D.pivot` (F16) |
| :200 | Euler/quat/matrix/axis-angle all convert | API | OK | Euler.setFromQuaternion (Euler.js:328) / setFromRotationMatrix (189); Quaternion.setFromEuler (301) / setFromRotationMatrix (399) / setFromAxisAngle (378); Matrix4.makeRotationFromEuler (338) / makeRotationFromQuaternion (468) / makeRotationAxis (943); axis-angle out: `Vector4.setAxisAngleFromQuaternion` (Vector4.js:494), script (0,1,0) 0.8 |
| :200 | round-trips can give different equivalent numbers | Beh | OK | script Euler(0,2,0) → (−π, 1.1416, −π) |
| :204 | rotateX and multiply local | API/Beh | OK | Object3D.js:571–573 → rotateOnAxis |
| :204 | rotateOnWorldAxis and premultiply world | Beh | IMPRECISE | F22 |

### Domain 4 (lines 206–226)

| Location | Claim (short) | Kind | Verdict | Evidence (short) |
| --- | --- | --- | --- | --- |
| :208 | a camera is two matrices | Beh | OK | `matrixWorldInverse`, `projectionMatrix` (Camera.js:43+) |
| :212 | `camera.matrixWorldInverse` maps world → camera | API/Beh | OK | Camera.js:43, 122 |
| :212 | "it's the inverse" of the camera transform | Beh | IMPRECISE | F23 (scale removed; project/unproject asymmetry) |
| :213 | perspective: vertical FOV, aspect, near, far | API/Beh | OK | PerspectiveCamera.js:33, 49–55 (degrees), 353–356; script fov 60 aspect 2 → vertical 60°, horizontal 98.2° |
| :213 | orthographic: a box | API | OK | OrthographicCamera.js:67–91 left/right/top/bottom (+near/far) |
| :213 | "FOV is horizontal" wrong; narrowing FOV ≠ dolly | Beh/Gen | OK | as above; perspective changes with dolly, not zoom |
| :214 | clip ÷ w → NDC −1..1 | Gen/Beh | OK | `applyMatrix4` divides by w (Vector3.js:455); script near → z −1, far → z +1 (WebGL default; WebGPU/reversed depth use z 0..1, Matrix4.js:1140 params) |
| :214 | map to pixels with y flipped; NDC y is up | Gen/Beh | OK | script point above center → ndc y +0.214 |
| :215 | `project` world → NDC | API | OK | Vector3.js:499–503 |
| :215 | `unproject` NDC → world at chosen depth | API | OK | Vector3.js:512–516; script z=−1 → 0.1 (near), z=1 → 100 (far); depth is non-linear NDC z |
| :215 | behind-camera point can land on screen; check z | Beh | OK | script (0.5,0.5,20) behind cam → ndc (−0.107, −0.107, 1.022): x,y in range, z > 1 |
| :216 | depth non-linear; precision near the near plane; near is the lever | Gen | GENERAL-OK | NVIDIA "Depth Precision Visualized"; script ndc z at 1/10/50 m: 0.80/0.98/0.998 |
| :216 | logarithmic depth trade-off | API | OK | WebGLRenderer.js:3699 `logarithmicDepthBuffer`. r186 also offers `reversedDepthBuffer` (WebGLRenderer.js:83, 3701), worth a mention |
| :217 | frustum = 6 planes from projection × view | API/Beh | OK | Frustum.js:95; WebGLRenderer.js:1686–1687 builds proj·viewInverse; script 6 planes |
| :217 | culling doesn't test triangles | Beh | OK | Frustum.intersectsObject uses bounding sphere × matrixWorld (Frustum.js:146–160); Mesh.intersectsFrustum (Mesh.js:226) |
| :218 | update aspect + `updateProjectionMatrix` | API | OK | PerspectiveCamera.js:102, 353 |
| :218 | `setSize` doesn't fix aspect | Beh | OK | WebGLRenderer.js:671–694 touches only canvas/viewport, never a camera |
| :219 | fit distance from sphere radius + narrower FOV | Gen | OK | hFOV = 2·atan(tan(vFOV/2)·aspect) (script 98.2° at aspect 2); exact distance r/sin(fov/2) |
| :219 | vertical FOV not enough on portrait | Beh | OK | aspect < 1 makes horizontal the narrower one |
| :220 | size per pixel 2·d·tan(fov/2)/H | Gen/Beh | IMPRECISE | F24 |
| :220 | on-screen size varies with depth | Gen | OK | — |
| :221 | forward from `getWorldDirection` | API/Beh | OK | Camera.js:106–108 negates +Z; self-updates Object3D.js:1044 |
| :221 | right from forward × up | Beh | IMPRECISE | F25 (normalize; degenerate at ±90° pitch) |
| :221 | "camera forward is +Z" wrong | Beh | OK | Camera.js:100–108 "looks down its local, negative z-axis" |
| :225 | chain local → world → view → clip → NDC → screen | Gen | OK | matches `modelViewMatrix`/`projectionMatrix` and `project` |
| :226 | hundreds fine, thousands → shader/points | Gen | RULE-OF-THUMB | F26 |

### Verdict counts (ledger rows)

Findings section has 27 entries: 20 IMPRECISE, 7 RULE-OF-THUMB. F27 covers two ledger rows, and F22 has the same cause as F19.

| Verdict | Count |
| --- | --- |
| OK | 109 |
| GENERAL-OK | 3 |
| IMPRECISE | 20 |
| RULE-OF-THUMB | 9 |
| WRONG | 0 |
| OUTDATED | 0 |
| UNVERIFIED | 0 |
