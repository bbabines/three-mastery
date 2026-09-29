# Inventory slice B: Domains 5–9 checked against three r186

Slice: `docs/concept-inventory.md` lines 228–345. Installed: `three@0.186.0` (`THREE.REVISION` prints `186`).
Source paths below are relative to `node_modules/three/`.

Scripts (all in `docs/r186-check/evidence/`):
- `B-d5.mjs`: Domain 5 (attributes, interleaving, normals, UV channels, bounds, updates, groups, instancing). Run: `cd <repo> && node <path>/B-d5.mjs`
- `B-d7d8d9.mjs`: traversal, Box3, clone, raycast anatomy and filtering, Ray/Plane/Sphere/Triangle/Box/Frustum, damp, project, Cache, memory math. Run: `node <path>/B-d7d8d9.mjs`
- `B-gltf.mjs`: GLTFLoader.parse on a hand-built glTF (names, multi-primitive, extras, repeat loads). Run: `cd <repo> && node --input-type=module < <path>/B-gltf.mjs`
- `B-extra.mjs`: TransformControls helper vs raycast, InstancedMesh stale bounds, shared-edge double hits. Same run command as B-gltf.

---

## Findings

Each item gives the location, the claim, the verdict, the evidence, and suggested wording.

### F1. UVs: the second UV set is opt-in in r186 (docs/concept-inventory.md:240)
- **Claim:** "A second UV set feeds light and AO maps."
- **Verdict:** OUTDATED
- **Evidence:** before r151, `aoMap` and `lightMap` were hard-wired to `uv2`. In r186 every map reads the UV set named by `texture.channel`, and that defaults to 0 (`src/textures/Texture.js:118`). The shader picks the UV set from `material.aoMap.channel` and `material.lightMap.channel` (`src/renderers/webgl/WebGLPrograms.js:275-276`). glTF `TEXCOORD_1` becomes an attribute named `uv1`, not `uv2` (`examples/jsm/loaders/GLTFLoader.js:2282`). GLTFLoader sets `texture.channel` from `texCoord` (`GLTFLoader.js:3448-3451`). Script `B-d5.mjs` prints `Texture.channel default 0` and `aoMap.channel, lightMap.channel [0,0]`.
- **Suggested wording:** "2D texture coordinates, usually 0 to 1. A mesh can carry a second UV set (`uv1`), often used for light maps and AO maps. In three.js a map only uses it if you set `texture.channel = 1`. glTF files set this for you."

### F2. Bounding box: which edits make it stale (docs/concept-inventory.md:241)
- **Claim:** "Computed in local space and stored on the geometry; stale after edits."
- **Verdict:** IMPRECISE
- **Evidence:** `boundingBox` is `null` until something computes it (`src/core/BufferGeometry.js:172`). Raycasting, frustum culling, and `Box3.setFromObject` compute it only when it is still `null` (`src/objects/Mesh.js:248`, `src/math/Frustum.js:146-160`, `src/math/Box3.js:303+`). After that they reuse whatever is stored.
  - `translate`, `rotateX`, `scale`, and `applyMatrix4` recompute bounds that already exist (`BufferGeometry.js:412-418`). Only direct attribute edits leave them stale. `B-d7d8d9.mjs` prints `BufferGeometry.translate resets bounds? sphere center [20,0,0]`.
  - A manual vertex edit followed by a raycast returns `hit count 0` until `computeBoundingSphere()` runs, then `2`.
  - Frustum culling uses the bounding sphere, not the box.
  - `InstancedMesh`, `BatchedMesh`, and `SkinnedMesh` keep their own object-level bounds. For `InstancedMesh` they go stale after `setMatrixAt` (`B-extra.mjs`: `stale bounds -> hits at x=30: 0`, then `2` after `im.computeBoundingSphere()`).
- **Suggested wording:** "Computed in the geometry's own local space and stored on the geometry. It stays `null` until something computes it. The geometry's transform methods (`translate`, `scale`, `applyMatrix4`) recompute it. Editing attribute arrays directly does not, so call `computeBoundingBox()` and `computeBoundingSphere()` yourself. Culling and raycasting read the sphere. InstancedMesh keeps its own bounds, which go stale when instances move."

### F3. Groups: when they apply and what their ranges count (docs/concept-inventory.md:243)
- **Claim:** "Groups map index ranges to material slots; each group is a draw call." The use contexts include "raycast materialIndex".
- **Verdict:** IMPRECISE
- **Evidence:**
  - The renderer uses groups only when `mesh.material` is an array (`src/renderers/WebGLRenderer.js:1941-1958`). With a single material, groups are ignored and the mesh is one draw.
  - A group whose material slot is missing or has `visible === false` is skipped (`WebGLRenderer.js:1948`).
  - On non-indexed geometry, `start` and `count` are vertex ranges. `B-d5.mjs` shows that `toNonIndexed` keeps the groups as vertex ranges.
  - `face.materialIndex` is filled in only for material arrays (`src/objects/Mesh.js:324,382`). With one material it is always 0 (`B-d5.mjs`: `single material: materialIndex reported 0`; material array: `4`).
- **Suggested wording:** "Groups map index ranges (vertex ranges when the geometry has no index) to slots in a material array. With a material array, each group is its own draw call. With a single material, groups are ignored."

### F4. Domain 5 cost lens: draw calls come from meshes, not materials (docs/concept-inventory.md:251)
- **Claim:** "each group or material adds a draw call."
- **Verdict:** IMPRECISE
- **Evidence:** `projectObject` pushes one render item per visible mesh, or one per group when the mesh has a material array (`src/renderers/WebGLRenderer.js:1860-1958`). Sharing a material does not merge draws. "Each material adds a draw call" hints at the very misconception that line 286 exposes ("100 meshes sharing a material is one draw call").
- **Suggested wording:** "Cost: vertex count drives vertex-stage cost. Every mesh is at least one draw call, and each group of a multi-material mesh adds one more. Sharing a material doesn't merge draw calls."

### F5. Domain 5 memory lens: index size (docs/concept-inventory.md:252)
- **Claim:** "indices cost 2 or 4 bytes each."
- **Verdict:** IMPRECISE (minor)
- **Evidence:** three.js `setIndex` picks `Uint16` or `Uint32` automatically (`src/core/BufferGeometry.js:234`, `src/utils.js:61`). The glTF spec also allows uint8 indices ("any of the uint8, uint16, or uint32 effective component types", from the Khronos glTF 2.0 spec). WebGL uploads them as `UNSIGNED_BYTE` (`src/renderers/webgl/WebGLAttributes.js:56-58`). The 32 bytes per vertex figure checks out (`B-d5.mjs`: `32`), but only for float32. Quantized glTF data (KHR_mesh_quantization) is smaller; see F7.
- **Suggested wording:** "Memory: position, normal, and UV as float32 cost 32 bytes per vertex. Indices cost 2 bytes (Uint16) or 4 bytes (Uint32) each, and a loaded glTF can also use 1-byte indices. Quantized models use less."

### F6. compileAsync only pre-warms shaders (docs/concept-inventory.md:262)
- **Claim:** "GPU upload happens on first render; shader programs compile on first use." The use contexts include "pre-warming with compileAsync".
- **Verdict:** IMPRECISE (the core idea is right; the use context overpromises)
- **Evidence:** `renderer.compile` and `renderer.compileAsync` only prepare material programs (`src/renderers/WebGLRenderer.js:1396-1499, 1515-1570`). They upload no textures and no geometry. Texture upload can be forced early with `renderer.initTexture(texture)` (`WebGLRenderer.js:3595`). A program is built for the lights, fog, and environment present at compile time, and the docs say the "scene's lighting and environment must be configured before calling this method" (`WebGLRenderer.js:1387`). `compileAsync` avoids a blocking wait only when `KHR_parallel_shader_compile` is available (`WebGLRenderer.js:1555`).
- **Suggested wording:** add "compileAsync pre-warms shaders only. Use renderer.initTexture for textures. Set up lights and environment first, or the shaders compile again."

### F7. Draco vs Meshopt: quantized data stays smaller on the GPU (docs/concept-inventory.md:263)
- **Claim:** "Compressed geometry uses less GPU memory. Both decode to full buffers." The core idea says "Draco gives the smallest download with a heavier decode. Meshopt decodes fast and pairs with gzip or brotli."
- **Verdict:** IMPRECISE
- **Evidence:**
  - The EXT_meshopt_compression spec says it "cleanly interacts with KHR_mesh_quantization by compressing already quantized data", and the decoded data keeps the accessor's component type.
  - KHR_mesh_quantization stores attributes as 8-bit or 16-bit integers. The spec's example drops a vertex from 48 bytes to 20 bytes, and the data stays in those smaller types on the GPU.
  - gltfpack, the meshopt tool, quantizes by default unless run with `-noq` (meshoptimizer.org/gltf).
  - GLTFLoader supports KHR_mesh_quantization (`examples/jsm/loaders/GLTFLoader.js:97,645`). DRACOLoader also decodes into the accessor's typed-array type (`examples/jsm/loaders/DRACOLoader.js:88-91,325`).
  - So the compression layer is fully undone on decode, but a typical meshopt/gltfpack asset really does use less GPU memory, because of the quantization.
  - "Smallest download" for Draco holds on raw bytes. Once gzip or brotli is applied the gap narrows and can even flip (third-party comparisons; the meshopt spec itself says its output is built to compress further with general-purpose compressors). That is a rule of thumb, not a guarantee.
- **Suggested wording:** "Draco usually gives the smallest raw download, with a slower decode that runs in a worker. Meshopt decodes very fast and is built to be gzipped or brotli'd, which closes most of the size gap." Misconception: "'Compressed geometry uses less GPU memory.' Compression is undone at decode. Only quantization (KHR_mesh_quantization, which gltfpack applies by default) keeps smaller numbers on the GPU."

### F8. KTX2 falls back to uncompressed when the device can't read the formats (docs/concept-inventory.md:264)
- **Claim:** "Transcode to GPU-native formats that stay compressed in VRAM."
- **Verdict:** IMPRECISE (true when the device supports a compressed target)
- **Evidence:**
  - The Khronos KTX artist guide says "KTX stays compressed when in memory". Its Duck example goes from 1.5 MB of GPU memory as PNG to 277 KB as KTX.
  - KTX2Loader chooses a target from ASTC, BC7, DXT, ETC2, ETC1, and PVRTC. If none is supported, it falls back to uncompressed `RGBA32` (`examples/jsm/loaders/KTX2Loader.js:793-880`, the "Uncompressed fallbacks" entry at `:862-870`).
  - It also throws unless `detectSupport(renderer)` was called first (`KTX2Loader.js:379,411`).
- **Suggested wording:** "Transcode at load time to a compressed format the GPU reads directly (ASTC, BC7, ETC), so the texture stays compressed in VRAM. If the device supports none of these, KTX2Loader falls back to raw RGBA, and the saving disappears."

### F9. GLTFLoader renames nodes (docs/concept-inventory.md:283)
- **Claim:** "Names are unique." (misconception) "glTF doesn't guarantee it."
- **Verdict:** IMPRECISE (the glTF half is right; the three.js result is different and a common trap)
- **Evidence:**
  - The glTF spec says names "are not guaranteed to be unique".
  - GLTFLoader passes every node, mesh, camera, and scene name through `createUniqueName` (`examples/jsm/loaders/GLTFLoader.js:3757-3773`). That function sanitizes the name with `PropertyBinding.sanitizeNodeName`, which turns spaces into `_` and strips `[ ] . : /` (`src/animation/PropertyBinding.js:185-187, 3-4`). Duplicates within one load get `_1`, `_2`, and so on. The original node name is kept in `userData.name` (`GLTFLoader.js:4424-4425`).
  - `B-gltf.mjs`: two nodes named `Rack.001` become `Rack001` and `Rack001_1`, and `Shelf Top` becomes `Shelf_Top`. `getObjectByName("Rack.001")` returns `undefined`, and `userData.name` is `Rack.001`.
  - Loading the file a second time repeats the same names (`Rack001`, `Rack001_1`), so two copies in one scene do collide.
- **Suggested wording:** Misconception "'Names are unique' and 'the name in Blender is the name in three.js'. GLTFLoader cleans names (spaces become `_`, dots and slashes are removed) and adds `_1`, `_2` to repeats within one file, keeping the original in `userData.name`. Two loaded copies of the same model still share names."

### F10. setFromObject defaults to a loose box (docs/concept-inventory.md:285)
- **Claim:** "Box3.setFromObject returns a world AABB, which grows under rotation."
- **Verdict:** IMPRECISE
- **Evidence:**
  - With the default `precise = false`, it transforms the eight corners of each geometry's cached local box into world space (`src/math/Box3.js:303-370`). The result is looser than the true world AABB. `B-d7d8d9.mjs`: a sphere of radius 1 rotated 45° gives `max.x 1.4142` by default and `1` with `setFromObject(obj, true)`.
  - It reuses a stale cached `geometry.boundingBox` (`B-d5.mjs`: `[99,150]` came from the cached box).
  - It calls `updateWorldMatrix(false, false)` (`Box3.js:308`), so it does not pick up a parent that moved and hasn't been updated yet. `B-d7d8d9.mjs`: `setFromObject(child)` after moving the parent without an update gives `min.x -0.5`; from the parent it gives `9.5`.
  - It includes invisible children and helpers (`B-d7d8d9.mjs`: `max.x 50.5` from a hidden child).
- **Suggested wording:** "Box3.setFromObject returns a world-space AABB of the object and all its children, including hidden ones and helpers. By default it boxes each child's local box, so it's loose, and looser still under rotation. Pass `true` as the second argument for a tight fit from the vertices. Update parent matrices first."

### F11. Layers belong to each object, not its subtree (docs/concept-inventory.md:287, 306)
- **Claim:** at 287, "visible = false skips rendering; layers filter per camera and per raycaster." At 306, "The recursive flag, layers, and target lists limit what gets tested."
- **Verdict:** IMPRECISE
- **Evidence:**
  - `visible = false` skips the object and everything under it for rendering (`src/renderers/WebGLRenderer.js:1862`).
  - Layers are tested on each object alone. The renderer still walks the children of an object that fails the layer test (`WebGLRenderer.js:1864`), and the raycaster does the same (`src/core/Raycaster.js:244-262`).
  - `B-d7d8d9.mjs`: with the parent on layer 1 and a raycaster on layer 0, the child is still hit (`hits ["child","child"]`).
  - Raycasting ignores `visible` entirely, including `material.visible = false` (`visible=false mesh hit count 2`, `material.visible=false mesh hit count 2`). That confirms "They can."
- **Suggested wording:** "visible = false hides an object and its whole subtree from rendering, but not from raycasts. Layers filter per camera and per raycaster, but only the object itself. Children keep their own layers, so put every object in a subtree on the layer, for example with traverse."

### F12. Traversal space lens: position is in the parent's space (docs/concept-inventory.md:295)
- **Claim:** "positions and bounds gathered during traversal are local unless converted."
- **Verdict:** IMPRECISE
- **Evidence:** `object.position`, `quaternion`, and `scale` are relative to the parent. They make up `object.matrix`, and `matrixWorld` is `parent.matrixWorld × matrix` (`src/core/Object3D.js:1225-1269`). `geometry.boundingBox` and the vertex positions are in the object's own space. `Box3.setFromObject` and `getWorldPosition` already return world space. "Local" hides the difference between the parent's space and the object's own space, which is exactly what Domain 2 teaches.
- **Suggested wording:** "Space: `object.position` is in the parent's space, and geometry data and `geometry.boundingBox` are in the object's own space. Only `getWorldPosition`, `Box3.setFromObject`, and similar methods give world space."

### F13. Ray–plane: two more cases (docs/concept-inventory.md:307)
- **Claim:** "Solve for t using the plane normal; parallel rays never hit."
- **Verdict:** IMPRECISE
- **Evidence:** `Ray.distanceToPlane` returns `0` for a ray lying in the plane (`src/math/Ray.js:364-371`) and `null` when `t < 0`, meaning the plane is behind the ray (`Ray.js:379-383`). `B-d7d8d9.mjs`: parallel ray above the plane gives `null`; parallel ray in the plane gives a hit at `[0,0,0]`; ray pointing away gives `null`.
- **Suggested wording:** "Solve for t using the plane normal. It's a miss if the ray runs parallel to the plane or if the plane is behind the ray (t < 0). A ray lying in the plane counts as a hit at its origin in three.js."

### F14. Ray–triangle: three.js uses a different algorithm (docs/concept-inventory.md:309)
- **Claim:** "Möller–Trumbore returns t and barycentric coordinates."
- **Verdict:** IMPRECISE (right about Möller–Trumbore itself, wrong as a description of three.js)
- **Evidence:**
  - r186 `Ray.intersectTriangle` is the Woop–Benthin–Wald watertight test, not Möller–Trumbore ("Watertight ray/triangle intersection", `src/math/Ray.js:538-542`). It returns only the hit point (`B-d7d8d9.mjs`: `Vector3 [0.2,0.2,0]`).
  - `Mesh.raycast` computes barycentrics separately with `Triangle.getBarycoord` (`src/objects/Mesh.js:462-463`) and exposes them as `intersection.barycoord` (`Mesh.js:500`). The same script prints barycoord `[0.6,0.2,0.2]`.
  - Side effect: a ray through an edge shared by two triangles reports both of them (`B-extra.mjs`: `hits 2 faceIndex [0,1]`).
- **Suggested wording:** "Ray–triangle tests return t and barycentric coordinates; Möller–Trumbore is the classic method. three.js r186 uses a watertight variant and returns only the point. It adds `intersection.barycoord` for you."

### F15. Raycast cost lens: the inverse matrix is paid only after the sphere test passes (docs/concept-inventory.md:319)
- **Claim:** "each object costs a bounding sphere test and a matrix inverse, then per-triangle tests."
- **Verdict:** IMPRECISE (minor)
- **Evidence:** the world-space sphere test comes first. Only objects that pass it pay for the matrix inverse, then a local box test if `geometry.boundingBox` has been computed, then triangles (`src/objects/Mesh.js:248-280`). The layer test runs before any of this (`src/core/Raycaster.js:244`). Groups and other non-renderable objects cost only the walk through them.
- **Suggested wording:** "Cost: each mesh costs a bounding-sphere test. Only meshes whose sphere is hit pay for a matrix inverse, then triangle tests. Deep hierarchies multiply the first cost; high-poly meshes multiply the second."

### F16. Pointer coordinates are relative to the viewport (docs/concept-inventory.md:329)
- **Claim:** "Pointer events unify mouse, touch, and pen, in CSS pixels relative to the canvas."
- **Verdict:** IMPRECISE
- **Evidence:** MDN says `clientX` is "within the application's viewport", in CSS pixels, not relative to the canvas. `offsetX` is relative to the target's padding edge, and it breaks with borders, padding, or CSS transforms. That's why line 304 correctly subtracts the canvas rect. "Unify mouse, touch, and pen" matches MDN's Pointer events page.
- **Suggested wording:** "Pointer events unify mouse, touch, and pen. Their clientX and clientY are CSS pixels relative to the viewport. Subtract `canvas.getBoundingClientRect()` to get canvas-relative pixels."

### F17. In OrbitControls, "dolly" and "zoom" share names (docs/concept-inventory.md:332)
- **Claim:** "dolly moves along the view direction." Misconception "Dolly and zoom are the same."
- **Verdict:** IMPRECISE (right in principle; OrbitControls muddies it)
- **Evidence:**
  - OrbitControls calls the action "dolly" internally but exposes it as `enableZoom` and `zoomSpeed` (`examples/jsm/controls/OrbitControls.js:227,1028-1055`).
  - With a PerspectiveCamera it changes the orbit radius, which is a true dolly (`OrbitControls.js:820-829`).
  - With an OrthographicCamera it changes `camera.zoom` (`OrbitControls.js:831-843`), so there it really is a zoom.
  - Pan follows the view plane because `screenSpacePanning` defaults to `true` (`OrbitControls.js:289`).
- **Suggested wording:** add "OrbitControls calls its dolly 'zoom' (`enableZoom`). With an orthographic camera it really does change `camera.zoom`, because moving closer changes nothing in orthographic."

### F18. CSS2DRenderer hides labels behind the camera, not occluded ones (docs/concept-inventory.md:338)
- **Claim:** "Project to screen for HTML labels; hide them behind the camera or when occluded." Misconception "Projected labels hide themselves."
- **Verdict:** IMPRECISE
- **Evidence:**
  - With plain `Vector3.project`, nothing hides. A point behind the camera comes back with `z > 1` and x and y mirrored (`B-d7d8d9.mjs`: `[-0.2145,-0.2145,1.042]` against `[0.2145,0.2145,0.962]` in front). The mirroring puts the label on the wrong side of the screen.
  - `CSS2DRenderer` does hide labels whose projected z falls outside [-1, 1], which covers behind the camera and past the far plane. It also hides labels on other layers (`examples/jsm/renderers/CSS2DRenderer.js:240-243`).
  - Neither method checks occlusion.
- **Suggested wording:** Misconception "'Projected labels hide themselves.' `Vector3.project` doesn't: behind the camera, z goes above 1 and x and y flip. CSS2DRenderer hides labels behind the camera, but nothing hides labels behind other objects. You need a raycast or depth test for that."

### F19. The interpolation toolbox under three.js names (docs/concept-inventory.md:340)
- **Claim:** "clamp, smoothstep, remap, and easing; slerp for orientation."
- **Verdict:** IMPRECISE (minor, names)
- **Evidence:**
  - `MathUtils.remap` doesn't exist. The three.js name is `MathUtils.mapLinear` (`src/math/MathUtils.js:76`). `B-d7d8d9.mjs`: `MathUtils.remap exists? undefined`.
  - `clamp`, `smoothstep`, `smootherstep`, `lerp`, `inverseLerp`, and `damp` all exist.
  - Core has no easing curves; `examples/jsm/libs/tween.module.js` has them.
  - For slerp, use `Quaternion.slerp` or `slerpQuaternions`.
- **Suggested wording:** "clamp, smoothstep, remap (`MathUtils.mapLinear` in three.js), and easing curves (not in core); `Quaternion.slerp` for orientation."

### F20. Drag space lens: the last step is the parent's space (docs/concept-inventory.md:344)
- **Claim:** "every drag goes screen → NDC → world ray → object local space."
- **Verdict:** IMPRECISE
- **Evidence:** to move an object you write `object.position`, which is in the parent's space (see F12). The last step is `object.parent.worldToLocal(point)` (`src/core/Object3D.js:1225-1269`). Converting into the object's own local space would include the object's own rotation and scale, and the drag would come out wrong.
- **Suggested wording:** "Space: every drag goes screen → NDC → world ray → world hit point → the parent's space (`parent.worldToLocal`) to set `position`."

### F21. Rule-of-thumb items to label as such (no rewrite needed)
- Line 230 ("A mesh is typed arrays plus rules"), 256 ("four separate costs … File size predicts only the first"), 268 (preload vs lazy), 272 (download/decode/upload/compile cost lens), 289 (override/restore), 294 (traversal O(n)), 314 (BVH), 320 (performance.now), 321 (GPU picking), 331, 333, 334, 337, 345. Details are in the ledger. Two need a note:
  - 314: a BVH isn't part of three.js. It's the third-party `three-mesh-bvh`, which isn't installed in this repo. Its README confirms `refit` after vertex edits and a build cost (which can run in a worker). O(log n) is typical, not guaranteed.
  - 320: `performance.now` is coarsened in browsers that aren't cross-origin isolated, so time many repetitions of fast raycasts.

## Notes (claims marked OK that a drill could tighten)
- 237 Winding: three.js flips the front face automatically for objects whose world matrix has a negative determinant (`src/renderers/WebGLRenderer.js:1200`, `src/renderers/webgl/WebGLState.js:761`). Mirroring with `scale.x = -1` still renders right side out. Only mirroring baked into the vertex data turns a mesh inside out.
- 239 Vertex normals: `computeVertexNormals` sums the raw cross products, so the average is weighted by area (`BufferGeometry.js:1005-1090`; `B-d5.mjs` gives `[0.0001,0,1]`, not `[0.707,0,0.707]`). On non-indexed geometry it produces flat normals.
- 244 InstancedMesh: accepts a material array (groups). Its `boundingSphere` is computed lazily and goes stale after `setMatrixAt` (`B-extra.mjs`).
- 245 Normal maps: Substance Painter exports DirectX (−Y) by default. GLTFLoader flips `normalScale.y` when a glTF mesh has no tangents (`GLTFLoader.js:3564`). three.js's own convention is +Y.
- 267 Disposal: GLTFLoader textures are ImageBitmaps, and its docs say they need "special handling during the disposal process" (`GLTFLoader.js:80-82`): call `texture.source.data.close()`. `material.dispose()` doesn't dispose its textures (`src/materials/Material.js:1207`, `WebGLRenderer.js:1151-1169`).
- 266 Reuse: `THREE.Cache.enabled` defaults to `false` (`src/loaders/Cache.js:16`). Even when enabled it caches file bytes and images, not parsed models. A second GLTFLoader load creates new geometries and materials (`B-gltf.mjs`: `false`, `false`).
- 305 Intersection anatomy: there is also `intersection.normal` (the interpolated vertex normal, in local space, flipped to face the ray), `uv1`, and `barycoord`. `face.normal` is not flipped when a DoubleSide mesh is hit from behind (`B-d7d8d9.mjs`: `[[0,0,1],[0,0,-1]]`).
- 306 Filtering: `intersectObject` and `intersectObjects` default to `recursive = true` (`Raycaster.js:198,218`). Helpers are hit: GridHelper, AxesHelper, and Box3Helper all return hits, with a default Line threshold of 1 world unit. A TransformControls helper added to the scene gives 11 hits on gizmo and hidden picker meshes (`B-extra.mjs`).
- 336 Controls coexistence: in r186, TransformControls isn't an Object3D. Add `controls.getHelper()` to the scene (`TransformControls.js:77,453`; `B-extra.mjs`). Use its `dragging-changed` event (`TransformControls.js:123,236`) to set `orbit.enabled = !event.value`.
- 339 Frame-rate independence: OrbitControls' own `enableDamping` multiplies by `(1 − dampingFactor)` once per `update()`, not per second (`OrbitControls.js:801-804`). That makes it frame-rate dependent, the same bug the misconception describes.

---

## Ledger

| Location | Claim (short) | Kind | Verdict | Evidence (short) |
| --- | --- | --- | --- | --- |
| :230 | Mesh = typed arrays + rules for reading | General | RULE-OF-THUMB | framing |
| :234 | BufferAttribute: flat typed array; count = length ÷ itemSize | API/Behavior | OK | B-d5: `[12,3,4]`; `src/core/BufferAttribute.js` |
| :234 | Misc: array index ≠ vertex index | Behavior | OK | B-d5: `getX(3)=5` vs `array[3]=1` |
| :235 | Interleaved attributes: one buffer, stride + offset (InterleavedBuffer, InterleavedBufferAttribute) | API/Behavior | OK | B-d5: stride 5, offsets 0/3, shared `.data` |
| :235 | Misc: every attribute has its own array | Behavior | OK | same |
| :236 | Index lets triangles share vertices | Behavior | OK | `BufferGeometry.setIndex` (:234); SphereGeometry indexed |
| :236 | Misc: shared vertices can have different normals (false) | Behavior | OK | one normal per vertex slot; BoxGeometry has 24 vertices for its hard edges (B-d5) |
| :237 | CCW marks the front face | Behavior | OK | `ray.intersectTriangle(..., side===FrontSide)` (`Mesh.js:431`); FrontSide back hit 0 (B-d7d8d9) |
| :237 | Misc: flipping normals flips culling; culling uses winding | Behavior | OK | culling is GL winding (`WebGLState.js:794-830`); normals unused |
| :237 | Mirrored geometry use context | Behavior | OK (note) | negative determinant auto-flips (`WebGLRenderer.js:1200`) |
| :237 | DoubleSide trade-offs | API | OK | `THREE.DoubleSide` |
| :238 | Face normal = normalize(cross(b−a, c−a)) | Behavior | OK | B-d5: equals `Triangle.getNormal` (`Triangle.js:66-80`) |
| :238 | Misc: face normal = average of vertex normals | General | OK | the face normal comes from the positions |
| :238 | Raycast face normal use context | Behavior | OK | `Mesh.js:497` uses `Triangle.getNormal` |
| :239 | Vertex normals are averaged face normals | Behavior | OK (note) | area-weighted (B-d5 `[0.0001,0,1]`); `computeVertexNormals` |
| :239 | Hard edges need duplicated vertices | Behavior | OK | BoxGeometry 24 vertices |
| :239 | Misc: imported normals always right | General | OK | — |
| :240 | UVs 2D, usually 0–1 | General | OK | — |
| :240 | Second UV set feeds light/AO maps | Behavior | OUTDATED | F1: `texture.channel` defaults 0; `uv1`, not `uv2` |
| :240 | Misc: UVs must stay in 0–1 | Behavior | OK | `wrapS`/`wrapT` (RepeatWrapping) |
| :241 | Bounds computed in local space, stored on geometry | Behavior | OK | B-d5: mesh at x=100, box `[-1,1]` |
| :241 | Stale after edits | Behavior | IMPRECISE | F2 |
| :241 | Misc: geometry.boundingBox is world | Behavior | OK | B-d5 |
| :241 | Culling / raycast early-out use contexts | Behavior | OK | `Frustum.intersectsObject` uses the sphere; `Mesh.js:248-276` |
| :242 | needsUpdate after edits | API/Behavior | OK | B-d5: version 0 → 0 after array edit, 1 after needsUpdate |
| :242 | setDrawRange limits drawing | API | OK | B-d5 drawRange; raycast honours it (`Mesh.js:310-311`) |
| :242 | Misc: editing the array updates the GPU | Behavior | OK | version unchanged without needsUpdate |
| :243 | Groups → material slots; group = draw call | API/Behavior | IMPRECISE | F3 |
| :243 | Misc: one mesh is always one draw call | Behavior | OK | `WebGLRenderer.js:1941-1950` |
| :243 | Raycast materialIndex | API | OK (note) | only with a material array (B-d5) |
| :244 | InstancedMesh: one geometry/material, per-instance matrices | API | OK | `setMatrixAt`; B-d5 |
| :244 | Misc: instances can use different materials | Behavior | OK | materials are shared by all instances; an array is groups, not per instance |
| :244 | Selection by instanceId; per-instance color (`setColorAt`) | API | OK | B-d5: `instanceId 2`, `instanceColor` created |
| :245 | TBN basis; tangent-space normal maps relative to it | General/API | OK | `computeTangents` → itemSize 4; `normalMapType` default TangentSpaceNormalMap |
| :245 | glTF uses +Y (OpenGL) | General | GENERAL-OK | Khronos glTF 2.0: green encodes +Y, "+Y up" |
| :245 | three.js uses +Y | Behavior | OK | `normalScale` default (1,1); GLTFLoader flips y only for derivative tangents (:3564) |
| :245 | Unreal uses −Y (DirectX) | General | GENERAL-OK | Unreal "Flip Green Channel" setting; Epic forums and industry guides (no official Epic page found) |
| :245 | Misc: normal map colors are world directions | Behavior | OK | ObjectSpaceNormalMap exists but tangent space is the default |
| :249 | Attribute positions are local | Behavior | OK | `Mesh.js:454-458` (local vertices, point → world) |
| :250 | Tangent space is a fourth space | General | OK | — |
| :251 | Vertex count drives vertex cost | General | RULE-OF-THUMB | — |
| :251 | Each group or material adds a draw call | Behavior | IMPRECISE | F4 |
| :252 | pos+normal+uv float32 = 32 B/vertex | Number | OK | B-d5: 32 |
| :252 | Indices 2 or 4 bytes | Number | IMPRECISE | F5 (uint8 allowed) |
| :256 | Four costs; file size predicts only download | General | RULE-OF-THUMB | — |
| :260 | glTF hierarchy scenes→…→buffers + materials/textures | General | GENERAL-OK | Khronos glTF 2.0 spec |
| :260 | Multi-primitive mesh becomes a Group | Behavior | OK | `GLTFLoader.js:3981-3995`; B-gltf: `Group` with `[Mesh,Mesh]` |
| :260 | Finding a part by node name | Behavior | OK (see F9) | names are sanitized |
| :261 | Loading async with progress/complete/fail (`Loader.load`, `loadAsync`, `LoadingManager`) | API | OK | `src/loaders/Loader.js:82-97`; `LoadingManager.js:27` |
| :261 | Misc: onLoad means no render hitch | Behavior | OK | upload and compile happen later (F6) |
| :262 | Upload on first render; compile on first use | Behavior | OK | `WebGLRenderer.compile` separate; `initTexture` (:3595) |
| :262 | Pre-warming with compileAsync | API | IMPRECISE | F6 (shaders only) |
| :262 | Misc: once loaded it renders instantly | Behavior | OK | — |
| :263 | Draco smallest download, heavier decode | General | RULE-OF-THUMB | F7 (raw bytes yes; gap narrows under gzip) |
| :263 | Meshopt fast decode, pairs with gzip/brotli | General | GENERAL-OK | EXT_meshopt_compression spec (~1 GB/s; built for further compression) |
| :263 | Misc: compressed geometry uses less GPU memory; both decode to full buffers | Behavior/General | IMPRECISE | F7 (quantization persists) |
| :263 | Loaders exist: DRACOLoader, MeshoptDecoder, GLTFLoader extensions | API | OK | `DRACOLoader.js`, `libs/meshopt_decoder.module.js`, `GLTFLoader.js:85-102` |
| :264 | KTX2/Basis stay compressed in VRAM | General/Behavior | IMPRECISE | F8 (RGBA32 fallback) |
| :264 | KTX2Loader | API | OK | `examples/jsm/loaders/KTX2Loader.js`; needs `detectSupport` |
| :264 | Misc: 200 KB JPG = 200 KB memory; decodes to RGBA | General | GENERAL-OK | Khronos KTX artist guide (PNG 118 KB → 1.5 MB GPU) |
| :265 | Texture bytes ≈ w×h×4×1.33 with mips | Number | OK | B-d7d8d9: ratio 1.3333 |
| :265 | Geometry bytes from attribute sizes | Number | OK | — |
| :265 | Misc: file size = memory size | General | OK | — |
| :266 | Load once per URL; share resources | Behavior | OK | B-gltf: second parse gives new geometry and material |
| :266 | Misc: loading same URL twice is free | Behavior | OK | `Cache.enabled` false (`Cache.js:16`); it caches bytes only |
| :267 | remove() frees nothing; dispose what you own | Behavior | OK (note) | `Object3D.remove` has no dispose; `Material.dispose` doesn't touch textures |
| :267 | Disposing a shared resource breaks other users | Behavior | OK | dispose is per resource; renderer re-uploads on next use, so it's wasteful rather than broken; see note |
| :268 | Preload vs lazy trade-off | General | RULE-OF-THUMB | — |
| :272 | Download network; decode CPU/worker; upload and compile stall main thread | General | RULE-OF-THUMB | Draco/KTX2 workers (`DRACOLoader.js:440`, `KTX2Loader.js:334`); compileAsync can avoid the compile stall (F6) |
| :273 | JS heap and GPU memory are separate budgets | General | RULE-OF-THUMB | — |
| :273 | 2048² uncompressed ≈ 22 MB with mips | Number | OK | B-d7d8d9: 22.37 MB (21.33 MiB) |
| :274 | Color space in Domain 11 | Pointer | OK | — |
| :278 | Traversal to question unfamiliar scenes | General | RULE-OF-THUMB | — |
| :282 | traverse visits all | API/Behavior | OK | B-d7d8d9; `Object3D.js:1081-1093` |
| :282 | traverseVisible skips hidden subtrees | API/Behavior | OK | B-d7d8d9 `["root","dup"]`; `Object3D.js:1103-1117` |
| :282 | traverseAncestors walks up | API/Behavior | OK | excludes self: `["a","root"]` |
| :282 | Misc: traverseVisible visits children of hidden | Behavior | OK (misconception is false) | same |
| :283 | getObjectByName returns first match | API/Behavior | OK | depth-first, self first (`Object3D.js:944-963`); B-d7d8d9 |
| :283 | Type flags like isMesh | API | OK | `isMesh` etc. |
| :283 | Names not unique / glTF doesn't guarantee | Behavior/General | IMPRECISE | F9 |
| :284 | Collect, then mutate; removing inside traverse breaks | Behavior | OK | B-d7d8d9: TypeError, and two helpers left unvisited |
| :285 | Box3.setFromObject world AABB grows under rotation | API/Behavior | IMPRECISE | F10 |
| :285 | Misc: object bounds = geometry.boundingBox | Behavior | OK | — |
| :286 | Count meshes, tris, unique resources by uuid | General | OK | `uuid` on geometry, material, texture |
| :286 | Misc: 100 meshes sharing a material = 1 draw call | Behavior | OK (misconception is false) | one render item per mesh (`WebGLRenderer.js:1958`); `renderer.info.render.calls` |
| :287 | visible=false skips rendering | Behavior | OK | `WebGLRenderer.js:1862` (the whole subtree) |
| :287 | Layers filter per camera and raycaster | API/Behavior | IMPRECISE | F11 (not inherited) |
| :287 | Misc: invisible objects can't be raycast | Behavior | OK (misconception is false) | B-d7d8d9: hits 2 |
| :288 | glTF extras arrive as userData | Behavior | OK | `GLTFLoader.js:2360-2376`; B-gltf: node and material extras present; primitive extras go to `geometry.userData` |
| :288 | Misc: metadata must live outside scene | General | OK | — |
| :289 | Store, swap, restore materials | General | RULE-OF-THUMB | `scene.overrideMaterial` also exists (`Scene.js:113`) |
| :289 | Misc: restoring happens automatically | Behavior | OK | nothing restores |
| :290 | clone shares geometry and materials | API/Behavior | OK | B-d7d8d9: true/true; material array sliced but same materials |
| :290 | Misc: clone color change affects only clone | Behavior | OK (misconception is false) | original became `ff0000` |
| :294 | Traversal O(n); cache results | General | RULE-OF-THUMB | — |
| :295 | Traversal positions/bounds are local | Behavior | IMPRECISE | F12 |
| :299 | Raycast/bounds are CPU math | Behavior | OK | `Raycaster.js`, `Mesh.raycast` |
| :303 | Ray = origin + t·dir, t ≥ 0 | API/General | OK | `Ray.closestPointToPoint` clamps (B-d7d8d9 `[0,0,0]`); `Ray.at` doesn't |
| :303 | Misc: a ray extends both ways | Behavior | OK | intersect methods reject t < 0 |
| :304 | Pointer → canvas px → NDC → setFromCamera | API | OK | `Raycaster.setFromCamera` (`Raycaster.js:119-139`) expects NDC |
| :304 | Misc: use window size; use canvas rect | General | GENERAL-OK | MDN clientX is viewport-relative |
| :305 | distance, point (world) | Behavior | OK | B-d7d8d9: point `[0,0,-2]` world |
| :305 | face (local-space normal) | Behavior | OK | B-d7d8d9: `[-1,0,0]` local vs `[0,0,1]` world |
| :305 | faceIndex, uv, instanceId, object | API | OK | hit keys printed; instanceId in B-d5 |
| :305 | Sorted by distance | Behavior | OK | `Raycaster.js:202,226` ascSort |
| :305 | Misc: face.normal is world | Behavior | OK (misconception is false) | same |
| :305 | Misc: first hit is the visible one | Behavior | OK (misconception is false) | invisible objects and helpers are hit (B-d7d8d9, B-extra) |
| :306 | Recursive flag, layers, target lists filter | API | IMPRECISE | F11; recursive default true (B-d7d8d9: 2 vs 0) |
| :306 | Misc: helpers ignored automatically | Behavior | OK (misconception is false) | Grid/Axes/Box3Helper hit; TransformControls helper 11 hits |
| :307 | Ray–plane via t; parallel never hits | API/Behavior | IMPRECISE | F13 |
| :307 | Misc: every ray hits an infinite plane | Behavior | OK (misconception is false) | parallel or behind → null |
| :308 | Ray–sphere quadratic; negative discriminant = miss | General/API | OK | `Ray.intersectSphere` (`Ray.js:307-337`, geometric form of the same test) |
| :308 | Misc: a hit has one solution | General | OK (note) | math has two roots; three.js returns the nearest in front, or the exit point when inside (B-d7d8d9) |
| :309 | Möller–Trumbore returns t + barycentrics | General/API | IMPRECISE | F14 (three.js uses a watertight method) |
| :309 | Misc: barycentrics only for hit test | Behavior | OK | used for uv, uv1, normal interpolation (`Mesh.js:462-479`) |
| :309 | Back-face handling | API | OK | `backfaceCulling` flag; B-d7d8d9 null |
| :310 | Ray–AABB slab method | API/General | OK | `Ray.intersectBox` (`Ray.js:449+`); B-d7d8d9 |
| :310 | Misc: box test needs six faces separately | General | OK | — |
| :311 | Box3, Sphere, Plane, Frustum containment/overlap | API | OK | `containsPoint`, `intersectsBox`, `intersectsSphere`, `intersectsPlane`; Frustum tests (B-d7d8d9) |
| :311 | Misc: plane distance always positive (it's signed) | Behavior | OK | `Plane.distanceToPoint` → −3 (B-d7d8d9) |
| :312 | AABB loose under rotation; OBB rotates | API/Behavior | OK | B-d7d8d9 1.414 vs 1; OBB is an addon (`examples/jsm/math/OBB.js`) |
| :312 | Misc: Box3 fits rotated objects tightly | Behavior | OK (misconception is false) | same |
| :313 | Closest point on line/box/triangle | API | OK | `Line3.closestPointToPoint`, `Box3.clampPoint`, `Triangle.closestPointToPoint` (B-d7d8d9) |
| :313 | Misc: closest point is nearest vertex | Behavior | OK (misconception is false) | triangle gives `[5,5,0]`, not a vertex |
| :314 | BVH O(n) → ~O(log n); build cost; refit | General | RULE-OF-THUMB | three-mesh-bvh README (third party, not installed) |
| :318 | Ray moved to local via inverse matrixWorld → face.normal local | Behavior | OK | `Mesh.js:267-268,497` |
| :319 | Per-object sphere test + inverse, then triangles | Behavior | IMPRECISE | F15 |
| :320 | Raycast is sync CPU; performance.now accurate | General | RULE-OF-THUMB | F21 (timer coarsening) |
| :321 | GPU picking alternative | General | RULE-OF-THUMB | — |
| :325 | Interaction composes earlier domains | General | RULE-OF-THUMB | — |
| :329 | Pointer events unify mouse/touch/pen | General | GENERAL-OK | MDN Pointer events |
| :329 | Coordinates are CSS px relative to canvas | General | IMPRECISE | F16 |
| :329 | Misc: multiply by DPR before NDC | General | OK (misconception is false) | DPR cancels (B-d7d8d9 same NDC) |
| :330 | Threshold separates click vs drag; pointer capture keeps drag | General | GENERAL-OK | MDN setPointerCapture; threshold is a rule of thumb |
| :330 | Misc: pointerup on same object = click | General | OK | — |
| :331 | Hover/selection state machine | General | RULE-OF-THUMB | — |
| :332 | Orbit spherical around target; pan target+camera in view plane; dolly along view | API/Behavior | IMPRECISE | F17 (OrbitControls naming, orthographic zoom) |
| :333 | Ray–plane each move, keep grab offset | General | RULE-OF-THUMB | — |
| :334 | Axis drag via plane containing axis, facing camera | General | RULE-OF-THUMB | standard gizmo technique |
| :335 | Local vs world manipulation | API | OK | `TransformControls.space` 'world' (default) or 'local'; scale always local (`TransformControls.js:206,1585`) |
| :336 | Disable orbit during gizmo/custom drag | API | OK | `Controls.enabled` (`src/extras/Controls.js:42`); `dragging-changed` (`TransformControls.js:123,236`) |
| :336 | TransformControls use context | API | OK (note) | r186: add `getHelper()` to the scene; not an Object3D (B-extra) |
| :337 | Fit to bounds, animate position + target | General | RULE-OF-THUMB | OrbitControls has no fit method; call `controls.update()` |
| :338 | Project for labels; hide behind camera or occluded | API/Behavior | IMPRECISE | F18 |
| :339 | Delta time; damp with 1 − e^(−λ·dt) | API | OK | `MathUtils.damp` (`MathUtils.js:134-136`); B-d7d8d9 equal at 60 and 120 Hz |
| :339 | lerp(x, t, 0.1)/frame runs twice as fast at 120 Hz | Number | OK | per-second decay rate 6.32 vs 12.64 (B-d7d8d9) |
| :340 | clamp, smoothstep, remap, easing, slerp | API | IMPRECISE | F19 (`mapLinear`; no core easing) |
| :340 | Misc: linear easing looks natural | General | RULE-OF-THUMB | — |
| :344 | Drag: screen → NDC → world ray → object local | Behavior | IMPRECISE | F20 (parent space) |
| :345 | Throttle pointermove raycasts; proxies; render on demand | General | RULE-OF-THUMB | — |

### Other APIs named in the slice or its checks, confirmed to exist in r186
`BufferAttribute`, `InterleavedBuffer`, `InterleavedBufferAttribute`, `BufferGeometry` (`setIndex`, `addGroup`, `setDrawRange`, `computeBoundingBox`, `computeBoundingSphere`, `computeVertexNormals`, `computeTangents`, `toNonIndexed`, `addUpdateRange`), `InstancedMesh` (`setMatrixAt`, `setColorAt`, `instanceColor`), `Texture.channel`, `GLTFLoader`, `DRACOLoader`, `KTX2Loader` (`detectSupport`; `detectSupportAsync` is deprecated as of r181, `KTX2Loader.js:215`), `MeshoptDecoder` (`libs/meshopt_decoder.module.js`), `WebGLRenderer.compile`, `WebGLRenderer.compileAsync`, `WebGLRenderer.initTexture`, `THREE.Cache`, `LoadingManager`, `Object3D` (`traverse`, `traverseVisible`, `traverseAncestors`, `getObjectByName`, `getObjectsByProperty`, `clone`, `layers`, `visible`, `userData`), `Box3` (`setFromObject(obj, precise)`, `applyMatrix4`, `clampPoint`), `Raycaster` (`setFromCamera`, `intersectObject`, `intersectObjects`, `layers`, `params.Line.threshold`), `Ray` (`at`, `intersectPlane`, `intersectSphere`, `intersectTriangle`, `intersectBox`, `closestPointToPoint`), `Plane.distanceToPoint`, `Sphere`, `Frustum`, `Triangle.getNormal`, `Triangle.getBarycoord`, `Line3.closestPointToPoint`, `OBB` (addon), `OrbitControls`, `TransformControls`, `CSS2DRenderer`, `Vector3.project`, `MathUtils` (`clamp`, `smoothstep`, `mapLinear`, `lerp`, `damp`), `Quaternion.slerp`, `Timer`. No deprecation warnings were found for any API in the slice.
