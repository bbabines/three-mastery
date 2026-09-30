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

## Page lengths

Several pages run over the recipe's guide: most light pages are 72–90 lines against 50–70, and some core pages reach 130–145 against about 120 (the camera domain's, and Attributes, uniforms, varyings). The extra is mostly B's code blocks. Trim if Brad finds them long.
