# Three.js Foundations — Concept Inventory

Sep 25, 2026 · Brad

Revised Sep 25, 2026 after reviewing the first build: Loop 1 now teaches every concept in plain language (an A/B page plus a read-the-code drill) instead of testing it. Predictions and hand calculation are gone, read-the-code replaces hand-compute, and the Loop 1 placement check is dropped.

Revised Sep 29, 2026 after the r186 check (`docs/r186-check/`): corrected r186 behavior, added missing r186 names, wrote every misconception as a wrong belief, and changed face normals and spatial queries to use three.js's methods instead of hand math.

## Builder brief

This doc is the source of truth for a repo that teaches foundational three.js and 3D graphics skills in plain language, then keeps them fresh with short manual drills. Build from it, and flag any concept you want to add rather than adding it silently.

**Goals**

- Teach in plain terms first: start from the most basic idea and build up, with no theory, abstraction, or hand math.
- Lock in foundational knowledge by doing, so it survives long stretches on a stable engine.
- Prove manual capability without AI assistance.
- Keep concepts separate from use cases, so no concept gets confused with the first place it was learned.
- Cover only knowledge that stays valuable as AI improves: what you need to read, debug, or evaluate 3D code.

**Constraints**

- Each drill stays small and covers one idea. No projects, full scenes, or features. Nothing is timed: drills get done around work, with constant context switching, so time spent says nothing.
- Drills run inside a shared minimal harness (renderer, camera, scene, test runner). The drill file holds only the work.
- Allowed during a drill: three.js docs and three.js source. Not allowed: AI tools and the solutions folder.
- Stack: Vite, TypeScript, three.js at one pinned version, Vitest for code checks.
- Out of scope: React Three Fiber, WebGPU/TSL, Gaussian splats, WebXR, character animation, physics, ECS. One exception: the Domain 15 VFX elective is written in TSL. TSL and Gaussian splats also have sandboxes in `/experiments`, outside the curriculum.

**Concept cards.** One markdown card per concept in `/concepts`, with these fields:

- Definition: one context-free sentence.
- Prerequisites: concept IDs. Tier: core or light, per the Tiers section.
- Misconceptions: the wrong models listed in this doc, each exposed by at least one drill.
- Use contexts: at least three unrelated ones, rotated across drills.
- Space lens: which coordinate space each value is in, only where it matters.
- Cost lens: CPU, GPU, or memory cost, only where it matters.

**Drill modes.** Core concepts get at least one drill per mode across the loops; light concepts get read the code, apply, and break-and-fix.

1. Read the code: short three.js or shader snippets with multiple-choice questions, graded on the page. No arithmetic.
2. Implement: write the working code yourself where building it is the practical skill, like a ray from the mouse or a drag on a plane. Never re-implement math three.js already provides.
3. Apply: use it in an assigned context, rotated across drills.
4. Break-and-fix: a subtly wrong implementation with a visible symptom to diagnose. You fix it and name the cause in one sentence.

**Loop 1 pages.** Every concept gets one page. It opens with the concept in one sentence and a list of several unrelated places it's used, so no single example becomes the meaning of the concept. Then come three parts. A · The basics is for a first-time learner: the idea in plain words, an analogy, and a scene to play with. B · Working knowledge is what a working developer knows: the code you'd write, the mistakes people make, and which methods want which kind of value. The Drill is read-the-code questions covering both halves. Light concepts get a shorter page. Formulas appear at most once, in a collapsed note that names the technical term so you'll recognize it elsewhere. B shows the exact syntax a developer types, such as `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` on a DPR page, so the syntax is learned where the concept is.

**Tour pages.** A tour is a light concept that covers a family of classes or an API surface rather than one idea, such as the materials or the Object3D API. Interviews often open with these basics before going deep. Each tour comes first in the domain it belongs to. Its page has one sentence for the family, a table of the members with when to use each and what it costs in plain words, a scene in A that switches between members, the constructor and the three or four properties you actually set in B, and the usual read-the-code drill. It names each member and points ahead to the page that teaches it in depth, rather than teaching it early. Later loops give tours apply and break-and-fix drills like any light concept, for example a RectAreaLight with no init call.

**Use three.js, then write the code that uses it.** Where three.js provides the math (normals, ray intersection tests, closest points), drills teach what its methods return, which space the result is in, and when to reach for each. How a method works inside is at most a collapsed note, never a drill. What drills do ask you to write is the code around those methods, such as the full raycasting sequence from memory.

**Code drill format (Loops 2–4).** You write the code in your own editor, in the drill's `drill.ts`. The drill's page runs your code in a live scene as you save, so you watch it work or break, and a test checks it wherever a test is possible.

- **Light concepts share a drill in pairs** in Loops 2 and 3. Pair concepts that are used together in real code, like length and normalize in "move toward a target at a speed", rather than neighbors in the list.
- **Break-and-fix, with the check (Loop 3).** After fixing the bug and naming its cause, write the automated check that would have caught it, wherever the bug can be checked automatically. If it can't, say in a sentence or two what a person has to look at and why a test can't see it. The rules and examples are in `docs/addendum-write-the-check.md`.
- **Misconception traps (Loop 3)** are break-and-fix drills where the bug is a wrong belief. They aren't a separate format.
- **Proof experiments (Loop 3, GPU domain).** A deliberately slow scene with switches for resolution, material cost, and draw calls. The page shows frame time and draw counts as you change one thing at a time; you also measure with Chrome's performance tools, then write down what was slowing it.

**Drill file format.** Frontmatter with `id` (loop.domain.concept.mode.n), `loop`, `tier`, `concepts`, `mode`, `context`, `lenses`, and `misconceptions`. A Loop 1 page's body is its A, B, and Drill sections. A code drill's body is the task, starter code, acceptance check (automated test or stated visual check), hidden hint, and one reflection question: where else does this concept apply?

**Repo layout**

```
/harness      shared scene setup, drill viewer, and test helpers
/concepts     one card per concept
/drills       <loop>/<domain>/<concept>/<drill>
/placement    one check per domain for Loops 2–4
/checkpoints  one set per loop
/cross        cross-domain drills
/solutions    mirrored tree, never opened during a drill
/scripts      pick.ts (loop-aware drill picker), coverage.ts
/experiments  sandboxes outside the curriculum
COVERAGE.md   generated from drill frontmatter
```

**Spaced practice.** `pick.ts` suggests the next drill, weighting the domains and modes practiced least recently, and logs the date each drill was finished, never how long it took.

**Build order.** Build the harness, `pick.ts`, and Loop 1 for Domain 1, then stop for review. After approval, build Loop 1 for all domains so practice can start, then build each later loop while the previous one is in progress. Build Loop 3 before polishing Loop 4: break-and-fix is the closest match to real debugging and interviews, and the misconceptions listed below become its bugs, so each one must be a mistake people really make. Build Domain 15 after core Loop 2, and the blank-file elective after Loop 4.

**Blank-file drills go last.** A drill set that starts from an empty file (renderer, scene, camera, resize, frame loop) comes after Loop 4, as its own elective: Blank-file scenes, the last domain section below. Setting up a project from scratch is rare, and people use the docs when they do. The concepts are already in the loops; the pages show their exact syntax in B:

| Piece | Where it's taught | Syntax B shows |
| --- | --- | --- |
| DPR and its cost | Primer; Domain 14 Resolution and DPR; Domain 9 Pointer events; Domain 12 Fragment coordinates | `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` |
| Resize | Domain 4 Aspect and resize | `renderer.setSize(w, h, false)`, `camera.aspect = w / h`, `camera.updateProjectionMatrix()` |
| Fit a model to the camera | Domain 4 Fit to bounds | `Box3.setFromObject`, `getBoundingSphere` |
| Disposal | Domain 6 Disposal ownership | `geometry.dispose()`, `material.dispose()`, `texture.dispose()` |

## Learning loops

The repo runs as four loops. Each loop covers every domain at a higher bar, so every core concept is revisited at spaced intervals rather than drilled once in a row.

| Loop | Proves | Drill modes | Scope | Est. drills |
| --- | --- | --- | --- | --- |
| 1. Literacy | I understand it and can read it in code | A/B page, read the code | Every concept, one page each; light and tour pages are shorter | ~159 |
| 2. Fluency | I can write it | Implement, apply | Core: two each. Light: apply, two concepts per drill | ~191 |
| 3. Diagnosis | I can find what's wrong and prove it | Break-and-fix, misconception traps, proof experiments | Core: one each. Light: two concepts per drill | ~119 |
| 4. Judgment | I can evaluate and direct | Cross-domain, AI review, teach-back | Integration across domains | ~45 |

The total is about 515 pages and drills, or roughly 17 months at one a day. Placement checks in Loops 2–4 should cut that by an estimated 25–40% for a working practitioner.

**Loop rules**

- Placement check: each domain opens Loops 2–4 with a short, no-docs check. Passing every part suggests skipping that domain's drills for that loop; any miss suggests doing them. Loop 1 has none: to test out of a page, collapse A and B and go straight to the drill.
- Checkpoint: each loop closes with a no-docs set sampling every domain. It's a self-check before the next loop, not a gate: move on when you understand the material, whatever the score.
- Interleaving: `pick.ts` mixes domains within a loop while respecting prerequisites.
- Maintenance: after Loop 4, `pick.ts` rotates drills from all loops, weighted toward the least recently practiced concepts and the weakest checkpoint results.
- Electives: Domain 15 (Procedural & VFX) comes after core Loop 2, since it needs shader fluency. It has no four-loop pass: it's coding exercises that end with building each effect from memory into an existing scene. The blank-file elective comes after Loop 4.

**Judgment-loop drill types**

- AI review: plausible generated code with one subtle flaw or a worse trade-off. Find it, prove it, and fix it. Like everything else, it has no time limit. The snippets are stored in the repo, so a retry is the same drill, and regenerated periodically from current AI output, because the mistakes AI makes change as models improve. An AI review can end with writing the check, like break-and-fix.
- Teach-back: explain a concept in five plain sentences in a box on the page, then reveal the page's key points and compare. Nothing is graded.
- Cross-domain: the drills listed in the Cross-domain section, in the same code drill format as Loops 2–3.

## Tiers

72 of the 159 core-path concepts are core and get every drill mode. The other 87 are light and get a shorter Loop 1 page, then apply and break-and-fix, often two concepts per drill. The seven tour pages are all light. Promote a light concept to core if it starts mattering in real work.

| Domain | Core concepts (everything else in the domain is light) |
| --- | --- |
| 1. 3D Math Primitives | Point vs direction; dot product; cross product; projection and rejection; angle between and signed angle; floating-point tolerance |
| 2. Coordinate Spaces & Transforms | Local vs world space; matrix vs matrixWorld; update timing; TRS order; points vs directions; inverse matrices; normal matrix |
| 3. Rotation | Euler angles and order; quaternions; rotation matrix as a basis; lookAt and the up vector |
| 4. Camera & Projection | View matrix; projection matrix; clip space, NDC, screen; project and unproject; depth precision |
| 5. Geometry & Buffer Data | BufferAttribute and itemSize; indexed vs non-indexed; winding order; face normals; vertex normals; tangent space and normal maps |
| 6. Assets & Runtime Delivery | glTF structure; decode, upload, compile; runtime memory math; disposal ownership |
| 7. Scene Graph Traversal & Inspection | Traverse variants; world-space bounds; clone semantics |
| 8. Spatial Queries | Ray from pointer; intersection anatomy; ray–plane; ray–triangle; BVH |
| 9. Interaction & Manipulation | Drag on a plane; axis-constrained drag; local vs world manipulation; 3D-to-2D anchoring; frame-rate-independent motion |
| 10. GPU Pipeline & Bottleneck Diagnosis | Pipeline stages; draw call anatomy; depth buffer and early-z; blending and transparency; render targets; multi-pass and post-processing; frame budget; measurement tools |
| 11. Materials, Lighting & Color | Color spaces; tone mapping and exposure; diffuse (Lambert); PBR metal and roughness; environment maps and IBL |
| 12. Shaders | Vertex vs fragment; attributes, uniforms, varyings; built-in matrices and spaces; built-in functions; debug output |
| 13. Debugging & Visualization | Triage; reading matrices; isolation; frame capture |
| 14. Optimization & Memory | Draw call reduction; resolution and DPR; allocation hygiene; texture budget; leak detection |

## Primer: where work runs

Every cost-lens note asks one question: does this spend CPU time, GPU time, or memory? Read this before Domain 1 so the lens works from the start.

| Where | What runs there | Cost scales with |
| --- | --- | --- |
| CPU (JS main thread) | App logic, matrix updates, traversal, frustum culling, raycasting, sorting, issuing draw calls, garbage collection | Object count, draw calls, allocations |
| GPU vertex stage | Vertex shader, once per vertex per pass | Vertex count × instances × passes |
| GPU fragment stage | Fragment shader, once per covered pixel, including overdraw | Pixel count, overdraw, shader complexity |
| GPU memory | Vertex buffers, textures, render targets | Vertex and index data size, texture dimensions, render-target and canvas size (which grows with DPR²) |
| CPU→GPU upload | First use of a buffer or a loaded texture, or after `needsUpdate = true` (a texture you build yourself uploads only once you set it) | The whole buffer or texture, unless you mark an update range (`addUpdateRange`) |

- Frame budget is 16.67 ms at 60 Hz and 8.33 ms at 120 Hz. CPU and GPU work overlap, so the slower side sets frame time.
- `renderer.render()` returning quickly proves nothing about the GPU. WebGL calls queue work that runs later.
- Pixel count scales with DPR squared. DPR 2 means four times the fragments of DPR 1.
- An uncompressed 8-bit RGBA texture costs width × height × 4 bytes, plus a third more for mipmaps. Half-float costs 8 bytes a pixel and float 16. `TextureUtils.getByteLength` gives the exact figure.

## 1. 3D Math Primitives

Vectors are the vocabulary for every later domain. Loop 1 pages here start from zero: the origin, the axes, and what a Vector3 is.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Point vs direction | A point is a location; a direction is a displacement. Point − point = direction. | "A Vector3 is always a position." | Position vs velocity; midpoint of two parts; transforming with w=1 vs w=0 |
| Length and lengthSq | Magnitude; lengthSq skips the square root. | "Comparing distances needs the real length." | Nearest-object search; radius check; speed clamp |
| Normalize | Scale to length 1, keeping direction. | "Always normalize." "Normalizing a zero vector throws or gives a default direction." It quietly returns (0, 0, 0). | Direction to a target; surface normal; ray direction |
| Dot product | ‖a‖‖b‖cosθ: a continuous scalar measuring alignment. | "Only −1, 0, or 1." "Always within [−1, 1]." "Math.acos of the dot of two unit vectors is always safe." Rounding can push it just past 1, and acos returns NaN; angleTo clamps. | Front/behind test; Lambert N·L; projection length on an axis; signed distance to a plane; cone check |
| Cross product | A vector perpendicular to both inputs. Length ‖a‖‖b‖sinθ is the parallelogram area; direction follows the right-hand rule. | "Returns a unit vector." "Order doesn't matter." "Parallel inputs still give a usable perpendicular." They give (0, 0, 0). | Triangle normal; left/right turn test; building an orthonormal basis; triangle area |
| Projection and rejection | Projection is the part of a along b; rejection is what's left. | "Zeroing one axis projects onto any plane." It only works for axis-aligned planes. | Sliding along a wall; constraining motion to an axis; closest point on a line |
| Reflection | r = d − 2(d·n)n, with n unit length. | "n doesn't need normalizing." | Bounce direction; mirror camera; specular reflection vector |
| Lerp | a + (b − a)t. | "Lerped unit vectors stay unit length." "t stays within 0–1"; outside, it extrapolates. | Positions; colors; blend weights |
| Angle between and signed angle | angleTo is unsigned (0 to π). A signed angle needs atan2(cross·axis, dot). | "angleTo tells you which way to turn." | Dial or knob rotation; turn direction; compass heading |
| Spherical coordinates | Radius; polar angle phi measured down from +Y; azimuth theta around Y, measured from +Z toward +X. Other sources often swap phi and theta. | "Phi is measured from the equator." "Theta still gives a heading at the poles." Straight up or down, every theta is the same point, and converting back gives 0. | Orbit camera; points on a sphere; latitude/longitude |
| Scalar triple product | a·(b×c) is a signed volume; its sign gives orientation. | "Handedness can't be computed." | Point above or below a triangle; mirrored basis check; tetrahedron volume |
| Floating-point tolerance | Compare with an epsilon, not ==. | "Equal math means equal floats." | Vector equality tests; degenerate triangles; coplanar checks |

**Lens notes**

- Space: dot and cross only mean something when both inputs share a space.
- Cost: the math is cheap; allocation isn't. `new Vector3()` in a per-frame loop feeds the garbage collector, so drills use scratch vectors.
- Cost: lengthSq over length matters only in hot loops, such as per-vertex or per-object checks.

## 2. Coordinate Spaces & Transforms

Most 3D bugs are a correct value in the wrong space. Every drill in this domain names its input and output space.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Tour: the Object3D API | Every object in a scene is an Object3D. The members you use daily: position, rotation, scale, quaternion; add, remove, attach; getWorldPosition and friends; lookAt; visible; layers; userData. | "object.position = v sets the position." It's read-only and throws; use set or copy. "rotation and quaternion are two separate turns." They're two views of one turn and stay in sync. | Placing and turning a product; hiding a part; tagging a part with its SKU |
| Local vs world space | Each object has its own frame; world is the frame everything lands in after every parent's transform, the scene's own included (normally identity). | "object.position is the world position." | A part's world position; attaching a light to a part; comparing nested objects |
| matrix vs matrixWorld | matrix is local TRS relative to the parent. matrixWorld = parent.matrixWorld × matrix. | "matrixWorld is always current." | Reparenting; world-space bounds; exporting transforms |
| Update timing | Setting position leaves matrixWorld stale until an update runs; render runs one every frame. updateMatrixWorld refreshes the object and its children, not its parents; updateWorldMatrix(true, false) refreshes the parents too. | "Setting position updates matrixWorld right away." "updateMatrixWorld() also refreshes the parents." | Raycasting right after a move; bounds after a transform; syncing to external data |
| TRS order | A point is scaled, then rotated, then translated (when no pivot is set). multiply vs premultiply decides which frame a change applies in. | "Order doesn't matter." "A parent's uneven scale just stretches a rotated child along the child's own axes." It shears the child instead. | Rotating around a pivot; orbiting a point; scaling a rotated part |
| compose and decompose | Build a matrix from position, quaternion, and scale, or split one apart. | "Every matrix decomposes cleanly." A sheared one doesn't: decompose drops the shear. | Baking transforms; extracting world rotation; copying a world transform |
| Points vs directions | Points pick up translation: applyMatrix4 (an implied w=1). Directions must not: transformDirection for a unit direction (it re-normalizes), or applyMatrix3 with the upper 3×3 (Matrix3.setFromMatrix4) when length matters, like a velocity. | "applyMatrix4 works for directions." | Transforming a hit point; transforming a ray direction; transforming a velocity |
| Inverse matrices | The inverse maps back: world to local, or world to view. | "Inverse equals transpose." True only for a pure rotation (or rotation plus mirror) with no translation or scale. | worldToLocal; a hit point in object space; building a view matrix |
| add vs attach | add keeps local values, so the object may jump. attach keeps the world transform, as long as no parent involved has non-uniform scale. | "Reparenting never moves anything." | Picking up an object; grouping a selection; moving a part onto a rack |
| Pivots and offset groups | Rotate or scale around a point other than the origin, either through a parent offset group (works in every version) or with r186's built-in `object.pivot`. | "Rotation always happens around the geometry's center." "Turning around another point always needs a parent group." "With pivot set, position is still where the object's origin ends up." | Door hinge; rotating around a bounding box center; scaling from a corner |
| Normal matrix | Normals transform by the inverse transpose of the upper 3×3. three.js's `object.normalMatrix` is the view-space one; for world space use `new Matrix3().getNormalMatrix(object.matrixWorld)`. | "Normals transform like directions." This breaks under non-uniform scale. | Lighting a squashed object; face normal to world; rim effects |
| Negative scale and determinant | A negative determinant mirrors. three.js flips culling for a mesh whose matrixWorld is mirrored (`determinantAffine() < 0`), but not for mirrored vertex data or mirrored copies inside an InstancedMesh. | "Mirroring by object scale and by baked geometry behave the same." | Left/right product variants; mirrored imports; baking transforms into geometry |

**Lens notes**

- Space: this domain is the space lens. Every answer states which space it is in.
- Space: getWorldPosition and the other getWorld* methods, localToWorld, worldToLocal, lookAt, and attach update matrices for you. Reading .matrixWorld directly, raycasting, frustum tests, and Vector3.project don't, so update first.
- Cost: updateMatrixWorld walks the whole tree every frame. matrixAutoUpdate = false only skips rebuilding that object's local matrix; its world matrix is still recomputed whenever an ancestor updates, and the scene root updates every frame by default.

## 3. Rotation

Rotation has several representations. The skill is knowing what each is good for and converting between them without surprises.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Euler angles and order | Three angles and an order; three.js defaults to XYZ. 'XYZ' turns about the object's own X, then its new Y, then its new Z, which equals turning about the fixed Z, then Y, then X. | "Order doesn't matter." "rotation.y is always yaw." | UI rotation sliders; reading imported rotations; yaw/pitch camera |
| Gimbal lock | When the middle axis reaches ±90°, two axes align and one degree of freedom is lost. | "It's a bug in the math library." | Camera pitched straight down; turntable at extremes; interpolating Euler angles |
| Axis-angle | Rotate by an angle around a unit axis. | "rotateOnAxis uses world axes." | Hinges; spinning around a tilted axis; rotateOnAxis vs rotateOnWorldAxis |
| Quaternions | A unit 4D value; q and −q are the same rotation. q.multiply(d) applies d in the object's local frame; q.premultiply(d) applies it in the parent's frame, which is world space only when no parent is rotated. | "The components are angles." "Multiplication order doesn't matter." | Accumulating rotations; local vs world deltas; orientation from two vectors |
| Slerp | Constant angular speed along the shortest arc. | "Lerping Euler angles is equivalent." | Camera orientation transitions; turning to face a target; blending orientations |
| Rotation matrix as a basis | The columns are the object's local +X, +Y, and +Z after rotation, multiplied by scale (normalize them). +Z is forward for ordinary objects; a camera looks down −Z, so its forward is the negated third column. | "A matrix is an opaque box of numbers." | Reading forward from a matrix; makeBasis from three axes; extracting local axes |
| lookAt and the up vector | Builds a basis from forward and up; degenerates when forward is parallel to up. | "Everything faces the target the same way." Cameras look down −Z; other objects point +Z at the target. "spotLight.lookAt aims the light." Spot and directional lights shine at their `.target`, whatever their rotation. | Billboards; aiming a spotlight; top-down camera |
| Rotating around a point | Translate to the point, rotate, translate back. | "Rotation always happens around the origin." | Orbit; hinge; spinning a product around its center |
| Converting representations | Euler, quaternion, matrix, and axis-angle all convert; Euler round-trips can return different but equivalent angles. | "A round-trip returns the same numbers." | Serializing state; displaying rotation in UI; comparing orientations |

**Lens notes**

- Space: rotateX and multiply act in local space; rotateOnWorldAxis and premultiply act in the parent's space, which is world space only when no parent is rotated.
- Space: to aim a spot or directional light, move its `.target` and add the target to the scene, so its world position stays current.

## 4. Camera & Projection

A camera is two matrices. Knowing them lets you move any point between world, screen, and back.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| View matrix | camera.matrixWorldInverse maps world into camera space. It ignores any scale on the camera, so don't scale cameras. | "The view matrix is the camera's transform." It's the inverse. | View-space depth; camera-relative UI; billboards |
| Projection matrix | Perspective uses vertical FOV, aspect, near, and far. Orthographic uses a box. | "FOV is horizontal." "Narrowing FOV equals moving closer." | Zoom vs dolly; orthographic thumbnails; isometric views |
| Clip space, NDC, screen | Divide clip coordinates by w to get NDC (−1 to 1), then map to pixels with y flipped. | "NDC y points down like CSS." | Pointer to NDC; world point to label position; off-screen test |
| project and unproject | project maps world to NDC; unproject maps NDC to world at a chosen depth. | "A point behind the camera always lands off-screen." It can land on-screen; check z. | 3D labels; placing an object under the cursor; building a ray |
| Depth precision | Perspective depth is non-linear, so precision concentrates near the near plane. | "The far plane causes z-fighting." Near is the main lever. | Coplanar decals; large scenes; logarithmic depth trade-off |
| Frustum | Six planes derived from projection × view. | "Frustum culling tests triangles." | Visibility test; culling; fitting a shadow camera |
| Aspect and resize | Update aspect and call updateProjectionMatrix after resizing. | "setSize fixes the aspect." | Window resize; split views; rendering a thumbnail at a new size |
| Fit to bounds | Distance from bounding sphere radius and FOV, using the narrower FOV axis. | "Vertical FOV is enough on portrait screens." | Focus on a part; auto-frame on load; thumbnail generation |
| World size per pixel | At view depth d (along the camera's forward axis, not straight-line distance): 2·d·tan(fov/2) ÷ (viewport height × zoom), with camera.fov converted from degrees. | "On-screen size is constant across depth." | Constant-size hotspots; LOD selection; gizmo scaling |
| Camera-relative directions | Forward from getWorldDirection; right from forward × up, normalized. That breaks looking straight up or down; take right from the camera matrix's first column instead. | "Camera forward is +Z." | Screen-aligned panning; WASD movement; dragging parallel to the view |

**Lens notes**

- Space: this domain completes the chain local → world → view → clip → NDC → screen. Each drill names its two ends.
- Cost: projecting hundreds of labels per frame is fine CPU work; thousands belong in a shader or points.
- Space: world size per pixel comes out in whatever pixels the viewport height uses. Use the same kind (CSS or device) as the hotspot size.

## 5. Geometry & Buffer Data

A mesh is typed arrays plus rules for reading them. Drills build and inspect that data directly.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Tour: object types | Mesh, InstancedMesh, BatchedMesh, Points, Line and LineSegments, Sprite, and Group: what each draws, and when each is one draw call. | "InstancedMesh and BatchedMesh are the same thing." Instances share one geometry; a batch holds different geometries under one material. "linewidth sets how thick a line draws." WebGL ignores it and draws 1-pixel lines. | A rack of repeated shelves; a point cloud scan; wireframe and dimension lines |
| BufferAttribute and itemSize | A flat typed array; count = length ÷ itemSize. | "Array index equals vertex index." | Reading vertex 7's position; writing a color attribute; custom per-vertex data |
| Interleaved attributes | Several attributes share one buffer with a stride and offset. | "Every attribute has its own array." | Reading loaded glTF data; manual vertex edits; cache-friendly layouts |
| Indexed vs non-indexed | An index lets triangles share vertices. | "Shared vertices can have different normals." | Memory savings; flat shading; per-face colors |
| Winding order | Counter-clockwise vertex order marks the front face. | "Flipping normals flips culling." Culling uses winding, not normals. | Inside-out imports; mirrored geometry; DoubleSide trade-offs |
| Face normals | A triangle's face normal points straight out of it. Get it from three.js (`Triangle.getNormal`, `hit.face.normal`), know that it's measured from the object itself, and move it to the world with a world normal matrix (`new Matrix3().getNormalMatrix(matrixWorld)`), not `object.normalMatrix`, which is view space. | "The face normal is the average of its vertex normals." | Flat shading; back-face test against a direction; raycast face normal |
| Vertex normals | Averaged face normals; hard edges need duplicated vertices. | "Imported normals are always right." | Smoothing artifacts; low-poly look; fixing bad normals |
| UVs | 2D texture coordinates, usually 0 to 1. A second set (`uv1`) often holds light and AO maps; a map reads it only with `texture.channel = 1`, which GLTFLoader sets for you. | "UVs must stay within 0–1." | Texture mapping; generating box UVs; lightmap setup |
| Bounding box and sphere | Computed in the geometry's own space and stored on it; `null` until something computes it. translate, scale, and applyMatrix4 recompute it; direct attribute edits don't, so call computeBoundingBox and computeBoundingSphere. Culling and raycasting read the sphere. | "geometry.boundingBox is in world space." | Culling; raycast early-out; camera fitting |
| Updating buffers | Set needsUpdate after edits; setDrawRange limits what draws. | "Editing the array updates the GPU." | Deforming vertices; progressive reveal; per-vertex highlight |
| Groups and multi-material | Groups map index ranges (vertex ranges without an index) to slots in a material array; each group is then its own draw call. With a single material, groups are ignored. | "One mesh is always one draw call." | Per-part materials; draw call audit; raycast materialIndex |
| InstancedMesh | One geometry and material drawn many times with per-instance matrices. | "Instances can use different materials." | Repeated hardware; selection by instanceId; per-instance color |
| Tangent space and normal maps | Tangent, bitangent, and normal form a per-vertex basis (TBN). Tangent-space normal maps store surface detail relative to it. | "Normal map colors are world directions." "The green channel convention doesn't matter." glTF and three.js use +Y (OpenGL); Unreal uses −Y (DirectX). | Surface detail on low-poly meshes; mirrored UVs breaking lighting; importing maps from Substance or Unreal |

**Lens notes**

- Space: attribute positions are in local space.
- Space: tangent space is a fourth space alongside local, world, and view. Normal-map drills state which space each normal is in.
- InstancedMesh keeps its own bounds, which go stale when instances move; call its computeBoundingSphere after setMatrixAt.
- Cost: vertex count drives vertex-stage cost. Every mesh is at least one draw call, and each group of a multi-material mesh adds one more; sharing a material doesn't merge draw calls.
- Memory: position, normal, and UV as float32 cost 32 bytes per vertex. Indices cost 2 bytes (Uint16) or 4 (Uint32) each, and a loaded glTF can also use 1-byte indices. Quantized models use less.

## 6. Assets & Runtime Delivery

A loaded model has four separate costs: download, decode, GPU upload, and shader compile. File size predicts only the first.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Tour: loaders and textures | GLTFLoader with its helpers (DRACOLoader, KTX2Loader, the Meshopt decoder) and HDRLoader; TextureLoader, CanvasTexture, DataTexture, and VideoTexture. | "Each loader works on its own." GLTFLoader throws on compressed files until its decoders are attached. "A CanvasTexture follows its canvas." Redrawing needs `needsUpdate = true`. | A compressed product model; a price tag drawn on a canvas; a lookup table as a DataTexture |
| glTF structure | Scenes → nodes → meshes → primitives → accessors → buffer views → buffers, plus materials and textures. | "One glTF mesh becomes one three.js Mesh." Multi-primitive meshes become a Group. | Finding a part by node name; auditing material assignments; explaining unexpected child meshes |
| Load lifecycle | Loading is async, with progress, completion, and failure states. | "onLoad means it will render without a hitch." | Loading indicators; dependent loads; error states |
| Decode, upload, compile | GPU upload happens on first render; shader programs compile on first use. compileAsync pre-warms shaders only (set up lights and environment first, or they compile again); renderer.initTexture uploads a texture early. | "Once loaded, it renders instantly." | First-interaction hitch; variant switch; pre-warming with compileAsync |
| Draco vs Meshopt | Draco usually gives the smallest raw download, with a slower decode that runs in a worker. Meshopt decodes very fast and is built to be gzipped or brotli'd, which closes most of the size gap. | "Compressed geometry uses less GPU memory." Compression is undone at decode; only quantization (KHR_mesh_quantization, which gltfpack applies by default) keeps smaller numbers on the GPU. | Payload budget; mobile decode time; choosing per asset |
| KTX2 and Basis textures | Transcode at load to a compressed format the GPU reads directly (ASTC, BC7, ETC), so the texture stays compressed in VRAM. If the device supports none, KTX2Loader falls back to raw RGBA and the saving disappears. | "A 200 KB JPG costs 200 KB of memory." It decodes to raw RGBA. | Mobile VRAM budget; large swatch libraries; texture-heavy products |
| Runtime memory math | Texture bytes ≈ w × h × 4 × 1.33 with mipmaps; geometry bytes come from attribute sizes. | "File size equals memory size." | A model's footprint; mobile tab crashes; comparing variants |
| Reuse and caching | Load once per URL; share geometry, materials, and textures across uses. | "Loading the same URL twice is free." | Repeated parts; variant swaps; duplicate-load leaks |
| Disposal ownership | Removing from the scene frees nothing on the GPU. Dispose the geometry, materials, and textures you own. | "remove() frees memory." "Dispose everything under a removed object." Only dispose what nothing else still uses. | Variant switching; SPA route changes; long sessions |
| Preload vs lazy load | Trade startup time against memory and first-use latency. | "Preload everything." | Likely-next variant; off-screen models; priority ordering |

**Lens notes**

- Cost: download is network time; decode is CPU or worker time; upload and compile stall the main thread.
- Memory: JS heap and GPU memory are separate budgets. An uncompressed 2048 × 2048 texture is about 22 MB with mipmaps.
- Texture color space for loaded assets is covered in Domain 11.

## 7. Scene Graph Traversal & Inspection

Traversal is how you question a scene you didn't build. Drills use unfamiliar loaded models, not hand-made scenes.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Traverse variants | traverse visits everything; traverseVisible skips hidden subtrees; traverseAncestors walks up. | "traverseVisible still visits children of hidden objects." | Collecting meshes; finding the product root from a clicked mesh; applying an override |
| Finding objects | getObjectByName returns the first match; type flags like isMesh filter. | "Names are unique." glTF doesn't guarantee it. "The name in Blender is the name in three.js." GLTFLoader cleans names and numbers repeats; the original is in userData.name. | Finding a node; grouping by material; locating lights |
| Safe mutation | Collect during traversal, then add, remove, or replace afterward. | "Removing inside traverse is fine." | Removing helpers; replacing meshes; splitting groups |
| World-space bounds | Box3.setFromObject returns a world AABB of the object and all its children, hidden ones and helpers included. By default it boxes each child's local box, so it's loose, looser under rotation; pass `true` as the second argument for a tight fit. Update parent matrices first. | "Object bounds equal geometry.boundingBox." | Camera fit; floor placement; footprint measurement |
| Scene statistics | Count meshes, triangles, and unique geometries, materials, and textures by uuid. | "100 meshes sharing a material is one draw call." | Asset audit; before/after optimization; variant comparison |
| Visibility, removal, layers | visible = false hides an object and its whole subtree from rendering, but not from raycasts. Layers filter per camera and per raycaster, but test each object alone: children keep their own layers. | "Invisible objects can't be raycast." They can. | Hiding a part; excluding helpers from picks; per-view visibility |
| userData and metadata | glTF extras arrive as userData. | "Metadata must live outside the scene." | Tagging parts with IDs; marking parts selectable; storing an original material |
| Material override and restore | Store originals, swap, then restore. | "Restoring happens automatically." | Highlight; x-ray mode; debug views |
| Clone semantics | clone shares geometry and materials by default. | "Changing a clone's material color affects only the clone." | Per-instance color bug; variant duplication; memory audit |

**Lens notes**

- Cost: traversal is O(n) CPU work. Fine on events, wasteful every frame, so cache results.
- Space: `object.position` is in the parent's space; geometry data and `geometry.boundingBox` are in the object's own space. Only `getWorldPosition`, `Box3.setFromObject`, and similar methods give world space.
- GLTFLoader turns spaces in names into `_`, removes dots, slashes, colons, and brackets, and adds `_1`, `_2` to repeats within one file. Two loaded copies of the same model still share names.

## 8. Spatial Queries: Raycasting, Bounds & BVH

Raycasting and bounds tests are CPU math over the scene. three.js provides every test here, so drills use its methods and measure them, never re-implement them. The skill that's typed from memory is the raycasting code itself: pointer to NDC using the canvas rect, `raycaster.setFromCamera`, `intersectObject` or `intersectObjects` with the recursive flag, reading the hit, filtering with layers or a target list, and walking up from the hit mesh to the part you care about (`traverseAncestors`, or checking `parent` and `userData`).

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Ray | origin + t·direction for t ≥ 0. | "A ray extends both ways." | Pointer picking; line of sight; placing on the ground |
| Ray from pointer | Pointer → canvas-relative pixels → NDC → setFromCamera. | "Use the window size for NDC." Use the canvas rect. | Click; hover; drag start |
| Intersection anatomy | Read the hit from memory: distance, point (world), face (local-space normal), faceIndex, uv, instanceId, object; sorted by distance. | "face.normal is in world space." "The first hit is the visible one." | Orienting a marker; painting at a UV; picking an instance |
| Filtering | The recursive flag (on by default), layers (tested per object, not per subtree), and target lists limit what gets tested. Then walk up from `hit.object` to the part you want, with traverseAncestors or `parent` and `userData`. | "Helpers are ignored automatically." | Ignoring helpers; selectable parts only; ground-only placement |
| Ray–plane | `ray.intersectPlane(plane, target)` returns the hit point, or `null` when the ray is parallel or the plane is behind it. A ray lying in the plane hits at its own origin. | "Every ray hits an infinite plane." | Dragging on a floor; placement grid; measuring |
| Ray–sphere | `ray.intersectSphere` returns the nearest hit point or `null`; `intersectsSphere` only says yes or no, which is enough for an early-out. | "A ray that starts inside the sphere misses it." It hits on the way out. | Coarse hit test; bounding sphere early-out; hotspot hit |
| Ray–triangle | `ray.intersectTriangle(a, b, c, backfaceCulling, target)` returns the hit point or `null`. Raycasting a mesh runs this test per triangle, and the hit's barycentric coordinates blend the vertex values, such as the UV, at the hit. | "Barycentrics only matter for the hit test." | Exact picking; UV interpolation at a hit; back-face handling |
| Ray–AABB | `ray.intersectBox` returns the first hit point in front of the ray or `null`; `intersectsBox` is the cheap yes-or-no early-out, the same kind of test a BVH runs on every node. | "A ray that starts inside the box misses it." It hits on the way out. | Early-out; BVH node test; grid lookup |
| Bounds primitives | Box3, Sphere, Plane, and Frustum containment and overlap tests. | "Plane distance is always positive." It's signed. | Placement overlap; visibility; trigger volumes |
| AABB vs OBB | An AABB of a rotated object is loose; an OBB rotates with it. | "Box3 fits rotated objects tightly." | Tight overlap checks; rotated parts; bounds display |
| Closest-point queries | `ray.closestPointToPoint`, `Line3.closestPointToPoint`, `Box3.clampPoint`, and `Triangle.closestPointToPoint` return the closest point on each shape. | "The closest point is the nearest vertex." | Snapping to an edge; distance measurement; proximity hover |
| BVH | A bounds hierarchy that cuts triangle tests from O(n) to about O(log n). | "A BVH speeds up everything." It helps large meshes, costs build time, and needs a refit after edits. | High-poly picking; shape casts; collision queries |

**Lens notes**

- Space: the ray is moved into each object's local space through the inverse matrixWorld. That's why face.normal comes back local.
- Cost: each mesh costs a bounding-sphere test. Only meshes whose sphere is hit pay for a matrix inverse, then triangle tests. Deep hierarchies multiply the first cost; high-poly meshes multiply the second.
- Cost: raycasting is synchronous CPU work, so performance.now timing is accurate here, unlike render timing.
- GPU picking is the GPU-side alternative; see the cross-domain drills.

## 9. Interaction & Manipulation

Interaction is the integration domain. Each concept composes math, spaces, projection, and queries into input handling, and drills cite the domains they draw on.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Tour: controls | OrbitControls, TransformControls, and PointerLockControls: what each one moves, and the setup each needs. | "Damping works without calling update()." "Add TransformControls to the scene." In r186 you add its `getHelper()`. | Product viewer orbit; moving a part with a gizmo; a walkthrough of a showroom |
| Pointer events | Pointer events unify mouse, touch, and pen. clientX and clientY are CSS pixels relative to the viewport; subtract `canvas.getBoundingClientRect()` for canvas pixels. | "Multiply by DPR before computing NDC." | Click; touch tap; pen input |
| Click vs drag | A movement threshold separates them; pointer capture keeps the drag. | "pointerup on the same object means a click." | Select vs orbit; tap vs pan; long press |
| Hover and selection state | A small state machine (none, hover, selected) with restore on exit. | "Hover and selection can share one flag." | Part highlight; multi-select; deselect on empty click |
| Orbit, pan, dolly | Orbit is spherical motion around a target; pan moves target and camera in the view plane; dolly moves along the view direction. | "Dolly and zoom are the same." | Product viewer; top-down planner; inspecting detail |
| Drag on a plane | Ray–plane on each move, keeping the grab offset. | "The hit point is where the object goes." Without the grab offset, the object's origin snaps to the cursor. | Floor drag; wall drag; 3D slider |
| Axis-constrained drag | Project motion onto an axis, using a plane that contains the axis and faces the camera. | "Use the screen delta directly." | Gizmo axis; height adjustment; sliding along a rail |
| Local vs world manipulation | The same drag uses different axes in local and world space. | "Axes are always world axes." | Moving along a rotated rail; rotating relative to a parent; gizmo space toggle |
| Controls coexistence | Disable orbit while a gizmo or custom drag is active. | "Controls ignore each other." | TransformControls; custom drags; HTML overlays |
| Focus on object | Fit to bounds, then animate camera position and target together. | "Move the camera but leave the target." | Double-click focus; reset view; guided views |
| 3D-to-2D anchoring | Project to screen for HTML labels; hide them behind the camera or when occluded. | "Projected labels hide themselves." project() doesn't: behind the camera, z goes past 1 and x and y flip. CSS2DRenderer hides those, but nothing hides labels behind other objects. | Hotspots; price tags; measurement labels |
| Frame-rate-independent motion | Use delta time; damp with 1 − e^(−λ·dt). | "lerp(x, target, 0.1) each frame is fine." It runs twice as fast at 120 Hz. | Camera smoothing; hover scale; drag smoothing |
| Interpolation toolbox | clamp, smoothstep, remap (`MathUtils.mapLinear` in three.js), and easing curves (not in core); `Quaternion.slerp` for orientation. | "Linear easing looks natural." | UI transitions; focus animation; mapping drag distance to a value |

**Lens notes**

- Space: every drag goes screen → NDC → world ray → world hit point → the parent's space (`parent.worldToLocal`) to set `position`.
- OrbitControls calls its dolly "zoom" (`enableZoom`). With an orthographic camera it really does change `camera.zoom`, because moving closer changes nothing there.
- Cost: throttle pointermove raycasts to once per frame, raycast simplified proxies, and render only when something changed.

## 10. GPU Pipeline, Render Targets & Bottleneck Diagnosis

This domain owns the model of a frame and the proof of whether a scene is CPU- or GPU-bound. Every diagnosis drill ends with numbers, not a guess.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Tour: renderer settings | The WebGLRenderer options you set once: `antialias` and `powerPreference` in the constructor, then `setPixelRatio`, `setSize`, `outputColorSpace`, `toneMapping` with `toneMappingExposure`, and `shadowMap.enabled`. | "antialias can be turned on later." It's fixed when the renderer is created. "Turning on shadowMap.enabled makes shadows appear." The light and the casting meshes also need `castShadow`, and the surfaces shadows fall on need `receiveShadow`. | A product viewer's first setup; a phone-friendly configurator; a studio shot with a soft shadow |
| Pipeline stages | Buffers → vertex shader → clipping → rasterization → fragment shader → depth/stencil → blending → framebuffer. | "A fragment is a pixel." It's a candidate that may be discarded or overwritten. | Transparency order; vertex vs pixel cost; where discard happens |
| Draw call anatomy | Bind a program, set uniforms, bind buffers and textures, draw. | "Draw calls are expensive on the GPU." The overhead is mostly CPU and driver. | Many small parts; shadow passes doubling calls; multi-material meshes |
| State changes and sorting | With sortObjects on (the default), three.js sorts opaque objects by renderOrder, then material, then front to back, and transparent objects by renderOrder, then back to front. Objects with transmission get their own list, drawn between the two. renderOrder always beats distance. | "Render order is scene order." | Material count; renderOrder fixes; early-z benefit |
| Depth buffer and early-z | Depth testing rejects hidden fragments; discard and alphaTest can disable early rejection. | "Hidden objects cost nothing." | Overdraw; alpha-tested mesh panels; depth prepass |
| Stencil buffer | A per-pixel mask that later draws test against. Off by default in three.js: create the renderer with `{ stencil: true }`, then use the material's stencilWrite, stencilFunc, stencilRef, and stencilZPass. | "Outlines require post-processing." | Outlines; masks and portals; clipping caps |
| Blending and transparency | Order-dependent, and sorted per object (its bounding-sphere center), not per triangle. Engines usually turn off depth writes for transparent objects, but three.js leaves `depthWrite` on until you set it to false. | "Transparent objects sort per triangle." | Glass; fades; overlays |
| Render targets | Offscreen framebuffers with color and depth attachments. | "Rendering always goes to the screen." | Thumbnails; GPU picking; mirrors |
| Multi-pass and post-processing | Each full-screen pass costs full-resolution fragment work. Effects that need the whole frame need extra passes. An EffectComposer needs OutputPass at the end, or tone mapping and sRGB output are lost. | "Post effects are cheap filters." | Selection outline; bloom; FXAA |
| Multisampling | Several samples per pixel. Render targets need MSAA set explicitly. | "Adding a composer keeps canvas antialiasing." | Jaggies after adding post-processing; thin lines; MSAA memory cost |
| Readback | readPixels waits for the GPU to finish. readRenderTargetPixelsAsync waits without blocking the main thread. | "Reading one pixel is free." | GPU picking; screenshots; color sampling |
| Frame budget | 16.67 ms at 60 Hz. CPU and GPU overlap, so the slower side sets frame time. | "FPS shows headroom." Vsync caps it; measure frame time. | Setting targets; comparing devices; judging a fix |
| Measurement tools | performance.now around render measures CPU submission. GPU time needs timer queries where supported, or Chrome's GPU track. | "render() time equals GPU time." | Timing a frame; Spector.js capture; renderer.info counts |

**Proof experiments.** Change one thing, hold everything else fixed, and compare frame time.

| Experiment | Change | If frame time drops, you were |
| --- | --- | --- |
| Resolution | Lower DPR or canvas size | Fragment or fill-rate bound (GPU) |
| Shader swap | Replace materials with MeshBasicMaterial | Fragment-shading bound (GPU) |
| Draw calls | Merge or instance with the same pixel coverage | CPU submission bound |
| Vertex load | Swap in a low-poly proxy with the same coverage | Vertex bound (GPU, uncommon) |
| Skip render | Run updates but skip renderer.render | Bound by app logic outside rendering |

**Lens notes**

- Cost: this domain is the cost lens.
- Space: its clip-space and NDC concepts link back to Domain 4.
- New in r186: `new WebGLRenderer({ outputBufferType: HalfFloatType })` plus `renderer.setEffects([...])` runs post effects with tone mapping and color space applied for you, so no OutputPass. Its buffer is multisampled when `antialias` is on.
- Cost: renderer.info.render resets on every render() call. When a frame has several (a composer, extra passes), set `info.autoReset = false` and call `info.reset()` once per frame.

## 11. Materials, Lighting & Color

Appearance comes from material, light, and the color pipeline. Most "it looks wrong" bugs live in the color pipeline.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Tour: materials | MeshBasic, Lambert, Phong, Standard, Physical, Toon, Matcap, Normal, and Depth: which ones react to lights, and what each costs. | "Every material reacts to lights." Basic, Matcap, Normal, and Depth ignore them. | Unlit UI and labels; a physically based product finish; a quick debug view |
| Tour: lights | Ambient, Hemisphere, Directional, Point, Spot, and RectArea, and each one's setup quirks. | "RectAreaLight works on any material." It lights only Standard and Physical, needs `RectAreaLightUniformsLib.init()`, and casts no shadows. "Light intensities from old tutorials look the same today." | Studio lighting for a product; a softbox or window; a room lit from above |
| Color spaces | Lighting math runs in linear space. Color textures are sRGB; data textures (normal, roughness, metalness, AO) are linear. Mark color textures with `texture.colorSpace = SRGBColorSpace`: GLTFLoader does it, but a texture you load yourself starts with no color space. `renderer.outputColorSpace` (sRGB by default) converts the result for the screen. | "Every texture is sRGB." | Washed-out textures; wrong-looking normal maps; colors that don't match a picker |
| Tone mapping and exposure | Off by default (NoToneMapping). Maps HDR results into display range; exposure scales before mapping. | "Tone mapping leaves brand colors unchanged." ACES and AgX shift hue and saturation; NeutralToneMapping is built to keep product colors close to the source. | Blown highlights; matching product colors; bright environments |
| Diffuse (Lambert) | Brightness = max(N·L, 0). | "Diffuse depends on the viewer." | Side lighting; the terminator line; toon shading |
| Specular and half vector | H = normalize(L + V); the highlight comes from N·H. | "Highlights stay put when the camera moves." | Glossy vs matte; moving highlights; understanding roughness |
| PBR metal and roughness | Metals have no diffuse and tint their reflections; roughness spreads reflections out. | "Metalness 0.5 is a realistic semi-metal." | Bare steel vs powder coat vs rubber; chrome; brushed finishes |
| Light types and falloff | Directional, point, spot, hemisphere, ambient, and RectAreaLight for soft boxes (it needs `RectAreaLightUniformsLib.init()` first). Point and spot light falls off with distance squared. | "Scene units don't affect lighting." | Studio product lighting; models in millimeters vs meters; ambient flattening |
| Environment maps and IBL | An HDR environment (loaded with HDRLoader; RGBELoader is deprecated), prefiltered by PMREM, lights and reflects according to roughness. | "An environment map is just a background." It also lights the scene; metals look black without one. | Chrome reflections; a consistent product look; environment vs background |
| Shadows | A depth render from the light. Frustum size sets effective resolution; bias trades acne for detachment. A custom vertex effect needs its own `customDepthMaterial` (`customDistanceMaterial` for point lights), or its shadow won't match. | "A bigger shadow map fixes everything." | Contact shadow under a product; fitting a directional shadow; acne vs peter-panning |
| Baked lighting | Baked light and AO maps usually live on a second UV set. In three.js each texture's `channel` picks the set and defaults to 0, so set `channel = 1` and supply a `uv1` attribute (GLTFLoader does both when the file has a second set). Baked is cheap but static. | "Baked lighting reacts to moving objects." | Static rooms; AO in crevices; shadow-catcher planes |
| Texture sampling | Filtering, mipmaps, anisotropy, wrapping, repeat, and flipY. | "Mipmaps are only a performance feature." They also prevent shimmer. | Shimmer at grazing angles; tiled textures; crisp UI textures |
| Channel packing | glTF stores roughness in G and metalness in B; AO often shares the texture in R. | "Each map is its own texture." | Reading packed maps; building packed maps; wrong-roughness bugs |
| Pipeline-facing material flags | side, transparent, alphaTest, depthWrite, polygonOffset. | "DoubleSide is free." | Decals; perforated panels; thin surfaces |

**Lens notes**

- Cost: each light adds per-fragment work, and adding or removing lights recompiles shaders.
- Cost: each shadow-casting light adds a render pass; a point light adds six.
- Space: three.js built-in lighting runs in view space.

## 12. Shaders

Shader drills stay small: one visible effect, one concept, readable at a glance.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Vertex vs fragment | The vertex shader runs per vertex and outputs clip position; the fragment shader runs per fragment and outputs color. | "Fragment shaders run once per pixel." Overdraw runs them more. | Displacement; per-pixel color; comparing run counts |
| Attributes, uniforms, varyings | Per-vertex input, per-draw constant, and a value interpolated from vertex to fragment. | "Varyings are copied unchanged." They're interpolated across the triangle by default; `flat` turns that off. | Passing time; per-vertex color gradients; barycentric wireframe |
| Built-in matrices and spaces | position is local; modelMatrix goes to world; three.js normalMatrix produces view-space normals. | "normalMatrix gives world normals." | Height gradient in world space; view-space rim light; screen-space effects |
| Swizzling | Read, reorder, or repeat components with .xyzw, .rgba, or .stpq. | "A swizzle alone converts axis conventions." Z-up to Y-up also needs a sign flip. | Ground-plane distance with .xz; packed textures; axis conversion |
| Built-in functions | mix, step, smoothstep, clamp, fract, mod, dot, reflect. | "step and smoothstep are interchangeable." | Stripes; rings; falloff masks |
| Types and precision | No implicit int-to-float conversion; mediump on mobile loses range. | "1 and 1.0 are the same in GLSL." | Compile errors; banding on mobile; jitter far from the origin |
| Extending materials | ShaderMaterial gives full control; onBeforeCompile patches built-in materials. | "A custom shader must rebuild lighting from scratch." | Highlight on a standard material; injecting uniforms; dissolve effect |
| Derivatives | dFdx, dFdy, and fwidth measure change between neighboring pixels. | "Anti-aliased lines need extra geometry." | Anti-aliased grid; wireframe; flat normals without split vertices |
| Fragment coordinates | gl_FragCoord is in device pixels from the bottom-left. | "gl_FragCoord matches CSS pixels." It includes DPR. | Screen-space patterns; vignette; post-processing |
| Branching and discard | Uniform branches are cheap; discard disables early depth rejection. | "An if statement is free." | Alpha cutout; masks; conditional effects |
| Debug output | Output normals, UVs, depth, or position as color. | "Only the final color can be inspected." | Verifying spaces; finding UV seams; checking depth range |

**Lens notes**

- Cost: fragment cost × resolution × DPR² is often the whole GPU budget. Vertex work runs again in every shadow pass, using a depth material rather than your shader, so a custom vertex effect needs a matching `customDepthMaterial` (or `customDistanceMaterial` for point lights), or its shadow won't match.
- Space: every shader drill states the space of each variable it touches.

## 13. Debugging & Visualization

Debugging drills train one habit: make the invisible visible, then isolate before fixing.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Triage | Classify the symptom as transform, geometry, material, camera, or pipeline before changing code. | "A black screen means a broken shader." | Black screen; missing object; wrong color |
| Nothing-renders checklist | Added to the scene? In the frustum? Near/far? Units? Side? Lights? NaN? | "If it loaded, it's visible." | Invisible loaded model; invisible custom geometry; black post-processing output |
| Helpers | Axes, Arrow, Box3, Camera, Grid, Plane, and VertexNormals helpers. | "CameraHelper is only for cameras." It also shows shadow frustums. | Checking orientation; shadow frustum; bounds |
| Visualizing vectors | Draw directions with ArrowHelper at the right origin and under the right parent. | "A helper shows the value no matter where it's parented." | Normal direction; ray direction; velocity |
| Reading matrices | elements is column-major; indices 12–14 hold translation; the determinant's sign shows mirroring. | "Matrix4.set and elements share an order." set takes row-major. | Console transform checks; spotting scale; detecting mirroring |
| NaN and degenerate cases | Zero-length normalize (three.js returns a zero vector; GLSL's result is undefined), parallel lookAt (nudged, with an arbitrary roll), zero scale (its inverse is all zeros, so raycasts miss), parallel ray–plane (null). None of these throw; your own math, like acos past 1, makes NaN. | "NaN would throw an error." It spreads silently. | Vanishing objects; exploded geometry; failed raycasts |
| Isolation | Toggle visibility or layers, override materials, bisect the scene, build a minimal repro. | "Read the code until you see it." | Z-fighting source; performance hotspot; bad material |
| Frame capture | Spector.js shows draw calls, state, bound textures, and shader source. | "The scene graph shows what the GPU drew." | Double rendering; wrong texture bound; render target contents |
| Shader errors | Read compile logs against three.js's injected code and line numbers. | "The line number points at my code." | onBeforeCompile mistakes; typos; precision errors |
| Debug views | Wireframe, MeshNormalMaterial (view-space normals, so colors shift as you orbit), depth material, and a UV checker texture. | "Bad normals only look like bad lighting." | Normal problems; UV stretching; depth issues |

**Lens notes**

- Space: helper placement is a space decision. A helper under the wrong parent shows a right value in the wrong place.
- Cost: remove helpers and debug materials before taking performance measurements.

## 14. Optimization & Memory

This domain owns the fixes. Every drill starts from a bottleneck proved with a Domain 10 experiment and ends with a before/after number.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Draw call reduction | Merge static geometry, instance repeats, batch different geometries that share a material with BatchedMesh, atlas textures, and share materials. | "Instancing fixes a fill-rate-bound scene." | Repeated hardware; static environment; many same-material parts |
| Resolution and DPR | Cap DPR, and lower it adaptively or during interaction. | "DPR is a display setting, not a cost." | Phones; 4K monitors; reduced DPR while orbiting |
| Render on demand | Render only when something changes. | "Continuous rendering is required." | Static viewer; battery life; background tabs |
| Allocation hygiene | Reuse scratch objects in per-frame code. | "GC pauses are too small to notice." | Raycast loops; per-frame updates; bounds checks |
| Culling and LOD | Frustum culling per object with correct bounds; lower detail at distance. | "Culling happens per triangle." | Large scenes; many parts; instanced bounds |
| Overdraw reduction | Fewer large transparent layers; alphaTest instead of blending where possible. | "Hidden pixels cost nothing." | Glass layers; full-screen overlays; cutout panels |
| Shader and material cost | Cheaper materials, fewer lights, smaller shadow maps, selective shadows. | "MeshPhysicalMaterial always costs much more than MeshStandardMaterial." With clearcoat, sheen, and transmission at 0 it's close; each feature turned on adds shader work, and transmission adds a full extra render of the opaque scene. | Mobile fallback; many lights; shadow cost |
| Texture budget | Size to on-screen need; compress, share, and mipmap. | "4K textures are always sharper." | Swatch libraries; mobile limits; thumbnail textures |
| Hitch avoidance | Pre-compile (`renderer.compileAsync`), pre-upload (`renderer.initTexture`), spread work across frames, and decode in workers. | "Load time is the only delay." | First-click hitch; variant-switch hitch; route transitions |
| Leak detection | Watch renderer.info.memory and heap snapshots across repeated load/unload cycles. | "Counts that grow slowly are fine." | SPA route changes; variant cycling; long sessions |
| Adaptive quality | Adjust DPR, shadows, or post effects from measured frame time, with hysteresis. | "Detect the device tier once and set quality." | Low-end devices; heavy scenes; thermal throttling |

**Lens notes**

- Cost: this whole domain is the cost lens. Each fix drill records the proof experiment, the change, and the before/after frame time or memory.

## 15. Procedural & VFX (elective)

This optional domain covers real-time VFX and procedural masks. It builds on Domains 1, 10, 11, and 12, and transfers directly to Unreal's material editor and Niagara.

- **Language:** TSL (`three/tsl` with `WebGPURenderer` from `three/webgpu`, which falls back to WebGL 2 where WebGPU is missing). Its node graphs map closely to Unreal's material nodes. Domain 12 teaches shaders in GLSL, and TSL keeps GLSL's function names (mix, fract, smoothstep, dFdx), so the ideas carry over.
- **Format:** no four-loop pass. It comes after core Loop 2, as coding exercises that end with building each effect from memory into an existing scene. Tiers don't apply here. The page and exercise design is still being settled.

| Concept | Core idea | Misconceptions to expose | Use contexts to rotate |
| --- | --- | --- | --- |
| Signed distance fields | Distance to a shape, negative inside. Combine shapes with min and max; smoothstep turns distance into a soft mask. | "Masks must be painted textures." | Circle and ring masks; rounded-rectangle glow; dissolve edges |
| Value and gradient noise | Perlin or simplex noise gives a smooth pseudo-random field from coordinates. | "Noise changes every frame." It's deterministic for the same input. | Cloud masks; heat shimmer; organic breakup |
| Cellular noise | Worley noise is the distance to the nearest random feature point. | "Cellular patterns need a texture." | Cracks; caustics; scales |
| fBm | Sum octaves at rising frequency and falling amplitude. | "More octaves always look better." Octaves finer than a pixel alias. | Smoke; terrain masks; eroded edges |
| Domain warping and curl noise | Offset input coordinates by noise; curl noise gives swirling flow without sinks. | "Curl noise is just more noise." It's the curl of a noise field. | Swirling smoke; flowing energy; particle advection |
| Mask remapping and compositing | Remap, contrast, multiply, screen, max, and threshold erosion. | "Multiplying masks is always the right combine." | Dissolve; layered magic effects; stylized fire |
| UV animation | Panning, rotation, polar coordinates, and flow maps. | "Scrolling by raw time runs forever." Large time values lose precision; wrap time. | Scrolling energy; vortex; flowing water |
| Flipbooks | Map a frame index to a UV offset in a grid, optionally blending frames. | "Frame 0 is always the top-left cell." It depends on the UV origin. | Explosion sprites; smoke puffs; animated icons |
| Particle fundamentals | Spawn rate, lifetime, normalized age, and attributes over life. | "Spawn rate is per frame." It's per second. | Sparks; dust; UI bursts |
| Integration and forces | Semi-implicit Euler step: v += a·dt, then p += v·dt using the new v, with drag. Explicit Euler moves by the old v and is less stable. | "Update order doesn't matter." | Gravity sparks; wind; orbiting motes |
| Sprite facing | Camera-facing, velocity-aligned, or axis-locked billboards. | "Facing the camera plane equals facing the camera position." They differ at screen edges. | Smoke; motion streaks; ground-aligned rings |
| Depth-based effects | Soft particles fade by comparing against scene depth; distortion samples scene color. | "Soft particles are a texture setting." | Smoke meeting the ground; heat haze; water edges |
| Additive vs alpha blending | Additive is order-independent once depth writes are off (`depthWrite: false`; three.js leaves them on), and never darkens; alpha needs sorting. | "Additive is free." It still overdraws. | Fire vs smoke; glows; stacked sparks |

**Lens notes**

- Cost: translucent overdraw is the main VFX budget. Measure it with the Domain 10 resolution test, or Unreal's quad overdraw view.
- Cost: procedural noise spends shader math per pixel. Baking it to a texture trades that math for memory.
- Transfer: Unreal material nodes map directly (Lerp, Frac, ComponentMask, DDX/DDY, Noise, SphereMask). HLSL renames mix, fract, and dFdx/dFdy to lerp, frac, and ddx/ddy, and adds saturate. GLSL mod and HLSL fmod differ for negative numbers.

## 16. Blank-file scenes (elective)

A working scene from an empty file, after Loop 4. Setting up a project from scratch is rare and people use the docs when they do, so this elective comes last, as a from-memory refresher. Each piece's exact syntax is taught earlier, on the pages in the "Blank-file drills go last" table. Tiers don't apply here, and its drill format is decided when it's built.

| Concept | What you write | Taught earlier on |
| --- | --- | --- |
| Renderer and canvas | `new WebGLRenderer({ antialias: true })`, `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, adding the canvas to the page | Domain 10 Tour: renderer settings; Domain 14 Resolution and DPR |
| Scene, camera, and a first mesh | A Scene, `new PerspectiveCamera(fov, aspect, near, far)`, a mesh, and a light for lit materials | Domain 4 Projection matrix; Domain 11 Tour: lights |
| Frame loop | `renderer.setAnimationLoop(...)` with `THREE.Timer` for the time since the last frame | Domain 9 Frame-rate-independent motion |
| Resize | `renderer.setSize(w, h, false)`, `camera.aspect = w / h`, `camera.updateProjectionMatrix()` | Domain 4 Aspect and resize |
| Load and frame a model | GLTFLoader, then `Box3.setFromObject` and `getBoundingSphere` to place the camera | Domain 6 Tour: loaders and textures; Domain 4 Fit to bounds |
| Disposal and teardown | `geometry.dispose()`, `material.dispose()`, `texture.dispose()`, `renderer.setAnimationLoop(null)`, `renderer.dispose()` | Domain 6 Disposal ownership |

## Cross-domain drills

These combine concepts from several domains in one drill. Tag each with every domain it touches, and count it toward coverage in each.

| Drill | Domains | What it proves |
| --- | --- | --- |
| Drag a part across the floor with a grab offset | 1, 8, 9 | Ray–plane plus offset math |
| Slide a part along a rotated rail | 1, 2, 9 | Projection onto a local axis converted to world |
| Place a marker flush on a clicked surface | 2, 5, 8 | face.normal from local to world with a world normal matrix (`getNormalMatrix(matrixWorld)`), not the view-space `object.normalMatrix` |
| GPU picking vs raycasting on a million-triangle model | 8, 10, 14 | CPU vs GPU cost and the readback stall (readRenderTargetPixelsAsync avoids blocking) |
| Raycast cost: deep hierarchy vs high triangle count | 7, 8, 10 | Which dimension dominates, measured |
| Constant-size labels that hide when occluded | 4, 8, 9 | Projection, world size per pixel, and occlusion rays |
| Focus on a clicked part with damped motion | 4, 7, 9 | Bounds fit plus frame-rate-independent damping |
| Mirrored variant renders inside-out after baking | 2, 5, 11 | Determinant sign and winding |
| Chrome finish looks black on mobile | 6, 11, 13 | Environment maps, texture formats, and triage |
| Roughness looks wrong on a packed map | 6, 11, 12 | Channel packing, color space, and a swizzle debug view |
| Frame drops only on phones | 10, 14 | DPR² proof and adaptive DPR |
| Hitch on the first variant switch | 6, 10, 14 | Upload and compile cost, and warm-up |
| Selection outline: stencil vs post pass | 10, 11, 12 | Multi-pass cost trade-off |
| Verify a transform bug with normals as color | 2, 12, 13 | Space checks through shader output (MeshNormalMaterial is view space; world normals need a small shader) |
| Memory climbs after 20 variant swaps | 6, 7, 14 | Disposal ownership and leak detection |

## Coverage checks

The generated repo is complete when every check below passes. COVERAGE.md is generated from drill frontmatter, never written by hand.

- [ ] Every core concept has at least one drill in each of the four modes.
- [ ] Every light concept has read-the-code, apply, and break-and-fix coverage.
- [ ] Every listed misconception has at least one drill that exposes it, through a read-the-code question, a failing check, or a visible symptom.
- [ ] Every core concept's drills span at least three distinct use contexts; every light concept's span at least two.
- [ ] No two consecutive drills in a domain share a use context.
- [ ] Drills with a space lens state input and output spaces; drills with a cost lens include a measurement step.
- [ ] Every drill stays small and covers one idea; bigger ones are split.
- [ ] Every domain has a placement check in Loops 2–4, and every loop has a checkpoint.
- [ ] A code drill's starter fails its acceptance check until the drill is solved.
- [ ] Solutions live only in /solutions.
- [ ] Every drill uses APIs valid for the pinned three.js version.
- [ ] COVERAGE.md shows concept × mode, concept × context, misconception → drill, and progress per loop.
