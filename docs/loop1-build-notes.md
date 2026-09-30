# Loop 1 build notes: Domains 3–14

Sep 29, 2026 · Brad

**Status: open.** Brad asked for every remaining domain to be built in one go and pushed a domain at a time. That skipped the usual first-page and per-domain reviews, so this is what came up during the build: calls only Brad can make, what couldn't be verified, and the r186 behavior the pages now teach. Nothing here has been changed in the inventory; each item waits for Brad.

## How the pages were checked

- Every claim was checked against `three@0.186.0`: behavior in Node where possible, rendering behavior in the r186 source or in the browser. Every quiz answer and wrong choice was checked the same way.
- Every page was opened in the viewer: every scene mounts, the quiz renders, and the console has no errors.
- The browser pane was hidden for most of the build, and other builders' saves kept reloading it, so screenshots often failed. Many scenes' framing was checked through the DOM, pixel readback, or offscreen renders instead of by eye. **Shaders pages 3–11 in particular haven't been looked at by eye.**
- `npm run typecheck` is clean for the whole repo. `COVERAGE.md` shows all 184 misconceptions on the 159 cards listed on a page, and the right answer is the longest choice in 171 of 601 questions (28%).
- No quiz was finished during the build, so `progress/log.jsonl` has no new lines.

## Calls for Brad

**Possible concepts to add** (the inventory rule is to flag, not add):
- **Sampling textures in a custom shader** (`uniform sampler2D`, and the color space of what you sample). Domain 12 has no page for it.
- **Not refreshing parts of the scene that never move** (`matrixAutoUpdate`, `scene.matrixWorldAutoUpdate` with manual updates). The update timing page says the optimization domain covers it, but no Domain 14 concept does. Either add a concept or change that line.
- **`SunLight`**, r186's cascaded-shadow addon. Not named anywhere.

**A dependency:** `three-mesh-bvh` isn't installed, so the BVH page builds a small teaching tree from `Box3`s and names the library. BVH drills in Loops 2–3 need the real API.

**Inventory wording that could be sharper** (all kept as written; each page explains the nuance):
- Tour: loaders and textures, "GLTFLoader throws on compressed files until its decoders are attached": the load rejects, or calls `onError`, rather than throwing. For KTX2 and Meshopt it only fails when the file marks them required; otherwise GLTFLoader quietly uses the uncompressed copy.
- Disposal ownership, "Dispose everything under a removed object": in r186 this isn't a crash. The next render re-uploads and recompiles what's still in use, a needless stall. It only breaks for good if the texture's image bitmap was also closed.
- Depth precision, "The far plane causes z-fighting": wrong for perspective cameras, but true for orthographic ones, including shadow cameras.
- Nothing-renders checklist: the page checks "between near and far" before "in view", because `frustum.intersectsObject` already covers near and far. The inventory lists them the other way round.

**Misconceptions that are weak or borderline** (kept; each has a question that exposes it):
- "On-screen size is constant across depth." Few believe it as stated; the real bug is sizing hotspots in world units.
- "Metadata must live outside the scene."
- "Read the code until you see it." A habit more than a wrong belief.
- "Bad normals only look like bad lighting." Close to a strawman.

**The VFX sample's open choices:** the 95% match bar (the worst of three radius and width settings), logging an exercise once on its first pass, and the effect order in the sidebar (the inventory's: Dissolve first).

**Harness:** in headless Chrome, `THREE.Timer`'s delta went negative once after the page became visible again. The debugging page that hit it clamps it; the harness could clamp it for every scene.

## Not verified, or worded as rules of thumb

- **Unreal:** that Unreal expects −Y normal-map green couldn't be confirmed from an Epic page (Epic's docs do show a "Flip Normal Map Green Channel" setting), so the page says it "is usually described as" −Y. The Unreal node names on the VFX page (Length, SmoothStep, Step) are unchecked.
- **GPU behavior in general:** early-z, draw-call overhead being CPU and driver work, CPU/GPU overlap, MSAA shading once per pixel, lockstep pixel groups, mediump on desktop.
- **Numbers from experience:** Draco vs Meshopt size and speed; which devices read BC7, ASTC, or ETC2; ETC1S vs UASTC; Chrome's limit of about 16 WebGL contexts; a 5 px click threshold and a 500 ms long press; `near = distance / 100`; a BVH paying off at tens of thousands of triangles; many phones reporting a device pixel ratio of 3; few people telling a ratio of 2 from 3; allocations causing regular GC stutters.
- **Tools described from their docs, not installed:** Spector.js; Chrome's Memory and Performance panels.
- **Observed, not in the source:** a `flat` varying takes the triangle's last corner.
- **Simplified on purpose:** the frame budget scene is a labelled model, not a measurement; the adaptive quality scene simulates frame times and says so.
- **Not tested with a real mouse:** dragging the TransformControls gizmo (its wiring follows the source). The VFX exercise's score on the WebGL 2 fallback couldn't finish while the pane was hidden.

## r186 behavior the pages now teach

These surprised the builders and are worth knowing in an interview or a Loop 3 bug. Each is on the page named.

- **Rotation:** setting `rotation.order` after the angles makes the object jump (`reorder()` keeps the turn); `lookAt` turns lights −Z first, like cameras; `SpotLightHelper.update()` refreshes the light's target itself, which can hide a target never added to the scene.
- **Camera:** `PerspectiveCamera.getViewSize` exists and includes zoom; `Frustum.intersectsObject` throws on a Group; an empty `Box3` gives a sphere of radius −1, so fitting to an empty model puts the camera on the wrong side.
- **Geometry:** GLTFLoader already sets `normalScale.y = -1` on meshes without stored tangents, so the DirectX fix is `normalScale.y *= -1`; BatchedMesh is one draw call only with `WEBGL_multi_draw`; `setIndex` switches to `Uint32Array` once a vertex number reaches 65,535; a material array with no groups draws nothing.
- **Assets:** DRACOLoader always returns `Uint32Array` indices (the rack's index memory doubles, 354 KB to 707 KB); every Object3D has a `dispose()` that frees none of its geometry, materials, or textures; the dev server answers a missing `.glb` with `index.html`, so GLTFLoader fails with a JSON error, not a 404.
- **Scene graph:** an InstancedMesh's `type` is `'Mesh'`; `material.allowOverride` opts out of `scene.overrideMaterial`; `clone()` copies `userData` through JSON, so a stored material comes back as a plain description and a reference into the tree makes it throw; replacing meshes inside `traverse` silently skips some.
- **Queries:** `Raycaster.set` keeps the direction as given, and one shorter than 1 misses an object dead ahead; raycasting a Sprite after `raycaster.set` throws.
- **Interaction:** OrbitControls' `update()` runs even when disabled; its damping counts frames, so the glide ends twice as fast at 120 Hz; `controls.pan()` reads the camera's saved matrix.
- **GPU:** turning on `shadowMap.enabled`, or `transparent`, after a material's first draw needs `needsUpdate = true`; `stencilWrite` turns the stencil test on for reading too; a composer's default targets drop MSAA; with a composer, `renderer.info.render` counts only the last pass.
- **Materials:** `PCFSoftShadowMap` is removed (it falls back to PCF) and `useLegacyLights` no longer exists; `NeutralToneMapping` still shifts unlit colors slightly; with `scene.environment` set, a material's `envMapIntensity` is ignored; a RectAreaLight without `init()` gives no error but loses its specular; a `metalnessMap` does nothing at the default `metalness: 0`.
- **Shaders:** a ShaderMaterial compiles as GLSL ES 3.00 with defines that keep `gl_FragColor` and `texture2D` working; `customProgramCacheKey` defaults to the `onBeforeCompile` function's text; `MeshNormalMaterial` leaves out the colorspace chunk.
- **Debugging:** raycasting an object with NaN positions returns a hit for every triangle, with NaN distances; NaN in vertex positions is the one NaN case three.js reports (through `computeBoundingSphere`); `EffectComposer.render()` restores whatever render target was set before it.
- **Optimization:** the first Standard or Physical material uploads a lookup texture, so the texture count never returns to 0; `LOD.addLevel` takes a hysteresis argument; a light at intensity 0 still stays in every lit shader; `EffectComposer` reads the pixel ratio only once.

## Cut in the tightening pass, kept for later loops

The Sep 30 pass brought each domain to Domain 1's size and voice, which meant cutting true details. The ones that could become Loop 2–3 drills are kept here.

**Rotation (Domain 3):**
- OrbitControls calls `camera.lookAt(target)` on every update, undoing any turn you give the camera; animate `controls.target` and `camera.position` instead. `slerp(goal, 0.1)` every frame finishes faster at 120 Hz than at 60 Hz.
- `SpotLightHelper.update()` and `DirectionalLightHelper.update()` refresh the light's target, which can hide a target that was never added to the scene.
- `rotateOnWorldAxis` under a turned parent: turn the axis by the inverse of `parent.getWorldQuaternion` first.
- Turning around a point with `applyMatrix4` keeps adding, so start each frame from a saved pose. Inside a group, convert a `Box3` center with `parent.worldToLocal` first.
- A rail pointing straight up makes `worldUp × forward` (0, 0, 0), so building a basis needs another helper direction. `getWorldDirection` refreshes the matrices first; reading `matrixWorld` yourself gives the last render's values.
- `lookAt` handles a turned parent but not one stretched differently on each axis. Its nudge when looking straight along `up` is exactly 0.0001; OrbitControls stops 0.000001 rad short of straight down, and PointerLockControls clamps pitch at ±90°.
- three.js's 'XYZ' order equals fixed-axis Z, then Y, then X, so another program's "XYZ" can mean three.js's 'ZYX'. Reading Euler angles back puts the first and last between −180° and 180°.
- `setFromUnitVectors` with an input that isn't length 1 still returns a length-1 quaternion, just the wrong lean. Quaternion rounding drift is negligible: after a million multiplies the length is still 1 to ten places. Slerp falls back to a plain blend when two turns are nearly the same.
- Conversion methods not on the page: `makeRotationFromEuler`, `makeRotationFromQuaternion`, `makeRotationAxis`, `Vector4.setAxisAngleFromQuaternion`, and `Matrix4.extractRotation`.

**Camera (Domain 4):**
- `project` uses the view matrix, which drops the camera's scale, but `unproject` uses `matrixWorld`, which keeps it, so on a scaled camera they don't undo each other. After changing `fov`, `aspect`, `near`, or `far`, call `updateProjectionMatrix()` before projecting.
- Fitting with tan instead of sin puts the camera slightly too close and clips the model's edges (a good Loop 3 bug). `setFromObject` refreshes the model and its children but not its parents. A common choice is `near = distance / 100`, `far = distance * 100`.
- Measuring world size per pixel with `distanceTo` instead of view depth gives about 28 pixels instead of 24 at the edge of a wide view; `getViewSize` includes `zoom`, which hand formulas forget; an orthographic camera's pixel size is `(top − bottom) / zoom / clientHeight` at every depth.
- For a Group, test `intersectsBox(new Box3().setFromObject(group))` instead of `intersectsObject`. The frustum test reads the saved `matrixWorld`, so refresh after a move. A shadow camera's box starts 10 units wide.
- `setSize` without `false` writes the size into the canvas's style. A thumbnail camera's aspect has to be set back after the render.
- WebGL only promises a 16-bit depth buffer; `reversedDepthBuffer: true` needs `EXT_clip_control` and falls back with a warning.
- Forward × up without `normalize()` shrinks as the camera tilts, so strafing slows. Zeroing forward's y and normalizing fails looking straight down. Normalize the matrix column if the camera might be scaled.
- Each mesh gets a `modelViewMatrix`, and shaders get `viewMatrix`; view space is also called camera or eye space. An orthographic camera's w is always 1. Many games measure FOV side to side.
- `PointsMaterial` with `sizeAttenuation: false` draws a fixed size in CSS pixels; `SpriteMaterial` with it keeps a fixed share of the view's height instead. TransformControls scales its handles by straight-line distance.

**Geometry (Domain 5):**
- Without `WEBGL_multi_draw`, a BatchedMesh draws one call per copy. `wireframe: true` draws triangle diagonals; `EdgesGeometry` doesn't. Thick lines need `LineMaterial` from `three/addons/lines/`.
- `normalized: true` attributes store whole numbers that stand for 0–1. glTF can use 1-byte indices. `hit.faceIndex` is the triangle's number.
- `triangle.isFrontFacing(dir)` does the facing test for a triangle whose corners are in the world. To smooth everything, merge vertices first, then `computeVertexNormals()`.
- GLTFLoader sets `flipY = false` and sets `channel` from the file; a texture you load yourself for a glTF model needs `flipY = false` too. `offset` shifts UVs the way `repeat` scales them.
- Raycasting honors the draw range, so hidden parts can't be clicked. A group whose material slot is empty, or whose material has `visible = false`, is skipped.
- InstancedMesh copies mirrored by a negative scale in their matrix draw inside out.
- `computeTangents` may not match other tools' tangents; `computeMikkTSpaceTangents` needs `mikktspace.module.js` and `await MikkTSpace.ready`. The tangent's `w` records a mirrored UV. Object-space normal maps can't be reused on other shapes and break when the mesh deforms.
- three.js centers the bounding sphere on the bounding box's center, so it isn't the smallest ball around the geometry.

**Assets (Domain 6):**
- A `.gltf` file's progress covers only its JSON, not the `.bin` or textures, so the bar reaches 100% early; a LoadingManager counts files, not bytes, and its total grows, so a percentage built on it can jump backward. A real 404 is in `error.response.status`.
- A file that marks KTX2 or Meshopt optional falls back silently to its uncompressed copy when the decoder is missing. `TextureLoader` never calls `onProgress`. `RGBELoader` still works but warns.
- A DataTexture defaults to `NearestFilter` with no mipmaps; a VideoTexture skips mipmaps. A logo loaded with TextureLoader and put on a glTF material needs `flipY = false`.
- GLTFLoader never builds material arrays with geometry groups; it makes separate meshes. Cleaned names are unique within one load, not across loads, and identical textures come back as one `Texture`.
- An image from TextureLoader may stay undecoded until upload, adding the decode to that frame. Without the parallel-compile extension, `compileAsync` behaves like `compile`.
- DRACOLoader uses up to 4 workers (`setWorkerLimit`). Sizes: the Draco decoder about 345 KB, Meshopt's 29 KB, the Basis transcoder about 585 KB; three.js warns when several KTX2Loaders are active.
- A per-attribute byte count counts interleaved attributes twice. Full-float textures cost 16 bytes a pixel.
- A load-once cache should drop a failed promise so the load can be retried. A mesh's `material` can be an array (`[object.material].flat()`).

**Scene graph (Domain 7):**
- `traverseVisible` checks only `visible`: it still visits objects that are off screen, on a layer the camera doesn't draw, or with `material.visible = false`. Called on a hidden object, it visits nothing, not even that object.
- GLTFLoader doesn't clean material names (`Zinc.003` keeps its dot). Every object created in code starts with the name `''`.
- `expandByObject` includes everything under the object; lights, cameras, and empty nodes add nothing to a box. A box doesn't follow a moved model.
- A transparent `DoubleSide` material takes two draw calls per mesh unless `forceSinglePass = true`. An InstancedMesh's triangles multiply by `count`. Dividing the vertex count by 3 on an indexed model undercounts triangles.
- A `userData` reference to another object in the tree can make `clone()` throw; GLTFExporter writes `userData` back out as extras. Rigged characters need `SkeletonUtils.clone`.
- `material.allowOverride = false` opts a material out of `scene.overrideMaterial`, which otherwise covers helpers too. Never dispose a saved original you'll put back.
- When splitting a group, `attach` keeps each child where it is in the world.

**Spatial queries (Domain 8):**
- `ray.at(t)` is plain arithmetic, so a negative `t` gives a spot behind the start; only the intersect tests keep to the front. `ray.closestPointToPoint` returns the ray's start when the point is behind it.
- Listening on `window` instead of `renderer.domElement` lets clicks on UI outside the canvas pick things; orbiting also fires `pointerdown`. For an orthographic camera every ray points the way the camera faces and the start moves to the pointer.
- A ray exactly along an edge two triangles share gets one hit from each, at the same distance. `hit.face.normal` always points out of the front, even when a `DoubleSide` mesh is hit from behind. A mesh with no `uv` attribute gives no `hit.uv`. With the recursive flag off, a Group is never hit.
- A ray lying exactly in a plane counts as a hit at its own start. `BackSide` tests a triangle's corners reversed.
- `tri.getBarycoord(spot, target)` gives the weights for a spot you found yourself; `plane.projectPoint(p, target)` gives the spot on a plane straight across from a point.
- A plank turned 45° gets a `Box3` about 5–6 times its own volume. `setFromObject(obj, true)` costs a pass over every vertex.
- A BVH's O(log n) is typical, not guaranteed: a ray skimming along a surface enters many boxes. A mesh that changes shape every frame pays for a refit every frame; three-mesh-bvh can build in a worker.

**Interaction (Domain 9):**
- `event.button` is 0 for the main button, a finger, or a pen tip, and 2 for a right-click. `event.offsetX` measures from the padding edge, so it breaks with a border or a CSS transform. Touch gets pointer capture automatically; a mouse needs `setPointerCapture`.
- OrbitControls: pan also works with Shift, Ctrl, or Cmd plus a left drag; `zoomToCursor = true`; moving from code uses `rotateLeft`, `rotateUp`, `pan(dx, dy)` in CSS pixels, and `dollyIn`/`dollyOut`. It stops mid-drag as soon as `enabled` is false. MapControls uses `screenSpacePanning = false`.
- `intersectPlane` returning null leaves `hit` at its old value. An axis pointing at the camera gives a near-zero drag-plane normal; TransformControls hides that arrow.
- `setFromMatrixColumn(matrixWorld, 0).normalize()` gives an object's axis in the world (normalize, since scaled columns aren't length 1). `translate*` distances are in the parent's units. Gizmo handles sit at the origin even when an object has a `pivot`.
- A raycast against `scene.children` hit the TransformControls gizmo 11 times from one ray. Reset `near` and `far` after focusing on something at a new distance.
- An anchor exactly on a surface was hidden by that surface in about 1 view in 4. CSS2DRenderer also hides hidden objects, objects under a hidden parent, and objects on a layer the camera doesn't see.
- A per-frame lerp closes 96% of the gap in a quarter second at 120 Hz vs 79% at 60 Hz; `lerp(x, target, 10 * delta)` is slightly off even at normal rates; cap delta with `Math.min(delta, 0.1)`. There's no `MathUtils.remap`; three.js calls it `mapLinear`. tween.js ships at `three/addons/libs/tween.module.js`.

**GPU pipeline (Domain 10):**
- Symptoms by stage: a mesh cut open near the camera is the near plane; a plane invisible from behind is culling; jagged edges are rasterization; a see-through object hiding what's behind it is the depth test; holes in a texture are `discard` from `alphaTest`. Clipping also trims triangles that cross the view's edge.
- The WebGL commands behind one draw (`useProgram`, `uniform*`, `bindTexture`, state, `bindVertexArray`, `drawElements`), and when three.js skips each. A program switch re-sends the camera and light values.
- A Group's `renderOrder` sorts everything inside it ahead of each object's own; `setOpaqueSort` and `setTransparentSort` replace the sort.
- A see-through `DoubleSide` material draws twice, back faces then front. The transparent flag applies to PNG alpha too, with `alphaTest` as the hard-edged alternative.
- Stencil: at least 8 bits; a render target needs `stencilBuffer: true`; a scaled copy gives an even outline only on rounded, roughly convex shapes, while pushing vertices along normals works on any shape.
- A render target defaults to no stencil and no mipmaps; a canvas-sized target at DPR 2 on 1920×1080 is about 33 MB of color, and `HalfFloatType` doubles it. `UnrealBloomPass` works best on half-float targets; `setEffects` warns if you add an `OutputPass` and multisamples by itself.
- The async readback still makes the GPU drain its queue; three.js logs an error for formats it can't read.
- What each measurement tool can't see (Stats, `renderer.info`, the timer-query extension, Chrome's Performance panel, Spector.js); WebGLRenderer doesn't read timer queries for you. Phones often draw at pixel ratio 3.

**Materials, lighting, and color (Domain 11):**
- `side` also decides what a raycast can hit: a `FrontSide` mesh can't be clicked from behind. A decal lifted off the surface avoids z-fighting but shows a gap up close. Flag defaults: `FrontSide`, `transparent` false, `alphaTest` 0, `depthWrite` true, `polygonOffset` false.
- A mesh whose shader moves its vertices casts its unmoved shadow unless it has `customDepthMaterial` (`customDistanceMaterial` for point lights). The shadow camera sits at the light and looks at `sun.target`; its default near and far are 0.5 and 500, and `bias` is a fraction of that range. A 4096 shadow map costs 64 times the memory of 512.
- A render target stays linear; the sRGB conversion happens only when drawing to the canvas. A color set with `set('#e4572e')` shows exactly on screen only on an unlit material with no tone mapping.
- Color-space and filter changes after a texture's first draw need `needsUpdate`. `flipY` has no effect on an `ImageBitmap`. Canvas text should be sized to its on-screen pixels times the pixel ratio.
- A lightmap adds on top of live lights. `transmission` adds a whole extra render of the solid objects; GLTFLoader gives a `MeshPhysicalMaterial` when a file uses its extras. Toon with no `gradientMap` uses two bands.
- `MeshBasicMaterial` ignores `scene.environment`. A plain `scene.background` color still leaves environment lighting. An HDR environment costs 8 bytes a pixel as half floats.
- PBR scales the diffuse color by (1 − metalness); `specular` on Phong defaults to `0x111111`. RectAreaLight fades with distance, and its size sets how soft its reflections are.

## Page lengths

Several pages run over the recipe's guide: most light pages are 72–90 lines against 50–70, and some core pages reach 130–145 against about 120 (the camera domain's, and Attributes, uniforms, varyings). The extra is mostly B's code blocks. Trim if Brad finds them long.
