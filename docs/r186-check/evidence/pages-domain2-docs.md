# Domain 2 pages, cards, docs, harness: r186 accuracy check

Checked against `three@0.186.0` in `node_modules/three` (src + examples/jsm) and `@types/three`.
Scripts: `docs/r186-check/evidence/quiz.mjs` (every quiz question plus most prose claims), `extra.mjs` (lost: another checker overwrote it during the run; its two results, compose Q1 vertices coming out NaN and the baked box matching, were re-run by hand and hold), plus a few inline `node --input-type=module -e` runs from the repo root. "render" in the scripts is `scene.updateMatrixWorld()`, which is what `WebGLRenderer.render` does to transforms (`src/renderers/WebGLRenderer.js:1663-1667`).

Paths below are relative to the repo root. `T/` = `drills/1/transforms/`.

**Headline:** no quiz question has a wrong key, and no wrong answer is actually correct. One explanation states something false (compose Q1). The rest are wording problems.

## Findings

### F1. WRONG (in the explanation; the key is right): compose Q1 says "every number comes out NaN"
- **Where:** `T/compose-decompose/read-the-code-1/questions.ts:15` (the `why`), and choice text at `:10` ("The matrix fills with NaN").
- **Evidence:** `Matrix4.compose` reads `quaternion._x/_y/_z/_w` (`src/math/Matrix4.js` compose). `Euler` has `_x/_y/_z` but `_w` is `undefined`, so only the terms that use `w` turn into NaN. quiz.mjs `CD-Q1`: **6 of 16 elements are NaN**. Elements 0, 5, 10 (the diagonal), 12–14 (the move) and 15 are still numbers. The key still holds: any vertex drawn through the matrix comes out (NaN, NaN, NaN) (extra.mjs), so copy 0 disappears. `Frustum.intersectsObject` still returns true, so the other copies still draw. There's a side effect the page doesn't mention: `InstancedMesh.boundingSphere` becomes NaN, so **raycasts miss every copy**, not just copy 0 (inline run: `hits on copy 2 at x=4: 0`). The TypeScript claim is right: `@types/three` Matrix4.d.ts:419 `compose(position: Vector3, quaternion: Quaternion, scale: Vector3)`.
- **Fix:** change the `why` to "the matrix gets NaN in its turn part, so every point drawn with it comes out NaN and copy 0 disappears". Change the choice to "The matrix gets NaN in it, so copy 0 vanishes". You could add that raycasts against the whole InstancedMesh stop hitting too.

### F2. IMPRECISE: local-vs-world math note, "When a parent only moves, a child's world position is the parent's world position plus the child's position"
- **Where:** `T/local-vs-world/read-the-code-1/README.md:48`
- **Evidence:** quiz.mjs `LW-L48`: the grandparent is turned 90° and the parent only moves. Parent world position + `child.position` = (1, 0, −1), but the real world position is (0, 0, −2). The sum only holds when nothing above the child is turned or resized.
- **Fix:** "When nothing above the child is turned or resized, …".

### F3. IMPRECISE: "For an object added straight to the scene there's no parent to combine in"
- **Where:** `T/matrix-vs-matrixworld/read-the-code-1/README.md:38`
- **Evidence:** the scene *is* the parent. `updateMatrixWorld` does `matrixWorld = parent.matrixWorld × matrix` whenever `parent !== null` (`src/core/Object3D.js:1182-1194`). The two match only because the scene's own transform is left at "no change". This also contradicts the local-vs-world page (README:29, :54), which says the scene is the parent.
- **Fix:** "the parent is the scene, which normally isn't moved, turned, or resized, so the two hold the same transform."

### F4. IMPRECISE: the table says `GLTFExporter` reads `matrix` for every object
- **Where:** `T/matrix-vs-matrixworld/read-the-code-1/README.md:77` (similar wording at `T/update-timing/read-the-code-1/README.md:109`, "GLTFExporter rebuilds each matrix itself").
- **Evidence:** `examples/jsm/exporters/GLTFExporter.js:2475-2509`. By default it calls `updateMatrix()` and writes `matrix`. With `trs: true` it writes `position`/`quaternion`/`scale` directly, and `trs` is forced on whenever animations are exported (`:659-662`). Both are measured from the parent, so the table's point about spaces holds, but "reads matrix" isn't always true.
- **Fix:** "`matrix` (or position/quaternion/scale with `trs: true`), measured from the parent, for every object in the tree".

### F5. IMPRECISE: the getWorld… methods "refresh the object and all its parents", and with auto-update off `getWorldPosition` "only refreshes matrixWorld, from the old matrix"
- **Where:** `T/update-timing/read-the-code-1/README.md:66` (table), `:126`.
- **Evidence:** `updateWorldMatrix(true, false)` (`Object3D.js:1225-1253`) refreshes the parents. On an object with `matrixAutoUpdate = false` it skips `updateMatrix()`, so `matrixWorldNeedsUpdate` stays false. The parent calls don't pass `force` down, so that object's `matrixWorld` is **not recomputed at all**, even if its parent moved. quiz.mjs `UT-L126`: rack with auto-update off, parent moved to x = 10. `getWorldPosition` gives x = 3 (stale); after a render, x = 13.
- **Fix:** at :126, "`getWorldPosition` doesn't help: with auto-update off it doesn't refresh the rack at all, so it reads the saved `matrixWorld` as the last render left it." Optionally add a footnote to the :66 row: "except objects with `matrixAutoUpdate = false`".

### F6. IMPRECISE: "`object.rotateOnWorldAxis(axis, angle)` turns around a world axis"
- **Where:** `T/trs-order/read-the-code-1/README.md:84`
- **Evidence:** `Object3D.js:551-562` premultiplies the object's own quaternion, and the source comment says "method assumes no rotated parent". So the axis is really measured from the parent. quiz.mjs `TR-L84`: under a parent turned 90° about Z, the world result is 120° away from a real world-X turn.
- **Fix:** "turns around an axis measured from its parent, which is the world axis only when the parent isn't turned".

### F7. IMPRECISE (minor): pivots in-short and card definition present the group as the only way
- **Where:** `T/pivots/read-the-code-1/README.md:15`, `concepts/transforms/pivots.md:17`.
- **Evidence:** r186 `Object3D.pivot` (`Object3D.js:381-388`, applied in `updateMatrix` at `:1148-1159`) turns and resizes around another point with no group. The page's section B covers it correctly (README:85-94, verified: `PV-pivot`, `PV-attach`). The one-sentence definitions say "An object turns and resizes around its origin, so … you hang it from a group", which is only true while `pivot` is null.
- **Fix:** add "(unless `object.pivot` is set)" after "origin", or "the usual way is a group".

### F8. IMPRECISE (minor): "three.js checks `object.matrixWorld.determinant()`"
- **Where:** `concepts/transforms/negative-scale.md:21`; `T/negative-scale/read-the-code-1/README.md:109` (table row "…determinant(), what three.js checks").
- **Evidence:** the renderers call `matrixWorld.determinantAffine() < 0` (`WebGLRenderer.js:1200`, `WebGPUBackend.js:2388`, `WebGPUPipelineUtils.js:916`). For an object's matrix it has the same sign, and README:41 already says so, so the behavior is right. Only the method name in these two places is off.
- **Fix:** name `determinantAffine()` there too, or say "the determinant of `matrixWorld`".

### F9. IMPRECISE (minor): three snippets read `matrixWorld` without a refresh line
- **Where:** `T/points-vs-directions/read-the-code-1/questions.ts:29-31` (Q3), `T/normal-matrix/read-the-code-1/questions.ts:6-8` (Q1) and `:15-16` (Q2).
- **Evidence:** points-vs-directions Q1 and Q2 include `updateMatrixWorld()`, and the page teaches that `applyMatrix4(matrixWorld)` uses the saved matrix (README:80). Q3 only has a comment ("stands at (6, 1, 0)"). Read literally right after setting position, `matrixWorld` is identity and `ahead` is (0, 0, −1), so the ray would go straight ahead (quiz.mjs `PD-Q3b`). The keys are right given the intended reading.
- **Fix:** add `scanner.updateMatrixWorld();`, `ramp.updateMatrixWorld();`, and `lamp.updateMatrixWorld();`, or "// after a render" in each comment.

### F10. IMPRECISE: writing-pages says `transformDirection` "only turns, and it also normalizes"
- **Where:** `docs/writing-pages.md:21`
- **Evidence:** `Vector3.transformDirection` applies the whole upper 3×3, scale included, then normalizes (`src/math/Vector3.js:525-537`). Under uneven scale the direction tilts, which is the normal matrix page's whole point. The points-vs-directions README:54 states it correctly ("turns and resizes it, then sets its length back to 1").
- **Fix:** "it leaves out the move, applies the turn and resize, then sets the length back to 1."

### F11. IMPRECISE: the addendum's "marker flush" check wouldn't reliably fail on the bug
- **Where:** `docs/addendum-write-the-check.md:50`
- **Evidence:** "scales the parent (3, 1, 1), rotates it" isn't enough. The parent's own scale is applied before its own turn (TRS), so a face lined up with the parent's axes keeps a correct normal under `transformDirection`. Inline run: a box face under a parent scaled (3, 1, 1) and turned gives `transformDirection` dots with the edges of [0, 0], so it passes the perpendicular check. A cone's sloped face gives dots of [−0.68, −0.72] with `transformDirection` and [0, 0] with the normal matrix. That breaks rule 1 (fails broken, passes fixed) unless the surface is oblique to the stretch.
- **Fix:** "raycast a sloped or curved face (or a part turned inside the stretched parent), then assert…".

### F12. IMPRECISE: the addendum's memory check can't see undisposed materials
- **Where:** `docs/addendum-write-the-check.md:56`
- **Evidence:** `renderer.info.memory` has only `geometries` and `textures` (`src/renderers/webgl/WebGLInfo.js:5-8`). Materials aren't counted. Shader programs are in `renderer.info.programs` (`WebGLRenderer.js:484`), and one program is shared by every material with the same settings, so a material leak can be invisible there too. The Budget row at :45 already says "geometry and texture counts".
- **Fix:** "asserts geometry and texture counts return to baseline; for materials, also check `renderer.info.programs.length`, or count `dispose` events."

### F13. IMPRECISE (minor): CLAUDE.md, "A line whose end points move needs `frustumCulled = false`"
- **Where:** `CLAUDE.md`, Gotchas.
- **Evidence:** `setFromPoints` on an existing geometry updates the position attribute in place and never resets `boundingSphere` (`src/core/BufferGeometry.js:596-633`), so the bounds do go stale and the line can be culled wrongly. The `harness/lesson.ts:77` comment is accurate. But "needs" overstates it: `geometry.computeBoundingSphere()` after each change also fixes it.
- **Fix:** "…needs `frustumCulled = false` (or `computeBoundingSphere()` after each move); `line()` sets the first."

### Other non-OK verdicts (no change needed)
- **UNVERIFIED:** CLAUDE.md, "Vitest hides the output of passing tests when it detects an AI agent. Pass `--silent=false`." Agent detection is real. Vitest 5.0.2 imports `isAgent` from std-env and defaults `reporters` to `"minimal"` for agents (`node_modules/vitest/dist/chunks/defaults.D2ip7f-X.js:67`); `silent` defaults to false (`:68`). I didn't confirm that `--silent=false` is what brings the hidden output back, since that's reporter behavior. Not a three.js claim.
- **GENERAL-OK:** CLAUDE.md, `import.meta.glob` options must be an inline literal (Vite docs, Glob Import: arguments must be literals). writing-pages.md:184, `Math.acos` of a dot a hair over 1 gives NaN (MDN, Math.acos: NaN outside [−1, 1]). CLAUDE.md, Vitest runs in Node without WebGL.
- **RULE-OF-THUMB:** update-timing README:114 (cost "nothing to notice with a few hundred, a real slice … tens of thousands"), :127 ("skipping the rebuild alone makes little difference"), :94 (click handlers are usually fine); inverse README:66 and card cost lens ("several times the work of applying a matrix"; true by operation count, not measured); negative-scale README:23 ("cheapest way"); compose Q1 "copy 0 vanishes" (NaN positions are dropped by the GPU in practice); CLAUDE.md Playwright download "about 150 MB".

## Ledger

Verdict key: OK, WRONG, OUTDATED, IMPRECISE, GENERAL-OK, RULE-OF-THUMB, UNVERIFIED. Script IDs refer to `quiz.mjs` output.

### Quiz questions (47)

| Location | Question (short) | Verdict | Evidence |
| --- | --- | --- | --- |
| local-vs-world Q1 :5 | headlight world pos → (10,1,2) | OK | LW-Q1 (10,1,2) |
| local-vs-world Q2 :14 | parcel.position.y after climb → −1 | OK | LW-Q2 −1 (world 4) |
| local-vs-world Q3 :24 | bin above scaled shelf → 2 units | OK | LW-Q3 2 |
| local-vs-world Q4 :33 | gap between local positions → nothing useful | OK | LW-Q4 gap 0; world gap 8.25; distractors wrong |
| local-vs-world Q5 :48 | localToWorld input measured from lamp | OK | Object3D.js:663-668; LW-Q5 |
| points-vs-dir Q1 :5 | transformDirection after climb → (0,0,1) | OK | PD-Q1; applyMatrix4 gives (0,5,1) as the why says |
| points-vs-dir Q2 :18 | valve/spout at scale 3 → (0,3,0)/(0,1,0) | OK | PD-Q2 |
| points-vs-dir Q3 :28 | applyMatrix4 on direction + normalize → off course | OK (see F9) | PD-Q3 (6,1,−1); stale case PD-Q3b |
| points-vs-dir Q4 :41 | velocity keeps speed → applyQuaternion | OK | PD-Q4 len 4 / tD 1 / aM4 adds pos |
| points-vs-dir Q5 :53 | localToWorld(0,0,1) → (4,0,3) | OK | PD-Q5 |
| matrix-vs-mw Q1 :5 | lamp.matrix → 1 up from table | OK | MM-Q1 matrix (0,1,0), world (3,1,0) |
| matrix-vs-mw Q2 :15 | matrixWorld after un-rendered move → 5 | OK | MM-Q2 5, getWorldPosition 9 |
| matrix-vs-mw Q3 :26 | box via crate.matrix → at scene center | OK | MM-Q3 center (0,0,0) vs (20,0,0) |
| matrix-vs-mw Q4 :41 | flat list with bin.matrix → (0,2,0) | OK | MM-Q4 |
| matrix-vs-mw Q5 :56 | add to shelfB → matrixWorld changed, matrix not | OK | MM-Q5 true/false |
| update-timing Q1 :5 | raycast after move → misses | OK | UT-Q1 0 hits, 2 after refresh |
| update-timing Q2 :20 | bin.updateMatrixWorld after shelf move → no | OK | UT-Q2 x=0 then 2 |
| update-timing Q3 :35 | setFromObject(bin) after shelf scale → old size | OK | UT-Q3 size (1,1,1) at (3,0,0); Box3.js:308 |
| update-timing Q4 :45 | toJSON after move, reload → x=1 | OK | UT-Q4; Object3D toJSON writes matrix; ObjectLoader.js:1133-1138 |
| update-timing Q5 :56 | autoUpdate off before updateMatrix → center | OK | UT-Q5 (0,0,0) |
| trs-order Q1 :5 | reorder position line → nothing changes | OK | TR-Q1 same matrix |
| trs-order Q2 :18 | moon.applyMatrix4(rotY 90°) → swings to (0,0.5,−3) | OK | TR-Q2; Object3D.js:448-456 |
| trs-order Q3 :31 | T.multiply(R) instance → spins in place | OK | TR-Q3 position stays (4,0,0) |
| trs-order Q4 :46 | plank scale.x after tilt → own length | OK | TR-Q4 stretch axis (0.87,0.5) |
| trs-order Q5 :58 | tile under (3,1,1) holder → slanted diamond | OK | TR-Q5 edge angle 143°, tile.scale (1,1,1) |
| pivots Q1 :5 | loaded shelf turns around its foot/origin | OK | compose/updateMatrix turns about origin (pivot null) |
| pivots Q2 :17 | hinge group turn → swings around hinge | OK | PV-Q2 edge stays at (2,1,0) |
| pivots Q3 :31 | shared geometry.translate → doorB shifts too | OK | PV-Q3 doorB bbox x 0..0.8, positions 0 |
| compose Q1 :5 | compose with Euler → NaN, copy vanishes | WRONG (why text only; key OK) | F1: 6/16 NaN; vertices NaN |
| compose Q2 :17 | decompose sheared world matrix → unskewed copy | OK | CD-Q2 not equal, scale (1.58,1.58,1) |
| compose Q3 :32 | getWorldQuaternion includes car's turn | OK | CD-Q3 (0,.707,0,.707) vs identity |
| add-vs-attach Q1 :5 | group.add(chair) → (4,0,2) | OK | AA-Q1; attach gives (−2,0,2) AA-Q1b |
| add-vs-attach Q2 :16 | scene.add after attach → near center | OK | AA-Q2 let go (8.35,1,−5.75), landed (0.05,0,0.05) |
| add-vs-attach Q3 :25 | attach under 0.01 scale → (100,100,100) | OK | AA-Q3 exactly 100 |
| negative-scale Q1 :5 | children of mirrored group → mirrored, right side out | OK | NS-Q1 detAffine −1, own det 1; WebGLRenderer.js:1200 |
| negative-scale Q2 :14 | det signs → true false | OK | NS-Q2 |
| negative-scale Q3 :23 | geometry.scale(−1) → inside out | OK | NS-Q3 winding flipped, stored normal outward; NS-Q3b det 1 |
| normal-matrix Q1 :5 | transformDirection on stretched ramp → leaning | OK (see F9) | NM-Q1 dot with surface −0.79 vs 0 |
| normal-matrix Q2 :14 | uniform 2.5 + turn → right | OK (see F9) | NM-Q2 angle 0, len 1 |
| normal-matrix Q3 :22 | face.normal of turned plane → (0,0,1) | OK | NM-Q3 face.normal & hit.normal (0,0,1); Mesh.js:479,497 |
| normal-matrix Q4 :31 | decal via mesh.normalMatrix → camera space | OK | WebGLRenderer.js:2160-2161 |
| normal-matrix Q5 :44 | mat3(modelView) rim on (1,3,1) → spreads | OK | NM-Q5 rim at 20° tilt 0.33 wrong vs 0.007 right |
| inverse Q1 :5 | worldToLocal(3,1,−2) → (0,1,0) | OK | IN-Q1; (6,1,−4) for matrixWorld |
| inverse Q2 :13 | apply then inverse → back to start | OK | IN-Q2 (0.2,0.5,0) |
| inverse Q3 :22 | matrixWorld.invert() then raycast → wrong place | OK | IN-Q3 same object, matrixWorld changed, 0 hits |
| inverse Q4 :35 | transpose of moved+turned → no | OK | IN-Q4 transpose round trip (0.31,0.13,0.31) |
| inverse Q5 :49 | worldToLocal on scale 0 → NaN | OK | IN-Q5 NaN; inverse all zeros (Matrix4 invert det===0) |

### Page prose, scenes, and cards

| Location | Claim (short) | Verdict | Evidence |
| --- | --- | --- | --- |
| local-vs-world README:23-27 | add attaches; child follows move/turn/resize | OK | updateMatrixWorld parent×matrix |
| local-vs-world README:48 | parent-only-moves sum | IMPRECISE | F2 |
| local-vs-world README:54 | object under scene: position is world position | OK | scene identity by default (see F3 nuance) |
| local-vs-world README:67 | getWorldPosition right after parent move; getWorld* family | OK | Object3D.js:996-1048 updateWorldMatrix(true,false) |
| local-vs-world README:71-75 | lookAt takes world spot; box.position misses | OK | Object3D.js:694-738; LW-aim |
| local-vs-world README:109 | localToWorld / worldToLocal usage | OK | Object3D.js:663-683 |
| local-vs-world README:114 | localToWorld(part.position) double counts | OK | LW-L114 (1,4,0) vs (1,2,0) |
| local-vs-world README:115-116 | they mutate input; treat as place | OK | applyMatrix4 in place |
| local-vs-world README:120-127 | space table | OK | as above; hit.point world (Mesh.js:438) |
| local-vs-world scenes.ts | getWorldPosition, lookAt, setArrow usage | OK | current r186 API |
| points-vs-dir README:34-36,53-54 | move/turn/resize; applyMatrix4 vs transformDirection | OK | Vector3.js:525-537 |
| points-vs-dir README:61 | w note: applyMatrix4 w=1, transformDirection w=0 | OK | Vector3 applyMatrix4 / transformDirection |
| points-vs-dir README:71-73 | method table incl. applyQuaternion keeps length | OK | PD-Q4 |
| points-vs-dir README:80 | localToWorld/getWorldQuaternion refresh; applyMatrix4 uses saved | OK | Object3D.js:665,1012 |
| points-vs-dir README:92 | raycaster.set expects unit direction, copies as is | OK | Raycaster.set → ray.set |
| points-vs-dir README:100 | normalize doesn't remove mixed-in move | OK | PD-Q3 |
| points-vs-dir README:120 | localToWorld = refresh + applyMatrix4 | OK | Object3D.js:663-668 |
| points-vs-dir README:127 | getWorldDirection one call | OK | Object3D.js:1042-1049 (+Z, normalized) |
| points-vs-dir README:140 | hit.normal & face.normal in object space | OK | Mesh.js:477-497 (local ray, local verts) |
| points-vs-dir scenes.ts:30,105 | updateMatrixWorld before reading matrixWorld | OK | comments accurate |
| matrix-vs-mw README:23-34 | matrix from pos/quat/scale; matrixWorld chains parents | OK | Object3D.js:1144-1194 (r186 also folds in `pivot`) |
| matrix-vs-mw README:38 | no parent to combine for scene children | IMPRECISE | F3 |
| matrix-vs-mw README:47-49 | modelMatrix in shaders; mw = parent.mw × matrix | OK | Object3D.js:1190; WebGLRenderer sets modelMatrix |
| matrix-vs-mw README:57-63 | saved, refreshed at render; getWorldPosition fresh | OK | WebGLRenderer.js:1663; MM-Q2 |
| matrix-vs-mw README:73-76 | renderer, raycaster, setFromObject, getWorld* read matrixWorld | OK | Mesh.js:242-267; Box3.js:303-333 |
| matrix-vs-mw README:77 | GLTFExporter/toJSON read matrix | IMPRECISE | F4 |
| matrix-vs-mw README:88-97 | Box3 from boundingBox × matrixWorld; × matrix drops parents | OK | MM-Q3 |
| matrix-vs-mw README:103-104,108-114 | tree files keep matrix; flat lists need world; add keeps numbers | OK | MM-Q4, MM-Q5 |
| matrix-vs-mw scenes.ts | ghost.matrixAutoUpdate=false + matrix.copy; renderer.info.render.frame | OK | WebGLInfo.js:11 |
| update-timing README:25-29 | frame order; render refreshes scene and camera | OK | WebGLRenderer.js:1663-1667 |
| update-timing README:35-39,48-56 | raycast reads saved mw; updateMatrixWorld covers children not parents | OK | UT-Q1; Object3D.js:1176-1213 |
| update-timing README:66 | getWorld* refresh object + parents | IMPRECISE | F5 (auto-update-off exception) |
| update-timing README:67-68 | localToWorld/worldToLocal/lookAt refresh | OK | Object3D.js:665,679,710; UT-lookAt |
| update-timing README:69 | setFromObject: object + children, not parents | OK | Box3.js:308,379; UT-Q3 |
| update-timing README:70-73 | intersectObject / setFromCamera / reading / toJSON: no refresh | OK | UT-setFromCamera origin stale; Raycaster.js:123-130 |
| update-timing README:79-90 | updateWorldMatrix(true,false) fixes it; scene.updateMatrixWorld refreshes all | OK | UT-Q2 |
| update-timing README:94 | click handlers usually fine | RULE-OF-THUMB | reasoning, not provable |
| update-timing README:98-105 | setFromObject(bin) after shelf scale | OK | UT-Q3 |
| update-timing README:109 | toJSON loses unrefreshed move; GLTFExporter rebuilds | OK (nuance F4) | UT-Q4; GLTFExporter.js:2501 |
| update-timing README:114 | refresh cost grows with objects | RULE-OF-THUMB | scale numbers not measured |
| update-timing README:116-126 | matrixAutoUpdate=false; needs updateMatrix; updateMatrix only builds matrix | OK | UT-Q5; Object3D.js:1144-1163 |
| update-timing README:126 | getWorldPosition refreshes mw from old matrix | IMPRECISE | F5 |
| update-timing README:127 | still visited and follows parent; little saving | OK / RULE-OF-THUMB | UT-L126 after render x=13 |
| update-timing card cost lens | skips rebuild, not visit | OK | as above |
| update-timing scenes.ts | onFrame reads mw before render; comments | OK | scene.ts:48-53 order |
| trs-order README:24-38 | S then R then T; line order irrelevant; scale along own axes | OK | Matrix4.compose; TR-Q1, TR-Q4 |
| trs-order README:46-49 | turn-then-move vs move-then-turn | OK | TR-Q2/Q3 |
| trs-order README:60 | T×R×S; multiply puts b on right; premultiply on left | OK | Matrix4.multiply/premultiply |
| trs-order README:75 | applyMatrix4 premultiplies and writes back pos/rot/scale | OK | Object3D.js:448-456 |
| trs-order README:82 | multiplyMatrices(a,b) == a.clone().multiply(b) | OK | TR-L82 true |
| trs-order README:84 | rotateY local; rotateOnWorldAxis world axis | IMPRECISE | F6 |
| trs-order README:88-97 | parent non-uniform scale shears turned child; own scale stays 1; uniform never skews | OK | TR-Q5 |
| trs-order card | definition + space lens | OK | as above |
| trs-order scenes.ts | premultiply/multiply demo; cornerAngle via transformDirection | OK | angle of transformed axes is valid for skew |
| pivots README:15, card:17 | turns around origin, so use a group | IMPRECISE | F7 |
| pivots README:23-25 | built-in geometries centered; loaded origins arbitrary | OK | BoxGeometry/SphereGeometry centered |
| pivots README:37-45 | hinge group recipe | OK | PV-Q2 |
| pivots README:57-67 | Box3 center pivot recipe; attach does the shift | OK | PV-bbox no jump, spins about center |
| pivots README:71-79 | bar grows from floor | OK | PV-bar min.y 0, max.y 3 |
| pivots README:83 | geometry.translate/center change shared data | OK | PV-Q3 |
| pivots README:87-94 | r186 object.pivot; attach jumps; getWorldPosition ≠ position | OK | Object3D.js:381-388,1148-1159; PV-pivot, PV-attach; @types Object3D.d.ts:319 |
| pivots scenes.ts | door.pivot toggling | OK | valid r186 API |
| compose README:26-34 | compose/decompose; quaternion↔rotation sync; updateMatrix uses compose; getWorldQuaternion/Scale decompose | OK | Object3D.js:1146,1014,1030 |
| compose README:40-44 | decompose drops shear silently; 0°/90° match | OK | CD-Q2; CD-L44 diffs 0 / 2e-16 |
| compose README:55-59 | decompose into copy; copy whole matrix with autoUpdate off | OK | CD-L59 equal |
| compose README:66-70 | getWorldQuaternion refreshes + decomposes | OK | CD-Q3 |
| compose README:77-89 | compose for instances; baking recipe | OK | CD-bake same box within float32 (extra.mjs) |
| compose card | definition + space lens | OK | as above |
| compose scenes.ts | decompose round trip | OK | valid API |
| add-vs-attach README:23 | both remove from old parent | OK | Object3D.js:772 (add), :892 (attach) |
| add-vs-attach README:27-41 | add keeps numbers; attach keeps world spot | OK | AA-Q1, AA-Q1b |
| add-vs-attach README:50-54 | hand/scene attach; scene.add lands near origin | OK | AA-Q2 |
| add-vs-attach README:61-75 | selection with attach; slot with add | OK | attach semantics |
| add-vs-attach README:80 | 35° → −35°; 0.01 → 100 | OK | AA-L80 −35.000; AA-Q3 |
| add-vs-attach README:81 | right straight after moving a parent | OK | Object3D.js:880,886; AA-L81 |
| add-vs-attach README:82 | not exact under uneven parent; docs say unsupported | OK | Object3D.js:864-878 doc; AA-L82 diff 0.448 |
| add-vs-attach card | definition + space lens | OK | as above |
| add-vs-attach scenes.ts | add/attach demo | OK | valid API |
| negative-scale README:23-27 | −1 mirrors; two minus signs = half turn | OK | NS-Q2 |
| negative-scale README:31-35 | FrontSide default; renderer flips front face on negative det of matrixWorld | OK | WebGLRenderer.js:1200 |
| negative-scale README:41 | r186 uses determinantAffine(), same number | OK | Matrix4.js:661-673 |
| negative-scale README:46 | det = product of scales; sign = mirror | OK | NS-Q2 |
| negative-scale README:52 | baked mirror: det positive, winding reversed, normals fine via normal matrix | OK | NS-Q3; BufferGeometry.js:388-396 |
| negative-scale README:62-66 | clone shares geometry/material | OK | NS-L62 true/true |
| negative-scale README:71-81 | no built-in winding flip; index swap code | OK | BufferGeometryUtils exports list has none; code valid |
| negative-scale README:84 | DoubleSide flips back-face normals | OK | normal_fragment_begin.glsl.js:2,14-16 |
| negative-scale README:90-94 | raycast skips back faces; face.normal inward; computeVertexNormals inward; scale.x=−1 fine | OK | NS-L90 hits far wall, normal inward; NS-L92; NS-L94 |
| negative-scale README:100 | decompose puts minus on X + half turn | OK | Matrix4.js:1094; NS-L100 (−1,1,1), rot.z −π |
| negative-scale README:101 | InstancedMesh copies not checked | OK | only object.matrixWorld checked (WebGLRenderer.js:1200) |
| negative-scale README:109, card:21 | "three.js checks determinant()" | IMPRECISE | F8 |
| negative-scale scenes.ts | mergeGeometries, reverseCorners, determinant readout | OK | valid r186 API |
| normal-matrix README:23-29 | normals; uneven scale tilts; ramp analogy | OK | NM-Q1 |
| normal-matrix README:37-44 | normal matrix keeps normals straight; Matrix3 | OK | Matrix3.js:352-356 |
| normal-matrix README:49 | inverse transpose; stretch 2 → squeeze | OK | NM-L49 diag 0.5,1,1 |
| normal-matrix README:55 | uniform/turn never tilt; axis-aligned box faces fine | OK | NM-Q2; NM-L55 |
| normal-matrix README:66-68 | applyNormalMatrix normalizes; applyMatrix3 doesn't; mutates; build once | OK | Vector3.js:437-441; NM-L66 1.118 vs 1 |
| normal-matrix README:72-79 | face.normal local; decal recipe | OK | NM-Q3 |
| normal-matrix README:84 | mesh.normalMatrix is camera space, filled at render, identity before | OK | WebGLRenderer.js:2160-2161; NM-L84 |
| normal-matrix README:88-95 | ShaderMaterial built-in normalMatrix; both lines camera space | OK | WebGLRenderer.js:2810-2811 |
| normal-matrix card | definition + space lens | OK | as above |
| normal-matrix scenes.ts | colorspace_fragment include; camera.updateMatrixWorld refreshes matrixWorldInverse | OK | Camera.js:112-118 |
| inverse README:23-31 | invert undoes; worldToLocal refreshes, inverts a copy | OK | Object3D.js:677-683 |
| inverse README:44 | M⁻¹M = I; singular | GENERAL-OK | linear algebra |
| inverse README:55-62 | worldToLocal for decals; mutates; inside-box trick | OK | IN-Q1 |
| inverse README:66, card cost | invert several times the cost of applying | RULE-OF-THUMB | op count, not measured |
| inverse README:68-73 | invert once; uses saved mw | OK | — |
| inverse README:75 | raycast inverts mw once per mesh | OK | Mesh.js:267-269 |
| inverse README:79-86 | invert() in place; rebuilt next render | OK | IN-Q3 |
| inverse README:90 | transpose only undoes pure turns | OK | IN-Q4 |
| inverse README:98-105 | zero scale → all-zero inverse → NaN; one axis zero same | OK | Matrix4 invert `det === 0` → zeros; IN-Q5, IN-L105 |
| inverse README:110 | camera.matrixWorldInverse kept with matrixWorld | OK | Camera.js:112-118; IN-L110 |
| inverse README:111 | attach uses inverse of new parent's mw | OK | Object3D.js:882 |
| inverse card | definition + lenses | OK | as above |
| inverse scenes.ts | setFromCamera NDC click, invert vs transpose demo | OK | valid API |
| local-vs-world / points-vs-dir / matrix-vs-mw cards | definitions + space lenses | OK | as above |
| CLAUDE.md gotcha | THREE.Clock deprecated as of r183 → Timer | OK | Clock.js:6,61; Three.Core.js:110 |
| CLAUDE.md gotcha | three/webgpu and three share three.core.js | OK | build/three.module.js:6, build/three.webgpu.js:6; package.json exports |
| CLAUDE.md gotcha | ShaderMaterial needs `#include <colorspace_fragment>` | OK | colorspace_fragment.glsl.js:2; WebGLProgram.js:781 |
| CLAUDE.md gotcha | sub/add/cross/normalize/multiplyScalar mutate | OK | Vector3.js in-place methods |
| CLAUDE.md gotcha | moving line needs frustumCulled=false | IMPRECISE | F13 |
| CLAUDE.md gotcha | collapsed section → zero size; scene.ts skips resize | OK | harness/scene.ts:37 |
| CLAUDE.md gotcha | import.meta.glob inline literal | GENERAL-OK | Vite docs, Glob Import |
| CLAUDE.md gotcha | Vitest hides passing output for agents; --silent=false | UNVERIFIED | detection confirmed (defaults chunk :67); fix not confirmed |
| CLAUDE.md open needs | Vitest in Node lacks WebGL; browser mode + Playwright | GENERAL-OK | Vitest docs |
| CLAUDE.md open needs | Playwright Chrome about 150 MB | RULE-OF-THUMB | size varies by version |
| CLAUDE.md open needs | controls.enabled=false while dragging | OK | OrbitControls `enabled` |
| writing-pages.md:20 | moving shifts points; turning turns both; neither changes length | OK | — |
| writing-pages.md:21 | transformDirection only turns + normalizes | IMPRECISE | F10 |
| writing-pages.md:32 | two meanings of "local" | OK | Object3D docs + localToWorld |
| writing-pages.md:170-172 | pointer aims with lookAt; hemisphere light at 2 | OK | lesson.ts:41-46; scene.ts:28 |
| writing-pages.md:183-184 | node -e import works; normalize(0,0,0) = (0,0,0) | OK | Vector3.js:792-796 |
| writing-pages.md:184 | acos of dot can be NaN | GENERAL-OK | MDN Math.acos |
| addendum:50 | marker check with (3,1,1) parent fails on transformDirection | IMPRECISE | F11 |
| addendum:52 | acos guard example | GENERAL-OK | MDN Math.acos |
| addendum:54 | raycast-after-move check fails without updateMatrixWorld | OK | UT-Q1 |
| addendum:56 | info.memory catches undisposed materials | IMPRECISE | F12 |
| addendum:58, :62 | env map check partly visual; value/invariant/guard/timing run in Node | OK | — |
| harness/scene.ts | WebGLRenderer, OrbitControls import path, Timer(connect/update/getDelta/getElapsed), setAnimationLoop, zero-size guard | OK | Timer.js:43,80,91,156; no deprecated calls |
| harness/lesson.ts:39-46 | cone rotateX(π/2) tip → +Z, side lookAt aims | OK | rotation maps +Y→+Z; Object3D.js:716-720 (non-camera uses target→position) |
| harness/lesson.ts:28-30 | CanvasTexture sRGB; Sprite labels | OK | current API |
| harness/lesson.ts:61-70 | ArrowHelper setDirection (unit) / setLength | OK | current API |
| harness/lesson.ts:77 | stored bounds go stale when end points move | OK | BufferGeometry.js:596-633 |
| harness/check.ts, drill.ts, quiz.ts, nav.ts, main.ts | no three.js API use | OK | grep: none |

### Verdict counts

- Quiz questions checked: 47. Wrong keys: 0. Distractors that are actually correct: 0. Explanation errors: 1 (compose Q1).
- WRONG: 1. IMPRECISE: 12 (F2–F13). OUTDATED: 0. GENERAL-OK: 5. RULE-OF-THUMB: 7. UNVERIFIED: 1. Everything else in the ledger is OK (46 of the 47 questions, plus roughly 115 prose, scene, card, doc, and harness claims).
