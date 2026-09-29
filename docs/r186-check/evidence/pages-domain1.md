# Domain 1 pages: r186 accuracy check

Scope: `drills/1/math/*/read-the-code-1/{README.md,questions.ts,scenes.ts}` (12 concepts) and `concepts/math/*.md` (12 cards), checked against three@0.186.0 (`THREE.REVISION` prints `186`).

Proof scripts (all in this folder, run with `node <file>` from the repo; they import `three` from the repo's node_modules):
- `t1.mjs`: point vs direction, length, normalize, dot, cross
- `t2.mjs`: reflect, raycast normals, lerp, angle, spherical, projection, triple product
- `t3.mjs`: float tolerance (0.1+0.2, full turn, float32 gaps, collinear areas and crosses)
- `t4.mjs`: non-unit ray directions, cross product of collinear points, lookAt straight down

Source paths below are relative to `node_modules/three/`.

**Quiz keys:** all 42 questions have the right answer marked, and every wrong choice really is wrong (with the caveats in F9, F12, F16 and F22). No quiz has a wrong key.

## Findings

### F1. Dot product heading "Only for length-1 directions": IMPRECISE (the suspected item)
- **Location:** `drills/1/math/dot-product/read-the-code-1/README.md:48`
- **Claim:** heading "Only for length-1 directions"
- **Verdict:** IMPRECISE. The paragraph under it is correct: only the −1 to 1 scale needs length-1 inputs. The heading alone reads as "the dot product only works on unit vectors." That's false, and it contradicts the same page's front-or-behind section (L61, "you don't need to normalize") and quiz Q2, where the answer 10 is a valid result.
- **Evidence:** `t1.mjs`: `(0,0,−2)·(0,0,−5) = 10`. `src/math/Vector3.js` `dot` is a plain sum of products with no length assumption.
- **Fix:** Rename it to something like "The −1 to 1 scale needs length-1 directions" or "When the score stays between −1 and 1".

### F2. Dot product "In short" drops the length-1 condition: IMPRECISE
- **Location:** `drills/1/math/dot-product/read-the-code-1/README.md:17` (A section L27–29 too)
- **Claim:** "1 for the same way, 0 at right angles, −1 for opposite."
- **Verdict:** IMPRECISE. This only holds when both inputs have length 1. The concept card (`concepts/math/dot-product.md:21`) says so, but the page summary doesn't. The page lists the misconception "always within [−1, 1]", and this summary line states that very misconception.
- **Fix:** Add "…when both have length 1" to the summary, as the card does.

### F3. Normalize page says the dot product "gives wrong answers" without normalizing: IMPRECISE
- **Location:** `drills/1/math/normalize/read-the-code-1/README.md:38`
- **Claim:** "lighting, raycasting, and the dot product all give wrong answers otherwise."
- **Verdict:** IMPRECISE. Raycasting really does break: a ray direction of length 0.2 misses a sphere that a unit direction hits, and `Ray.distanceToPoint` returns 72 instead of 1 (`t4.mjs`). The dot product doesn't break. It returns the correct value scaled by both lengths, and the dot page itself says its sign is fine unnormalized.
- **Fix:** "…and the dot product can't be read as a −1 to 1 score otherwise."

### F4. "Many three.js methods already hand you unit directions": raycaster ray and face normals: IMPRECISE
- **Location:** `drills/1/math/normalize/read-the-code-1/README.md:57`
- **Claim:** "`camera.getWorldDirection()`, a raycaster's ray, and face normals from a raycast" are unit.
- **Verdict:** IMPRECISE.
  - `getWorldDirection` is always unit (`src/core/Object3D.js:1048` normalizes, and `src/cameras/Camera.js:108` negates). OK.
  - A raycaster's ray is only unit if you gave it a unit direction or used `setFromCamera`. `Raycaster.set` copies the direction as given (`src/core/Raycaster.js:104-108`, "direction is assumed to be normalized"). `setFromCamera` normalizes (L124). In `t1.mjs`, `rc.set(o, (0,0,−5))` leaves the direction at `(0,0,−5)`.
  - `hit.face.normal` is unit (`src/objects/Mesh.js:497` → `Triangle.getNormal`, which normalizes), but it's in the object's local space, not world space. `t2.mjs`: on a mesh rotated 90° about Z, the face normal is `(0.371, −0.240, 0.897)` and its world version is `(0.240, 0.371, 0.897)`.
- **Fix:** "`getWorldDirection()`, a ray from `raycaster.setFromCamera()`, and `hit.face.normal` (which is in the object's own space)."

### F5. Reflection: "raycast hit normals are already length 1": WRONG
- **Location:** `drills/1/math/reflection/read-the-code-1/README.md:39`
- **Claim:** "Normals from three.js, such as raycast hit normals, are already length 1"
- **Verdict:** WRONG for `hit.normal`, the field the phrase most naturally means. `hit.normal` blends the three corner normals by barycentric weights and isn't renormalized (`src/objects/Mesh.js:477-485`). `t2.mjs` measures a length of 0.902 on a SphereGeometry hit. Only `hit.face.normal` is unit. Both are in the mesh's local space, so reflecting a world-space velocity off either one is wrong once the mesh is rotated. For a bounce page, that is the more likely bug.
- **Fix:** "`hit.face.normal` has length 1, but `hit.normal` (the smoothed one) doesn't, so normalize it. Both are in the object's own space: turn them into world space with `.transformDirection(mesh.matrixWorld)` before reflecting a world velocity." (For non-uniform scale, the exact fix uses the normal matrix, which a later domain covers.)

### F6. Reflection: "seven times too fast": IMPRECISE
- **Location:** `drills/1/math/reflection/read-the-code-1/README.md:39`
- **Claim:** "a normal of length 2 sends the ball up seven times too fast."
- **Verdict:** IMPRECISE. The upward part is 7× what it should be, but the ball's overall speed isn't 7× anything. At the scene's default 40°, the bounce is 5.4× the correct speed. Across the slider it runs from 6.9× at 10° to 1.56× at 80°.
- **Evidence:** `t2.mjs`: `vertical ratio 7.000`, `speed ratio 5.40` at 40°, `6.90` at 10°, `1.56` at 80°. `src/math/Vector3.js:922-924`: `this.sub(normal * 2 * dot(this, normal))`, so a length-2 normal subtracts 4× the projection instead of 1×.
- **Fix:** "…sends the ball up with seven times the upward speed it should have."

### F7. Cross product card: "length grows the further apart the two inputs are spread": IMPRECISE
- **Location:** `concepts/math/cross-product.md:20`
- **Claim:** as above.
- **Verdict:** IMPRECISE. The length peaks at right angles and drops back to 0 at opposite directions. It also scales with both input lengths. The page gets this right (`README.md:39`, "At right angles, it's longest"), so the card contradicts it.
- **Evidence:** `t1.mjs`: for unit inputs, the length is 0, 0.707, 1, 0.707, 0 at 0°, 45°, 90°, 135°, 180°.
- **Fix:** "…whose length is largest when the inputs are at right angles and zero when they line up, same way or opposite."

### F8. Cross product gotcha: sliver triangles and lookAt: IMPRECISE
- **Location:** `drills/1/math/cross-product/read-the-code-1/README.md:82`
- **Claim:** "Parallel inputs give (0, 0, 0), and normalizing that gives (0, 0, 0) too. It shows up with sliver triangles, whose edges almost line up, and later with `lookAt` when the forward and up directions line up."
- **Verdict:** IMPRECISE, in two ways.
  1. Edges that *almost* line up give a tiny cross product that isn't zero. `normalize()` then returns a vector of length exactly 1 pointing in a meaningless direction. It doesn't return (0,0,0). This is also what happens with truly collinear points in floating point: in `t3.mjs`, the edges from 10,000 random collinear triangles give a nonzero cross product 9,650 times. In `t4.mjs`, three collinear points give "normals" of `(0.83, −0.55, 0)` and `(0.33, −0.33, 0.88)`, each of length 1. So the real sliver bug is a confident, random normal, which is worse than a zero one. It also contradicts the float page (`float-tolerance/README.md:74`), which says correctly that nearly parallel directions give a *tiny* cross product.
  2. In r186, `lookAt` catches the parallel case. `Matrix4.lookAt` (`src/math/Matrix4.js:500-515`) nudges the direction by 0.0001 and crosses again, so you never get zero. The symptom is a sudden spin, not a zero vector. `t4.mjs`: a camera at (0,5,0) looking at the origin gets a valid quaternion with no NaN.
- **Fix:** "Exactly parallel inputs give (0, 0, 0), and normalizing leaves it (0, 0, 0). Nearly parallel ones, like the edges of a sliver triangle, give a tiny cross product that normalizes to a length-1 vector pointing somewhere random, so check the length before normalizing. `lookAt` guards its own version of this but can spin suddenly when forward and up line up."

### F9. Cross product quiz Q4 calls exactly parallel edges a "sliver triangle": IMPRECISE
- **Location:** `drills/1/math/cross-product/read-the-code-1/questions.ts:31-36`
- **Claim:** the comment says the edges "point the same way (a sliver triangle)", and the key is "(0, 0, 0), with no warning".
- **Verdict:** IMPRECISE. The key is right if the edges point *exactly* the same way, and both other choices are wrong. But edges from real sliver or collinear triangles usually give a tiny nonzero cross product, and normalizing that gives a random unit vector (see F8). Someone who remembers "sliver → (0,0,0)" will write a `n.lengthSq() === 0` check that misses most slivers.
- **Fix:** Drop "(a sliver triangle)", or make the snippet literal (`edge1 = (1,0,0)`, `edge2 = (2,0,0)`). If slivers stay, add a separate question whose answer is "a length-1 vector in a random direction".

### F10. Length: the squared-vs-plain radius bug "silently uses a much smaller circle": IMPRECISE
- **Location:** `drills/1/math/length/read-the-code-1/README.md:60`
- **Claim:** "Comparing a squared distance to a plain radius … silently uses a much smaller circle than you meant."
- **Verdict:** IMPRECISE. The circle is smaller only when the radius is over 1. When the radius is under 1, the circle is *bigger*: `d² < 0.5` means `d < 0.707` (`t1.mjs`). Quiz Q2 uses radius 3, so its key (≈1.7) is right.
- **Fix:** "…uses the wrong circle: smaller than you meant for radii over 1, bigger for radii under 1."

### F11. Length: lengthSq is "just as good for comparing": IMPRECISE (minor)
- **Location:** `concepts/math/length.md:17`, `drills/1/math/length/read-the-code-1/README.md:15`
- **Claim:** lengthSq "works just as well for comparing" / is "just as good for comparing."
- **Verdict:** IMPRECISE. It's true for comparing lengths with each other, since squaring keeps the order for non-negative numbers. It's false when comparing against a fixed number unless you square that number too, which is F10's bug. The page body explains this, but the card and summary lines stand alone.
- **Fix:** "…just as good for comparing lengths with each other (square any fixed limit you compare against)."

### F12. Point vs direction Q1: a per-second velocity is added without delta: IMPRECISE
- **Location:** `drills/1/math/point-vs-direction/read-the-code-1/questions.ts:6-7` (key choice at L10)
- **Claim:** snippet `const velocity = new Vector3(0, 0, -2); // per second` followed by `ship.position.add(velocity);`. The key reads "2 units into the screen, every second".
- **Verdict:** IMPRECISE. The key is right about what the numbers *mean* (a move), and the other two choices are wrong. But the code adds the full 2 units every time it runs. In a render loop that's 2 units per frame, not per second, so the snippet does something different from what its comment and key say. The normalize page (`normalize/README.md:48`) uses the correct pattern, `addScaledVector(dir, speed * delta)`.
- **Fix:** Change the second line to `ship.position.addScaledVector(velocity, delta); // delta: seconds since last frame`.

### F13. Point vs direction: "Don't add two positions together": IMPRECISE (minor)
- **Location:** `drills/1/math/point-vs-direction/read-the-code-1/README.md:79`
- **Claim:** "Don't add two positions together; the result isn't a meaningful place."
- **Verdict:** IMPRECISE. The sum on its own isn't a place, which is correct. But "don't add" is too strong: the standard midpoint and average are `(a + b) / 2`, and a centroid is `(a + b + c) / 3`. The repo's own scenes do exactly this (`cross-product/scenes.ts:83`, `triple-product/scenes.ts:13`).
- **Fix:** "Adding two positions doesn't give a place by itself. Halve the sum, or use `lerp(b, 0.5)`."

### F14. Angle: "three.js measures angles in radians": IMPRECISE
- **Location:** `drills/1/math/angle-between/read-the-code-1/README.md:25`
- **Claim:** "three.js measures angles in **radians**, not degrees."
- **Verdict:** IMPRECISE. It's true for rotations, `angleTo`, `Spherical`, and `applyAxisAngle`, but `PerspectiveCamera.fov` is in degrees (`src/cameras/PerspectiveCamera.js:50`, default `fov` 50). That's a well-known exception and a common interview question. L61, "Every three.js rotation is in radians", is correct.
- **Fix:** Add "…with one well-known exception: a camera's `fov` is in degrees."

### F15. Angle: atan2 gives "an angle from −180° to 180°": IMPRECISE (minor)
- **Location:** `drills/1/math/angle-between/read-the-code-1/README.md:48`
- **Claim:** "`Math.atan2` turns the pair into an angle from −180° to 180°"
- **Verdict:** IMPRECISE. `Math.atan2` returns radians, −π to π. `t2.mjs`: target behind gives `3.14159`. On a page about radians catching everyone, writing the range in degrees invites the exact `toFixed` bug that Q4 tests.
- **Fix:** "…an angle from −π to π radians (−180° to 180°)."

### F16. Projection Q3 comment "running straight into it": IMPRECISE
- **Location:** `drills/1/math/projection-rejection/read-the-code-1/questions.ts:27`
- **Claim:** "velocity is (−2, 0, 0): running straight into it", with wall normal (0.8, 0, 0.6).
- **Verdict:** IMPRECISE. The velocity comes in 36.9° off head-on (`t2.mjs`). The key and explanation depend on that angle: `projectOnPlane` gives `(−0.72, 0, 0.96)`, a slide. A truly head-on velocity would give (0,0,0) with `projectOnPlane` too, and the explanation "so the character slides" would be false. The key ("stops dead") and the wrong choices are otherwise correct.
- **Fix:** "velocity is (−2, 0, 0): running along −X, into the wall at an angle".

### F17. Spherical: "zooming changes the radius": IMPRECISE (minor)
- **Location:** `drills/1/math/spherical-coords/read-the-code-1/README.md:45`
- **Claim:** "`OrbitControls` keeps the camera's position around its target as spherical coordinates: dragging changes theta and phi, and zooming changes the radius."
- **Verdict:** IMPRECISE. That's true for a PerspectiveCamera. For an OrthographicCamera, zoom changes `camera.zoom` and leaves the radius alone (`examples/jsm/controls/OrbitControls.js:776-786` and `833-841`). Also, OrbitControls doesn't store the spherical position; it recomputes it from the offset on every `update()` (L707) and then calls `makeSafe()` (L755). That's fine at a high level.
- **Fix:** "…and zooming a perspective camera changes the radius (an orthographic camera changes `zoom` instead)."

### F18. Spherical Q3 explanation: "this is what `makeSafe()` does": IMPRECISE (minor)
- **Location:** `drills/1/math/spherical-coords/read-the-code-1/questions.ts:27, 35`
- **Claim:** the snippet clamps phi to `[0.0001, π − 0.0001]`, and the explanation says "this is what `makeSafe()` does."
- **Verdict:** IMPRECISE. `makeSafe()` does the same kind of clamp, but with a margin of 0.000001, not 0.0001 (`src/math/Spherical.js:86`, `EPS = 0.000001`; `t2.mjs` prints `0.000001`). The key and wrong choices are correct.
- **Fix:** "…this is what `makeSafe()` does, with an even smaller margin."

### F19. Float: "`toBeCloseTo(y)` does the same for numbers": IMPRECISE
- **Location:** `drills/1/math/float-tolerance/read-the-code-1/README.md:66`
- **Claim:** Right after a `< 1e-6` check: "In Vitest, `expect(x).toBeCloseTo(y)` does the same for numbers."
- **Verdict:** IMPRECISE. The default tolerance is far looser: 2 decimal places, meaning a difference under 0.005. `node_modules/vitest/dist/chunks/index.DGdajAO2.js:2168-2178` has `precision = 2` and `expectedDiff = 10 ** -precision / 2` (vitest 5.0.2 as installed).
- **Fix:** "`expect(x).toBeCloseTo(y, 6)` does the same for numbers (the second argument is decimal places; it defaults to 2, which is 0.005)."

### F20. Float: "a 1e-6 check can never pass" near 5,000: IMPRECISE
- **Location:** `drills/1/math/float-tolerance/read-the-code-1/README.md:70`
- **Claim:** "For float32 positions around 5,000, the gap between storable values is about 0.0005, so a 1e-6 check can never pass."
- **Verdict:** IMPRECISE. The gap is right: 0.000488 (`t3.mjs`). But taken literally, "never pass" is false. The check passes whenever the two values are the *same* float32, which is common for positions computed the same way (`t3.mjs`: `same float32 -> true`). The real point is that 1e-6 is smaller than the gap, so the check is no better than `===`. Quiz Q3's explanation ("real matches fail") is accurate.
- **Fix:** "…so a 1e-6 check only passes when the values are exactly equal: it's no better than `===`."

### F21. Float: "Content far from the origin jitters and crumples": IMPRECISE
- **Location:** `drills/1/math/float-tolerance/read-the-code-1/README.md:82`
- **Claim:** "Content far from the origin jitters and crumples, like the sphere above."
- **Verdict:** IMPRECISE for three.js. The sphere demo is right, because its *vertex data* holds the big numbers (`float-tolerance/scenes.ts:35`). But a normal-sized mesh placed far away with `mesh.position`, with the camera nearby, doesn't crumple. `Matrix4.elements` is a plain JS array of 64-bit numbers (`src/math/Matrix4.js:86`), and the renderer combines object and camera on the CPU (`src/renderers/WebGLRenderer.js:2160`, `object.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld)`), so the float32 matrix the GPU gets holds small numbers. Precision problems far out come from vertex data with big coordinates (merged or baked geometry, map data), shader math done in world space, depth precision, and physics. The floating-origin advice still stands. This part is from the source, not a render test: Node has no WebGL.
- **Fix:** "Geometry whose own vertex numbers are huge crumples, like the sphere above. three.js does the object-to-camera math in 64-bit on the CPU, so moving an ordinary mesh far away is safer, but world-space shader math, depth, and physics still lose precision. When a scene spans kilometers, …"

### F22. Float Q2: the full-turn point is unspecified: IMPRECISE (minor)
- **Location:** `drills/1/math/float-tolerance/read-the-code-1/questions.ts:13-18`
- **Claim:** `point.clone().applyAxisAngle(up, Math.PI * 2)` followed by `.equals(point)`. The key is "false, off by a tiny rounding error".
- **Verdict:** IMPRECISE. The key holds for typical points: `t3.mjs` found 0 of 10,000 random points equal after the turn, and (1,0,0) ends up off by 2.45e-16, matching the explanation's "about 0.0000000000000002". But a point on the axis, such as (0,5,0) or (0,0,0), comes back exactly equal and returns `true`. The snippet never defines `point` or `up`.
- **Fix:** Define them in the snippet, e.g. `const point = new Vector3(1, 0, 0); const up = new Vector3(0, 1, 0);`.

### F23. Triple product: 0 means "exactly on the surface": IMPRECISE (minor)
- **Location:** `drills/1/math/triple-product/read-the-code-1/README.md:28`, also the `'on the triangle'` label in `triple-product/scenes.ts:38`
- **Claim:** "0 means it's exactly on the surface."
- **Verdict:** IMPRECISE. 0 means the point is on the triangle's *plane*, which extends forever. It could be far outside the triangle. `Plane.distanceToPoint` (`src/math/Plane.js`, `normal.dot(point) + constant`) behaves the same way. In this scene the point only moves through the triangle's center, so the scene label is fine as shown.
- **Fix:** "0 means it's exactly on the triangle's plane (not necessarily inside the triangle)."

### F24. Triple product: "A mirrored object can light up inside-out": IMPRECISE
- **Location:** `drills/1/math/triple-product/read-the-code-1/README.md:56`
- **Claim:** as above.
- **Verdict:** IMPRECISE for three.js. The renderer detects a mirrored mesh and fixes it: `src/renderers/WebGLRenderer.js:1200` has `const frontFaceCW = ( object.isMesh && object.matrixWorld.determinantAffine() < 0 )`, which flips which winding counts as the front. The normal matrix also turns normals correctly under mirroring. So `mesh.scale.x = -1` on an ordinary mesh renders correctly. Mirroring still causes trouble where three.js doesn't look: InstancedMesh instance matrices (only `object.matrixWorld` is checked), normal-map tangents, exporters, physics, and your own geometry code. (r186 uses `determinantAffine()` internally; `matrix.determinant()` from L62 still exists.)
- **Fix:** "three.js notices a mirrored mesh and flips which side counts as the front, but your own code (custom geometry, instances, physics, exporters) has to check for itself."

### F25. Triple product Q2 explanation: "Only a flip, like a negative scale": IMPRECISE (minor)
- **Location:** `drills/1/math/triple-product/read-the-code-1/questions.ts:22`
- **Claim:** "Only a flip, like a negative scale, reverses them."
- **Verdict:** IMPRECISE. A negative scale on *two* axes isn't a mirror; it's a 180° turn. The check gives +1 (`t2.mjs`: scale (−1,−1,1) → triple +1, det +1). A negative scale on one axis or all three is a mirror. The key ("a scale of −1 on one axis") is correct, as are both wrong choices: turning upside down gives +1 (`t2.mjs`).
- **Fix:** "Only a flip, a negative scale on one axis or all three, reverses them."

### F26. Concept cards: four `misconceptions` entries read as true facts: IMPRECISE (wording from the inventory)
- **Location:** `concepts/math/cross-product.md:10` (`parallel-zero: Parallel inputs give zero.`), `concepts/math/dot-product.md:10` (`acos-unclamped: acos of an unclamped dot returns NaN.`), `concepts/math/normalize.md:9` (`zero-vector: A zero vector can't be normalized.`), `concepts/math/spherical-coords.md:9` (`poles: The poles are degenerate.`)
- **Verdict:** IMPRECISE. Each one is listed as a misconception but states something true, or at least the correct warning. Anyone reading the card as "wrong beliefs" is told these truths are wrong. "A zero vector can't be normalized" is also not how r186 behaves: `normalize()` runs and quietly returns (0,0,0) (`src/math/Vector3.js:792-794`; `t1.mjs`, no warning). The other misconception entries (e.g. `"Returns a unit vector."`, `"Order doesn't matter."`) are in quotes and phrased as the wrong belief. These four aren't. The wording comes from `docs/concept-inventory.md`, so per CLAUDE.md, flag it to Brad rather than editing.
- **Fix (for Brad):** Phrase them as the wrong belief, e.g. `"Parallel inputs still give a usable direction."`, `"Math.acos(a.dot(b)) is always safe for unit vectors."`, `"Normalizing a zero vector throws or gives a default direction."`, `"theta still means something at the poles."`

## Ledger

Abbreviations: pvd = point-vs-direction; R = README.md; Q = questions.ts; S = scenes.ts; C = concept card. Script refs are to the files in this folder.

### point-vs-direction
| Location | Claim / question | Verdict | Evidence |
| --- | --- | --- | --- |
| pvd R:15 | A Vector3 can be a point or a direction; three.js can't tell | OK | Vector3 has no w; the method you call decides (applyMatrix4 vs transformDirection) |
| pvd R:25-27 | X right, Y up, Z toward you, −Z into the screen | OK | Right-handed, default camera looks down −Z (`Camera.getWorldDirection` → (0,0,−1), t1) |
| pvd R:29 | Most projects treat 1 unit as a meter | RULE-OF-THUMB | Convention (WebXR and physical lights assume meters) |
| pvd R:33 | Every object has `position` | OK | Object3D.position |
| pvd R:54 | `camera.getWorldDirection(v)` is the way the camera faces | OK | Camera.js:106-108 negates +Z; unit (Object3D.js:1048) |
| pvd R:64-69 | `b.clone().sub(a)` is the move; sub/add/multiplyScalar/normalize mutate | OK | t1: (3,2,0); `b.sub(a)` returns b itself |
| pvd R:76 | `position.add(move)` moves an object | OK | Vector3.add |
| pvd R:79 | Don't add two positions | IMPRECISE | F13 |
| pvd R:82 | `a.clone().lerp(b, 0.5)` is the midpoint | OK | Vector3.lerp |
| pvd R:91 | `lookAt(v)` wants a place | OK | Object3D.lookAt takes a world-space target |
| pvd R:92 | `new ArrowHelper(dir, origin)` | OK | t: ArrowHelper(dir, origin) puts it at the origin arg |
| pvd R:93 | `raycaster.set(origin, direction)` | OK | Raycaster.js:104 |
| pvd R:95 | `lookAt(dir)` aims at the spot (0,0,−3) | OK | lookAt treats its arg as a world point |
| pvd Q1 | Meaning of `velocity` that is added to position | IMPRECISE | Key right; snippet skips delta (F12) |
| pvd Q2 | `b.clone().sub(a)` = (3,2,0) | OK | t1 |
| pvd Q3 | `b.sub(a)` then copy b: marker at the move's numbers | OK | t1: `move === b`, b = (3,2,0) |
| pvd Q4 | `turret.lookAt(dir)` faces the spot matching dir | OK | lookAt semantics; "usually" correctly hedges the origin case |
| pvd S | lerpVectors, MathUtils.smootherstep, addScaledVector, lookAt | OK | All exist in r186 (API check); lookAt comment matches |
| pvd C:17 | Move = second place − first | OK | — |
| pvd C:21 | Shifting everything changes places, never moves | GENERAL-OK | Translation invariance of differences (standard linear algebra) |
| pvd C:8,10-12 | Misconception and contexts (w=1 vs w=0 etc.) | OK | applyMatrix4 (w=1) vs transformDirection (w=0) exist |

### length
| Location | Claim / question | Verdict | Evidence |
| --- | --- | --- | --- |
| length R:15 | lengthSq works just as well for comparing | IMPRECISE | F11 |
| length R:23-26 | (3,0,−4).length() = 5 | OK | t1 |
| length R:32 | `a.distanceTo(b)` = `b.clone().sub(a).length()` | OK | t1 (5) |
| length R:44 | √(x²+y²+z²) | GENERAL-OK | Euclidean norm |
| length R:52 | squared versions skip a sqrt; keep order | OK | Squaring is monotonic for d ≥ 0 |
| length R:52 | sqrt is "the slowest step" | RULE-OF-THUMB | Not measurable in a meaningful way |
| length R:57 | compare to `radius * radius` | OK | — |
| length R:60 | "much smaller circle" | IMPRECISE | F10 |
| length R:64 | `setLength`, `clampLength(min,max)` keep direction | OK | Vector3.js:655-659; t1 same direction after clamp |
| length Q1 | Squared distance finds the same nearest enemy | OK | Monotonic; wrong choices false |
| length Q2 | `d² < 3` means within ~1.7 | OK | t1: √3 = 1.732 |
| length Q3 | `clampLength(0,5)` on length 8 gives 5, same direction | OK | t1: 5.000000000000001, same unit direction |
| length S | distanceTo, lines; "walking the blocks" = abs x + abs z | OK | — |
| length C:17 | lengthSq "just as good for comparing" | IMPRECISE | F11 |
| length C:21 | Skipping sqrt only matters in big loops | RULE-OF-THUMB | — |

### normalize
| Location | Claim / question | Verdict | Evidence |
| --- | --- | --- | --- |
| normalize R:16,24 | Keeps direction, length 1; "unit vector" | OK | Vector3.js:792-794 |
| normalize R:27 | (3,0,−4).normalize() = (0.6,0,−0.8) | OK | t1 (0.6000000000000001) |
| normalize R:38 | Lighting, raycasting, dot give wrong answers unnormalized | IMPRECISE | F3 (raycast: confirmed, t4; dot: not wrong) |
| normalize R:47-51 | Aim, normalize, scale by speed·delta | OK | — |
| normalize R:55 | Don't normalize velocity/offset | OK | — |
| normalize R:57 | Methods that hand you unit directions | IMPRECISE | F4 |
| normalize R:61 | Zero vector: no error, returns (0,0,0) | OK | Vector3.js:794 `length() \|\| 1`; t1, no warn |
| normalize R:64 | `lengthSq() > 0` guard | OK | — |
| normalize Q1 | normalized dir × 2: moves 2 units at any distance | OK | Unit × 2; wrong choices false |
| normalize Q2 | normalizing a velocity: 6 u/s becomes 1 | OK | — |
| normalize Q3 | At the target: (0,0,0), no warning | OK | t1 |
| normalize S | RingGeometry.rotateX, setY, normalize; label "length 1" | OK | API check |
| normalize C:18 | Definition | OK | — |
| normalize C:9 | "A zero vector can't be normalized" listed as a misconception | IMPRECISE | F26 |

### dot-product
| Location | Claim / question | Verdict | Evidence |
| --- | --- | --- | --- |
| dot R:17 | 1 / 0 / −1 summary with no length-1 condition | IMPRECISE | F2 |
| dot R:27-31 | Smooth scale; 0.9 a little apart, 0.5 further, negative past 90° | OK | cos θ for unit vectors |
| dot R:39 | `a.dot(b)`; GLSL `dot(a,b)` | OK | — |
| dot R:44 | Formula; (1,0,0)·(0,1,0) = 0 | GENERAL-OK | Definition |
| dot R:48 | Heading "Only for length-1 directions" | IMPRECISE | F1 |
| dot R:50 | Scale holds only for unit; otherwise × both lengths; sign still meaningful | OK | t1: 10 |
| dot R:57-61 | Front/behind via sign, no normalize needed | OK | — |
| dot R:65-69 | cos(60°) = 0.5 threshold | OK | t1: 0.5000000000000001 |
| dot R:77-80 | `max(dot(N,L),0)`; 1 / 0 / negative clamped | OK | — |
| dot R:86 | acos(dot) can be NaN from 1.0000000000000002; angleTo guards | OK | t1: 23% of random unit vectors have v·v = 1.0000000000000002, acos NaN; angleTo 0; Vector3.js:933-943 clamps |
| dot Q1 | 45°: about 0.71 | OK | t1: 0.7071 |
| dot Q2 | (0,0,−2)·(0,0,−5) = 10 | OK | t1 |
| dot Q3 | `> 0.5` means within 60° | OK | cos 60° = 0.5 |
| dot Q4 | Facing away: max clamps −1 to 0 | OK | GLSL max |
| dot Q5 | acos of unit self-dot is sometimes NaN | OK | t1 (the "exactly 0" choice is wrong: NaN happens) |
| dot S | ShaderMaterial + gl_FragColor + `#include <colorspace_fragment>`; comment "never rotated or scaled, so normals face world directions" | OK | WebGLProgram.js:820 defines gl_FragColor; translation doesn't change directions |
| dot C:21 | Definition with "when both have length 1" | OK | — |
| dot C:8-9 | Misconceptions "only −1,0,1", "always in [−1,1]" | OK | — |
| dot C:10 | "acos of an unclamped dot returns NaN" listed as a misconception | IMPRECISE | F26 |
| dot C:12-16 | Contexts (front/behind, Lambert, projection length, plane distance, cone) | OK | Plane.distanceToPoint = normal·p + constant |

### cross-product
| Location | Claim / question | Verdict | Evidence |
| --- | --- | --- | --- |
| cross R:17 | Right angles to both; swapping flips it | OK | t1 |
| cross R:30 | (1,0,0)×(0,0,−1) = (0,1,0) | OK | t1 (−0, 1, 0) |
| cross R:33 | Right-hand rule | OK | Right-handed coordinates |
| cross R:39 | Length = parallelogram area; 0 when lined up; longest at 90° | OK | t1 length table |
| cross R:48 | Component formula | GENERAL-OK | Definition |
| cross R:56-61 | `crossVectors(b−a, c−a).normalize()` for the normal | OK | t1: matches Plane.setFromCoplanarPoints |
| cross R:64 | Corner order decides the front; three.js uses the same rule | OK | t1: counter-clockwise triangle → computeVertexNormals (0,0,1); front side = counter-clockwise |
| cross R:73-74 | `cross(forward, toTarget).y > 0` means left (Y up) | OK | t1: left 1, right −1 |
| cross R:81 | `a.cross(b)` overwrites a; `crossVectors` keeps inputs | OK | Vector3 API |
| cross R:82 | Parallel → 0; slivers; lookAt | IMPRECISE | F8 |
| cross R:83 | Area = ½ cross length; `Triangle.getArea()` | OK | t1: 0.5 |
| cross Q1 | right × up = +Z | OK | t1 |
| cross Q2 | up × right = −Z | OK | t1 |
| cross Q3 | (2,0,0)×(0,0,−3) needs normalizing | OK | t1: (0,6,0) |
| cross Q4 | Exactly parallel edges → (0,0,0) | IMPRECISE | Key right literally; "sliver" framing misleads (F9) |
| cross S | BufferAttribute/setIndex/setFromPoints; comment "area is the result's length" | OK | API check |
| cross C:20 | "length grows the further apart" | IMPRECISE | F7 |
| cross C:8-9 | Misconceptions "unit result", "order-free" | OK | — |
| cross C:10 | "Parallel inputs give zero" listed as a misconception | IMPRECISE | F26 |
| cross C:24 | Same space in and out | OK | — |

### angle-between
| Location | Claim / question | Verdict | Evidence |
| --- | --- | --- | --- |
| angle R:23 | angleTo ranges 0 to π | OK | Vector3.js:943 acos of clamped value |
| angle R:25 | three.js measures angles in radians | IMPRECISE | F14 (fov is degrees) |
| angle R:28-29 | `MathUtils.radToDeg`, `degToRad` | OK | — |
| angle R:34 | 45° left and right give the same angleTo | OK | t2: both 0.7854 |
| angle R:48 | atan2 gives −180° to 180° | IMPRECISE | F15 |
| angle R:51-54 | Signed-angle recipe; positive = left with Y up | OK | t2: left +0.785, right −0.785 |
| angle R:57 | `cross.y > 0` means left | OK | t1 |
| angle R:61 | `rotation.y = 90` is 90 rad, over 14 turns | OK | t2: 14.32 turns |
| angle R:65 | Math.sin/cos take radians | GENERAL-OK | ECMAScript spec |
| angle R:69 | Dial uses signed angle | RULE-OF-THUMB | Common pattern |
| angle Q1 | Left and right return the same angle | OK | t2 |
| angle Q2 | `rotation.y = 90` turns 90 radians | OK | Euler in radians |
| angle Q3 | side > 0 means left | OK | t1 |
| angle Q4 | `(π/2).toFixed(0)` shows "2°" | OK | t2: "2" |
| angle S | applyAxisAngle, atan2 helper; "after 14 full spins" label | OK | t2: 90 rad mod 360° = 116.6°, 14 full turns |
| angle C:17 | 0–180, no side; signed adds side around an up | OK | — |
| angle C:8 | Misconception "angleTo tells you which way to turn" | OK | — |

### projection-rejection
| Location | Claim / question | Verdict | Evidence |
| --- | --- | --- | --- |
| proj R:25-28 | Projection + rejection = original | OK | projectOnPlane = v − projectOnVector (Vector3.js:908-912) |
| proj R:30 | Shadow analogy | OK | — |
| proj R:39-43 | `projectOnVector` / `projectOnPlane` = rejection | OK | Vector3.js:889-912; t2 |
| proj R:52-57 | Slide only if `dot < 0`; otherwise leaving a wall gets flattened | OK | — |
| proj R:59 | Zeroing an axis only works for axis-aligned walls | OK | t2: (0,0,0) vs slide (−0.72,0,0.96) |
| proj R:63 | Normal must be in world space | OK | — |
| proj R:70 | Rail = projectOnVector | OK | — |
| proj R:73 | Transform gizmos use this on single-axis drags | RULE-OF-THUMB | TransformControls.js:539-551 rotates the offset into the gizmo's frame, then zeroes the other components, which amounts to the same projection |
| proj R:77 | `Line3.closestPointToPoint(point, false, target)` | OK | t2: (5,0,0) |
| proj Q1 | (3,4,0) onto X → (3,0,0) | OK | t2 |
| proj Q2 | projectOnPlane(up) → (3,0,0) | OK | t2 |
| proj Q3 | `x = 0` against an angled wall: stops dead | IMPRECISE | Key right (t2); "straight into it" misleads (F16) |
| proj Q4 | Dot check: slide only when moving in | OK | — |
| proj S | projectOnVector/projectOnPlane labels; wall.lookAt; "Stops dead" status | OK | t2 |
| proj C:8 | Zero-an-axis misconception | OK | — |
| proj C:17, 21 | Definition; normal turns with the wall | OK | — |

### reflection
| Location | Claim / question | Verdict | Evidence |
| --- | --- | --- | --- |
| refl R:23-26 | `velocity.clone().reflect(normal)` gives the bounce | OK | Vector3.js:922-924 |
| refl R:39 | reflect assumes a unit normal | OK | Vector3.js:919 JSDoc "(normalized)" |
| refl R:39 | Length 2 → "seven times too fast" | IMPRECISE | F6 |
| refl R:39 | Raycast hit normals are length 1 | WRONG | F5 (t2: hit.normal length 0.902, local space) |
| refl R:39 | Cross-product normals need normalize | OK | — |
| refl R:46 | reflect then multiplyScalar(0.8) | OK | Both mutate and chain |
| refl R:54-55 | GLSL `reflect(-toCamera, normal)` + env lookup | OK | GLSL reflect(I,N); three.js envmap_fragment does the same in world space |
| refl Q1 | (2,−3,0) off the floor → (2,3,0) | OK | t2 |
| refl Q2 | Normal length 2 → shoots up much faster | OK | t2: (2,21,0) |
| refl Q3 | `mirrored` points at what the mirror shows | OK | — |
| refl S | Readout "Far too fast: reflect assumes length 1" | OK | Qualitative, true |
| refl C:17 | Needs a normal at length 1 | OK | — |
| refl C:8 | Misconception "n doesn't need normalizing" | OK | — |

### lerp
| Location | Claim / question | Verdict | Evidence |
| --- | --- | --- | --- |
| lerp R:24-27 | t = 0 start, 1 end, 0.5 half | OK | Vector3.lerp |
| lerp R:40 | No clamp; 1.5 goes past B, negative past A | OK | t2: lerpVectors 1.5 → (6,0,0) |
| lerp R:48-52 | lerp, lerpVectors writes into a, Color.lerpColors, MathUtils.lerp, GLSL mix | OK | API check; t2 |
| lerp R:59 | `MathUtils.clamp(elapsed/duration,0,1)` | OK | — |
| lerp R:64 | Halfway between two unit directions is shorter than 1 | OK | True for any two different directions; same direction stays 1 (t2), which is trivial |
| lerp R:64 | Opposites → (0,0,0); use slerp for rotations | OK | t2; Quaternion.slerp |
| lerp R:71-74 | `lerp(target, 0.1)` per frame depends on frame rate | GENERAL-OK | Frame-rate-dependent exponential smoothing; MathUtils.damp exists (t2) |
| lerp Q1 | 0.25 is a quarter of the way from a | OK | t2 |
| lerp Q2 | t = 1.5 goes past b by half the gap | OK | t2 |
| lerp Q3 | Opposite directions → (0,0,0) | OK | t2 |
| lerp S | lerpVectors, Color.lerpColors; "lerp keeps going" | OK | — |
| lerp C:8-9,18 | Misconceptions and definition | OK | — |

### spherical-coords
| Location | Claim / question | Verdict | Evidence |
| --- | --- | --- | --- |
| sph R:26-28 | radius; phi down from straight up (0 top, π/2 level, π bottom); theta around | OK | Vector3.js:1007-1013 (y = r cos φ) |
| sph R:32 | At phi 0, theta changes nothing | OK | t2: (0,5,0) for any theta |
| sph R:37-38 | `new Spherical(r, phi, theta)`; `setFromSpherical` | OK | Vector3.js:993 |
| sph R:45 | OrbitControls: drag changes theta/phi, zoom changes radius | IMPRECISE | F17 |
| sph R:52-55 | Add the target back or it orbits the origin | OK | setFromSpherical is centered on (0,0,0) |
| sph R:59 | phi from +Y | OK | — |
| sph R:63 | Poles degenerate; makeSafe; min/maxPolarAngle | OK | Spherical.js:84-87; OrbitControls.js:753-755 |
| sph R:63 | Camera looking straight down can spin | RULE-OF-THUMB | Matrix4.lookAt nudge (Matrix4.js:500-515) gives an arbitrary roll |
| sph Q1 | Spherical(5,0,0) → 5 above | OK | t2: (0,5,0) |
| sph Q2 | Target not added: circles the origin | OK | — |
| sph Q3 | Clamp phi off the poles: theta stops meaning anything | IMPRECISE | Key right; makeSafe margin is 1e-6 (F18) |
| sph S | Spherical from degToRad; "At the pole: theta no longer changes anything" | OK | t2 |
| sph C:18, 22 | Definition; center is the orbit target | OK | — |
| sph C:8 | Misconception "phi from the equator" | OK | — |
| sph C:9 | "The poles are degenerate" listed as a misconception | IMPRECISE | F26 |

### float-tolerance
| Location | Claim / question | Verdict | Evidence |
| --- | --- | --- | --- |
| float R:26 | 0.1 + 0.2 = 0.30000000000000004 | OK | t3 |
| float R:29 | Most operations round; `===` fails | GENERAL-OK | IEEE 754 |
| float R:38 | `Math.abs(a-b) < 1e-6` | OK | — |
| float R:43 | Gaps grow away from 0; vertex data and GPU use float32 | GENERAL-OK | IEEE 754 binary32; BufferAttribute Float32Array |
| float R:47 | Gap at 1 ≈ 0.0000001 | OK | t3: 1.19e-7 |
| float R:48 | Gap at 1,000 ≈ 0.00006 | OK | t3: 6.10e-5 |
| float R:49 | Gap at 1,000,000 ≈ 0.06 | OK | t3: 0.0625 |
| float R:50 | Gap at 10,000,000 = 1 | OK | t3: 1 |
| float R:52 | Sphere crumples when vertices are stored far out | OK | S stores vertex data far out (scenes.ts:35) |
| float R:60 | `Vector3.equals` is exact | OK | Vector3.js:1154-1156 |
| float R:63 | `distanceTo < 1e-6` | OK | — |
| float R:66 | `toBeCloseTo` "does the same" | IMPRECISE | F19 |
| float R:70 | Gap near 5,000 ≈ 0.0005 | OK | t3: 0.000488 |
| float R:70 | 1e-6 "can never pass" | IMPRECISE | F20 |
| float R:74 | Nearly flat triangle and nearly parallel cross are tiny, not 0 | OK | t3 |
| float R:77 | `getArea() < 1e-10` | RULE-OF-THUMB | The threshold should scale with the size of the numbers |
| float R:82 | Content far from the origin jitters/crumples; floating origin | IMPRECISE | F21 |
| float Q1 | `0.1+0.2 === 0.3` prints nothing | OK | t3 |
| float Q2 | Full turn: equals returns false | IMPRECISE | Key right for typical points (t3); on-axis points give true (F22) |
| float Q3 | 1e-6 near 5,000 is too small | OK | t3 gap |
| float Q4 | `getArea() === 0` lets near-flat through; flat isn't always exactly 0 | OK | t3: 9,646 of 10,000 collinear triangles have a nonzero area; repeated point gives 0 |
| float S | float32Gap by bit stepping; "stores far out, moves mesh back" comments | OK | t3 matches the same method |
| float C:17 | Compare within a tolerance | OK | — |
| float C:21 | Farther from zero, bigger gaps | GENERAL-OK | IEEE 754 |
| float C:25 | JS 64-bit, GPU/vertex 32-bit, about 7 significant digits | GENERAL-OK | binary32 ≈ 7.22 decimal digits |
| float C:8 | Misconception "equal math means equal floats" | OK | — |

### triple-product
| Location | Claim / question | Verdict | Evidence |
| --- | --- | --- | --- |
| triple R:15, 25-28 | Cross edges, dot with point − a; sign gives the side | OK | t2 |
| triple R:28 | 0 = "exactly on the surface" | IMPRECISE | F23 |
| triple R:36 | Name from the three directions | OK | — |
| triple R:43-44 | Code; > 0 in front, < 0 behind | OK | — |
| triple R:47-51 | `Plane.setFromCoplanarPoints` + `distanceToPoint`, signed, positive on the normal side | OK | t1: same normal as (b−a)×(c−a); t2: +2 / −2 |
| triple R:56 | Detects mirroring, e.g. scale −1 on one axis | OK | t2: triple −1 |
| triple R:56 | Mirrored object can light up inside-out | IMPRECISE | F24 |
| triple R:59 | `x·(y×z) < 0` | OK | t2 |
| triple R:62 | `matrix.determinant() < 0` | OK | Matrix4.js:626; t2: det matches triple |
| triple Q1 | Negative → behind | OK | — |
| triple Q2 | Mirrored true for a −1 scale on one axis; not for upside down | OK | t2: upside down +1; (−1,1,1) −1 |
| triple Q2 why | "Only a flip, like a negative scale" | IMPRECISE | F25 (two negative axes → +1) |
| triple S | Normal via crossVectors; "in front / behind / on the triangle" labels | OK | Point moves through the center, so "on the triangle" holds here |
| triple C:17 | Sign gives the side or a mirrored basis | OK | — |
| triple C:8, 10-12 | Handedness misconception; contexts (tetrahedron volume = triple/6) | GENERAL-OK | Standard vector algebra |

### Concept cards: general
| Location | Claim | Verdict | Evidence |
| --- | --- | --- | --- |
| all cards: contexts | Use contexts across the 12 cards | OK | Each matches a real use; three.js APIs named exist |
| all cards: space lenses | "Same space" statements | OK | — |
