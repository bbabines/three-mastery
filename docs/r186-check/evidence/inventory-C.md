# Inventory slice C: docs/concept-inventory.md lines 347–537, checked against three@0.186.0

Source paths are relative to `node_modules/three/` unless noted. The Node script is `docs/r186-check/evidence/c_checks.mjs`, run from the repo with `node --input-type=module < c_checks.mjs`. `REVISION` prints "186".

## Findings

### The four questions the owner flagged

**Q1. Draw sorting (L355).** The reviewer is mostly right, with one correction: three.js sorts by **material id**, not by program. `src/renderers/webgl/WebGLRenderLists.js`:
- Opaque, `painterSortStable` (L1–29): `groupOrder` → `renderOrder` → `material.id` → `materialVariant` (instanced/skinned, L73–80) → `z` ascending (front to back) → `id`.
- Transparent and transmissive, `reversePainterSortStable` (L31–51): `groupOrder` → `renderOrder` → `z` descending (back to front) → `id`. There's no material key.
- There are three lists (L59–61, L130–142). `transmission > 0` goes to its own `transmissive` list. Draw order is opaque, then transmissive, then transparent (`src/renderers/WebGLRenderer.js:1988–1990`).
- `groupOrder` is the `renderOrder` of the nearest ancestor `Group` (`WebGLRenderer.js:1868–1870`). `z` is the clip-space z of the bounding-sphere center, taken per object and not per triangle (`WebGLRenderer.js:1924–1935`; `Vector4.applyMatrix4` doesn't divide by w, `src/math/Vector4.js:444–456`).
- Sorting only happens when `renderer.sortObjects` is true, which is the default (`WebGLRenderer.js:249, 1714–1716`). You can replace it with `setOpaqueSort` / `setTransparentSort` (`WebGLRenderer.js:891, 903`).

**Q2. HDRLoader vs RGBELoader.** `examples/jsm/loaders/RGBELoader.js` is now a thin subclass of `HDRLoader`, commented `// @deprecated, r180`. Its constructor runs `console.warn( 'RGBELoader has been deprecated. Please use HDRLoader instead.' )`. The types agree (`@types/three/examples/jsm/loaders/RGBELoader.d.ts:4`). The slice doesn't name either loader; see Missing names.

**Q3. BatchedMesh.** It exists in r186: it's exported from `src/Three.Core.js:18`, and `src/objects/BatchedMesh.js` has `perObjectFrustumCulled` (L211), `sortObjects` (L221), and multi-draw arrays (L272–275). Domain 14's "batch" should name it; see Missing names.

**Q4. EffectComposer without OutputPass.** Yes, it loses both tone mapping and output color-space conversion.
- The composer renders into `WebGLRenderTarget(..., { type: HalfFloatType })` with no `samples` (`examples/jsm/postprocessing/EffectComposer.js:69`).
- When the target is a render target and not the canvas (and not XR), `setProgram` sets `toneMapping = NoToneMapping` (`WebGLRenderer.js:2387–2395`) and uses the linear working color space instead of `outputColorSpace` (`WebGLRenderer.js:2378`).
- `OutputPass` puts tone mapping and sRGB conversion back (`OutputPass.js:17–22, 93–112`). Its docs say FXAA-style passes that need sRGB input must come after it.
- Edge case: if a lone `RenderPass` is the last pass, it renders to the screen (`RenderPass.js:156`) and keeps both.
- New in r186: `new WebGLRenderer({ outputBufferType: HalfFloatType })` plus `renderer.setEffects([...])` applies tone mapping and color space automatically, and warns if you add an OutputPass anyway (`WebGLRenderer.js:84, 565–567, 747–771`). That internal buffer gets `samples: 4` when `antialias` is true (`src/renderers/webgl/WebGLOutput.js:38`).

### Findings by line

1. **docs/concept-inventory.md:355**. Claim: "three.js sorts opaque objects front to back and by program, and transparent objects back to front."
   - Verdicts: "by program" is **WRONG**. "Front to back" and "back to front" are **IMPRECISE**.
   - Evidence: WebGLRenderLists.js:1–51, see Q1. The key is `material.id`. Two different materials that compile to the same program aren't grouped together. For opaque objects, depth is only the fourth key, after `groupOrder`, `renderOrder`, and material. For transparent objects, `renderOrder` beats depth.
   - Suggested wording: "With `sortObjects` on (the default), three.js sorts opaque objects by renderOrder, then by material, then front to back. Transparent objects sort by renderOrder, then back to front. Objects with transmission get their own list, drawn between the two. renderOrder always wins over distance."

2. **:357**. Claim: stencil buffer, "Outlines require post-processing" (misconception).
   - Verdict: **IMPRECISE**, because it leaves out a setup step that drills will hit.
   - Evidence: `WebGLRenderer` has `stencil = false` by default (`WebGLRenderer.js:76`), and so do render targets (`stencilBuffer` false, script: `[0,true,false]`). The material stencil properties do exist: `stencilWrite:false, stencilFunc:519 (AlwaysStencilFunc), stencilRef:0, stencilZPass:7680` (script).
   - Suggested wording: add "In three.js, turn it on with `new WebGLRenderer({ stencil: true })` (off by default), then use the material's `stencilWrite` / `stencilFunc` / `stencilRef` / `stencilZPass`."

3. **:358**. Claim: "transparent objects usually skip depth writes."
   - Verdict: **IMPRECISE**.
   - Evidence: `new MeshStandardMaterial({transparent:true}).depthWrite` is `true` (script). three.js doesn't turn depth writes off for you.
   - Suggested wording: "Order-dependent. Engines usually turn off depth writes for transparent objects, but three.js leaves `depthWrite` on unless you set `depthWrite: false`. Sorting is per object (its bounding-sphere center), not per triangle."

4. **:364**. Claim: "renderer.info counts" as a measuring tool.
   - Verdict: **IMPRECISE**, because it leaves out a trap.
   - Evidence: `info.render` resets at the start of every `render()` call when `info.autoReset` is true, which is the default (`WebGLRenderer.js:1728–1731`; `src/renderers/webgl/WebGLInfo.js:10–15, 54–57`). With a composer, or with shadow and transmission renders, you only see the last `render()`.
   - Suggested wording: "renderer.info counts (set `info.autoReset = false` and call `info.reset()` once per frame when a frame has several render calls)."

5. **:388**. Claim: misconception "Tone mapping leaves brand colors unchanged." Use context "matching product colors."
   - Verdict: **IMPRECISE**.
   - Evidence: the default is `renderer.toneMapping = NoToneMapping` (`WebGLRenderer.js:277`). Tone mapping only runs when drawing to the canvas and `material.toneMapped` is true (`WebGLRenderer.js:2387–2395`). r186 also ships `NeutralToneMapping` (constant 7, script), which is designed to keep base colors close to unchanged. The misconception holds for ACES and AgX. For the product-color use context, the tool built for that job isn't named.
   - Suggested wording: "Off by default (NoToneMapping). It maps HDR into display range, and exposure scales before the curve. ACES and AgX shift hues and saturation. NeutralToneMapping is built to keep product colors close to the source."

6. **:395**. Claim: "Light and AO maps use a second UV set."
   - Verdict: **IMPRECISE**. True of baking practice, but misleading for r186.
   - Evidence: `aoMapUv` and `lightMapUv` come from `texture.channel` (`src/renderers/webgl/WebGLPrograms.js:275–276`), and `Texture.channel` defaults to 0 (`src/textures/Texture.js:118`). By default three.js reads the first UV set (`uv`). A second set needs `texture.channel = 1` and a `uv1` attribute (`WebGLProgram.js:631`). GLTFLoader sets `channel` from glTF `texCoord` (`GLTFLoader.js:3448–3451`).
   - Suggested wording: "Baked light and AO maps usually live on a second UV set. In three.js, each texture's `channel` picks the UV set, and it defaults to 0 (the first). Set `channel = 1` and supply a `uv1` attribute for a second set."

7. **:413**. Claim: misconception "Varyings are copied unchanged. They're interpolated."
   - Verdict: **IMPRECISE** (minor).
   - Evidence: GLSL ES 3.00 has the `flat` qualifier. A flat varying *is* copied unchanged, from the provoking vertex.
   - Suggested wording: "They're interpolated across the triangle by default (perspective-correct). `flat` turns that off."

8. **:426**. Claim: "Vertex shaders also run again in shadow passes."
   - Verdict: **IMPRECISE**, and it hides a classic bug.
   - Evidence: shadow passes draw with `object.customDepthMaterial` or `customDistanceMaterial` when set, and otherwise with a built-in `MeshDepthMaterial` / `MeshDistanceMaterial` (`src/renderers/webgl/WebGLShadowMap.js:428–441`). The vertex work repeats, but *your* custom vertex shader doesn't run there. Displacement in a ShaderMaterial or onBeforeCompile casts an undisplaced shadow.
   - Suggested wording: "Vertex work runs again in every shadow pass, using a depth material. A custom vertex effect needs a matching `customDepthMaterial` (or `customDistanceMaterial` for point lights), or its shadow won't match."

9. **:440**. Claim: "Zero-length normalize, parallel lookAt, zero scale, and parallel ray–plane," under a NaN heading.
   - Verdict: **IMPRECISE**. In three.js's JavaScript math, most of these give silent wrong values or `null`, not NaN.
   - Evidence (script):
     - `new Vector3().normalize()` gives `[0,0,0]`, because it divides by `length() || 1` (`src/math/Vector3.js:792–795`).
     - `Matrix4.lookAt` with a direction parallel to up gives no NaN. It nudges the axis (`src/math/Matrix4.js:489–508`).
     - Inverting a zero-scale matrix gives the all-zero matrix (`Matrix4.js:760`).
     - `Ray.intersectPlane` when parallel gives `null` (`src/math/Ray.js:~364–401`).
     - A raycast against a zero-scale mesh returns 0 hits.
     - NaN does still come from your own math (for example `acos` of a value above 1, or dividing by a zero length yourself), and in GLSL `normalize(vec3(0))` is undefined.
   - Suggested wording: "Degenerate cases: zero-length normalize (three.js returns a zero vector; GLSL gives undefined, often NaN), parallel lookAt (three.js nudges the axis, so the object snaps), zero scale (inverse becomes all zeros, so raycasts miss), parallel ray–plane (returns null). None of them throw. Some make NaN, and NaN spreads silently."

10. **:444 and :518**. Claims: "MeshNormalMaterial" as a debug view, and "Verify a transform bug with normals as color."
    - Verdict: **IMPRECISE**. It leaves out which space the colors are in, and that's the point of the drill.
    - Evidence: MeshNormalMaterial writes `normalize(normal) * 0.5 + 0.5`, where `normal` came through `normalMatrix` (`src/renderers/shaders/ShaderLib/meshnormal.glsl.js:76`; `ShaderChunk/defaultnormal_vertex.glsl.js:46`). That's **view space**, so the colors change as the camera orbits.
    - Suggested wording: "MeshNormalMaterial shows view-space normals, so colors shift when you orbit. For world-space normals, write a small shader or onBeforeCompile that outputs the world normal."

11. **:463**. Claim: misconception "MeshPhysicalMaterial costs the same as MeshStandardMaterial."
    - Verdict: **IMPRECISE**. As worded, the corrected belief ("Physical always costs more") is also misleading.
    - Evidence: the extra features only compile in when turned on: `HAS_CLEARCOAT = material.clearcoat > 0`, and the same for sheen, transmission, iridescence, dispersion, and anisotropy (`WebGLPrograms.js:140–146`). They all default to 0 (script). `transmission > 0` also moves the object into the transmissive list (`WebGLRenderLists.js:130`) and adds a whole extra scene render (`WebGLRenderer.js:1782`, `renderTransmissionPass`).
    - Suggested wording: "Physical's cost depends on which features are on. With clearcoat, sheen, and transmission at 0 it's close to Standard. Each feature adds shader work, and transmission adds a full extra render of the opaque scene."

12. **:488**. Claim: "Euler step: v += a·dt, then p += v·dt."
    - Verdict: **IMPRECISE**.
    - Evidence: updating velocity first and then moving by the *new* velocity is semi-implicit (symplectic) Euler. Explicit Euler moves by the old velocity. The difference is exactly what the "update order doesn't matter" misconception is about. Sources: Gaffer on Games, "Integration Basics"; Caltech CS171 notes.
    - Suggested wording: "Semi-implicit Euler: v += a·dt, then p += v·dt using the new v. It's more stable than explicit Euler, which moves by the old v."

13. **:491**. Claim: "Additive is order-independent and never darkens."
    - Verdict: **IMPRECISE**.
    - Evidence: the blend sum is order-independent. But three.js materials keep `depthWrite: true` by default (script), so additive particles hide each other depending on draw order until you set `depthWrite: false`.
    - Suggested wording: "Additive blending is order-independent once depth writes are off (`depthWrite: false`), and it never darkens. Alpha blending needs sorting."

14. **:497**. Claim: "HLSL renames mix and fract to lerp and frac, and adds saturate."
    - Verdict: **IMPRECISE**. It leaves out the rename that changes behavior.
    - Evidence: HLSL `fmod` takes the sign of the dividend, while GLSL `mod` takes the sign of the divisor (Microsoft Learn, fmod). They differ for negative inputs. Also dFdx/dFdy become ddx/ddy, and vec3 becomes float3.
    - Suggested wording: "HLSL renames mix, fract, and dFdx/dFdy to lerp, frac, and ddx/ddy, and adds saturate. GLSL mod and HLSL fmod differ for negative numbers."

15. **:507**. Claim: "face.normal from local to world through the normal matrix."
    - Verdict: **IMPRECISE**. It's ambiguous in a way that contradicts L414.
    - Evidence: `face.normal` is in local space (script: a rotated box still reports `[0,0,1]`). The object's `.normalMatrix` property is the view-space one (`WebGLRenderer.js:2160–2161`). The world version is `new Matrix3().getNormalMatrix(mesh.matrixWorld)`. `normal.transformDirection(mesh.matrixWorld)` is fine for uniform scale. Side note: the GLSL helper `inverseTransformDirection` is `@deprecated r185` and renamed `transformDirectionByInverseViewMatrix` (`ShaderChunk/common.glsl.js:67`).
    - Suggested wording: "face.normal from local to world with a world normal matrix (`Matrix3.getNormalMatrix(mesh.matrixWorld)`), not the object's `.normalMatrix`, which is view space."

16. **:364**. Claim: "Chrome's GPU track."
    - Verdict: **UNVERIFIED**. I didn't fetch Chrome DevTools docs. As far as I know, the Performance panel has a GPU track. Keep the claim.

## Missing names

- **BatchedMesh** (`src/objects/BatchedMesh.js`). Belongs in L457 Draw call reduction, next to "batch": many *different* geometries with one material in one draw call, with per-object culling and sorting.
- **OutputPass**, plus r186's **`renderer.setEffects()` / `outputBufferType`**. Belong in L360–361 Multi-pass and Multisampling: "a composer needs OutputPass at the end, or tone mapping and sRGB output are lost." Evidence is in Q4.
- **HDRLoader**. Belongs in L393 Environment maps. Use it, not **RGBELoader**, which is deprecated since r180 and warns.
- **`texture.colorSpace = SRGBColorSpace`** and **`renderer.outputColorSpace`**. Belong in L387 Color spaces. Textures default to `NoColorSpace` (script: `""`). GLTFLoader sets sRGB on its color maps (`GLTFLoader.js:836, 1127, 1330`), but hand-loaded textures need it set.
- **NeutralToneMapping**. Belongs in L388, for the "matching product colors" context.
- **RectAreaLight**. Belongs in L392 Light types, for studio product lighting (soft boxes). Needs `RectAreaLightUniformsLib`.
- **`renderer.compileAsync()` / `renderer.initTexture()`**. Belong in L465 Hitch avoidance, as "pre-compile, pre-upload" (`WebGLRenderer.js:1515, 3595`).
- **`readRenderTargetPixelsAsync`**. Belongs in L362 Readback, and the GPU picking drill at L508: non-blocking readback with `fenceSync` (`WebGLRenderer.js:3216, 3273`).
- **`customDepthMaterial` / `customDistanceMaterial`**. Belong in L426 and L394 (see finding 8).

## Ledger

Kinds: API = does it exist; Beh = behavior in r186; Gen = general GPU/GLSL fact; Proc = repo process.

| Loc | Claim (short) | Kind | Verdict | Evidence (short) |
| --- | --- | --- | --- | --- |
| 353 | Stage order buffers→VS→clip→raster→FS→depth/stencil→blend→FB | Gen | GENERAL-OK | Khronos wiki Early Fragment Test / Depth Test (depth test is after the FS unless done early) |
| 353 | A fragment is a candidate, not a pixel | Gen | GENERAL-OK | Khronos wiki Fragment Shader |
| 354 | Draw = bind program, uniforms, buffers, textures, draw | Beh | OK | WebGLRenderer.renderBufferDirect → setProgram, state.setMaterial (:1196–1204) |
| 354 | Draw-call overhead is mostly CPU/driver | Gen | RULE-OF-THUMB | widely held; not provable in general |
| 354 | Shadow passes multiply calls | Beh | OK | WebGLShadowMap.js:287–289, 358 (each face or viewport draws every caster) |
| 355 | Opaque front to back | Beh | IMPRECISE | WebGLRenderLists.js:1–29 (depth is the 4th key) |
| 355 | Opaque "by program" | Beh | WRONG | key is material.id (:11–13), not program |
| 355 | Transparent back to front | Beh | IMPRECISE | :31–51 (renderOrder first; separate transmissive list) |
| 355 | Misconception: render order = scene order | Beh | OK | sortObjects default true (:249, 1714–1716) |
| 355 | renderOrder fixes order | API/Beh | OK | WebGLRenderLists.js:7–9; Group renderOrder → groupOrder (:1870) |
| 356 | Depth test rejects hidden; discard and alphaTest can disable early-z | Gen/Beh | GENERAL-OK | Khronos wiki; alphaTest is a discard (alphatest_fragment.glsl.js:11) |
| 356 | Misconception: hidden objects cost nothing | Gen | GENERAL-OK | vertex work and non-early-rejected fragments still run |
| 356 | Depth prepass (use context) | Beh | OK | no built-in in WebGLRenderer; build with a `colorWrite:false` pass |
| 357 | Stencil = per-pixel mask | Gen | GENERAL-OK | GL stencil test |
| 357 | Stencil usable in three.js | API | IMPRECISE | renderer `stencil=false` by default (:76); material stencil props exist (script) |
| 357 | Misconception: outlines need post | Beh | OK | stencil props on Material; inverted hull |
| 358 | Blending is order-dependent | Gen | GENERAL-OK | standard over-operator |
| 358 | Transparent usually skip depth writes | Beh | IMPRECISE | three.js depthWrite stays true (script) |
| 358 | Sort per object, not per triangle | Beh | OK | bounding-sphere center (:1924–1935) |
| 359 | Render targets have color + depth | API | OK | WebGLRenderTarget: depthBuffer true, stencil false, samples 0 (script) |
| 360 | Each full-screen pass costs full-res fragments | Gen | RULE-OF-THUMB | some passes run at lower res (UnrealBloomPass mips) |
| 360 | Selection outline, bloom, FXAA passes | API | OK | OutlinePass.js, UnrealBloomPass.js, FXAAPass.js in examples/jsm/postprocessing |
| 361 | Render targets need MSAA set explicitly | API | OK | RenderTarget.js:71 `samples: 0` |
| 361 | Misconception: composer keeps canvas AA | Beh | OK | EffectComposer.js:69, no samples |
| 361 | (implied) composer output color | Beh | OK | see Q4: OutputPass needed (:2378, 2387–2395) |
| 362 | readPixels waits for the GPU | Gen/Beh | OK | readRenderTargetPixels is sync (:3132); async variant exists (:3216) |
| 363 | 16.67 ms at 60 Hz | Gen | OK | 1000/60 |
| 363 | Slower of CPU/GPU sets frame time; vsync caps FPS | Gen | RULE-OF-THUMB | pipelining model |
| 364 | performance.now around render = CPU submission | Gen | RULE-OF-THUMB | also includes sync shader compiles and readback stalls |
| 364 | GPU timer queries where supported | Gen | GENERAL-OK | Khronos registry EXT_disjoint_timer_query_webgl2 |
| 364 | Chrome GPU track | Gen | UNVERIFIED | Chrome docs not fetched |
| 364 | Spector.js capture | Gen | GENERAL-OK | well-known WebGL capture tool |
| 364 | renderer.info counts | API | IMPRECISE | exists (WebGLInfo.js:5–15); autoReset per render() (:1728–1731) |
| 370 | Resolution test → fill bound | Gen | RULE-OF-THUMB | also cuts MSAA and post cost |
| 371 | MeshBasicMaterial swap → fragment bound | Gen | RULE-OF-THUMB | shadow passes still run with depth materials |
| 372 | Merge or instance → CPU bound | Gen | RULE-OF-THUMB | |
| 373 | Low-poly proxy → vertex bound | Gen | RULE-OF-THUMB | |
| 374 | Skip render → app logic | Gen | RULE-OF-THUMB | |
| 379 | Clip/NDC link to Domain 4 | Proc | OK | inventory:206 is Camera & Projection |
| 387 | Lighting in linear | Beh | OK | ColorManagement.workingColorSpace = "srgb-linear" (script) |
| 387 | Color textures sRGB; normal, roughness, metal, AO linear | Beh/Gen | OK | glTF spec; GLTFLoader.js:836, 1127, 1330; Texture default colorSpace "" |
| 387 | Misconception: every texture sRGB | Beh | OK | same |
| 388 | Tone mapping maps HDR to display | Beh | OK | tonemapping_pars_fragment.glsl.js |
| 388 | Exposure scales before mapping | Beh | OK | tonemapping_pars_fragment.glsl.js:12, 19, 28, 62, 135, 175 |
| 388 | Misconception: brand colors unchanged | Beh | IMPRECISE | NeutralToneMapping exists; default NoToneMapping (:277) |
| 389 | Diffuse = max(N·L, 0) | Beh | OK | lights_lambert_pars_fragment.glsl.js:13–16; BRDF_Lambert common.glsl.js:103 |
| 389 | Misconception: diffuse depends on viewer | Gen | GENERAL-OK | Lambert has no V term |
| 390 | H = normalize(L+V); highlight from N·H | Beh | OK | bsdfs.glsl.js:18–27 (BRDF_BlinnPhong) |
| 390 | Highlights move with the camera | Beh | OK | V in the BRDF |
| 391 | Metals: no diffuse, tinted reflection | Beh | OK | lights_physical_fragment.glsl.js:4, 46–51 |
| 391 | Roughness spreads reflections | Beh | OK | PMREM roughness mips; GGX |
| 391 | Misconception: metalness 0.5 = semi-metal | Gen | RULE-OF-THUMB | PBR authoring guidance (0 or 1, blends at transitions) |
| 392 | Directional, Point, Spot, Hemisphere, Ambient | API | OK | all exported (script); RectAreaLight and LightProbe not listed |
| 392 | Point/spot fall off with distance² | Beh | OK | decay 2, distance 0 by default (script); lights_pars_begin.glsl.js:61–65 |
| 392 | Misconception: units don't matter | Beh | OK | inverse-square with physical intensities |
| 393 | HDR env prefiltered by PMREM, by roughness | Beh | OK | WebGLRenderer.js:2377–2380 (scene.environment; PMREM for Standard, and Lambert/Phong without envMap) |
| 393 | Metals look black without env | Beh | OK | diffuse ×(1−metalness) = 0 |
| 394 | Shadow = depth render from the light | Beh | OK | WebGLShadowMap.js; MeshDepthMaterial |
| 394 | Frustum size sets resolution | Beh | OK | directional shadow cam is ortho, mapSize 512 (script) |
| 394 | Bias trades acne for peter-panning | API | OK | shadow.bias and normalBias, default 0 (script). Note: PCFSoftShadowMap removed in r186, warns and falls back to PCF (WebGLShadowMap.js:99–103) |
| 394 | Misconception: bigger map fixes all | Gen | OK | |
| 394 | Shadow-catcher plane | API | OK | ShadowMaterial exists |
| 395 | Light and AO maps use second UV set | Beh | IMPRECISE | WebGLPrograms.js:275–276; Texture.channel=0 (Texture.js:118) |
| 395 | Baked = cheap, static | Gen | OK | |
| 396 | Filtering, mipmaps, anisotropy, wrap, repeat, flipY | API | OK | Texture defaults (script); capabilities.getMaxAnisotropy (WebGLCapabilities.js:8) |
| 396 | Mipmaps prevent shimmer | Gen | GENERAL-OK | minification aliasing |
| 397 | glTF roughness G, metalness B | Gen/Beh | GENERAL-OK | glTF 2.0 spec; roughnessmap_fragment:9 `.g`, metalnessmap_fragment:9 `.b` |
| 397 | AO in R | Gen/Beh | GENERAL-OK | glTF occlusion R; aomap_fragment.glsl.js:5 `.r` |
| 398 | side, transparent, alphaTest, depthWrite, polygonOffset | API | OK | Material defaults (script) |
| 398 | Misconception: DoubleSide free | Beh | OK | no culling; transparent DoubleSide draws twice (:2165–2167) unless forceSinglePass |
| 402 | Lights add per-fragment work; add/remove recompiles | Beh | OK | light counts in program key (WebGLPrograms.js:477–485) |
| 403 | Each shadow light = a pass; point light = 6 | Beh | OK | WebGLShadowMap.js:246–249 (cube RT), 287–289 (6 faces) |
| 404 | Built-in lighting in view space | Beh | OK | WebGLLights.js:551–635 (lights × viewMatrix) |
| 412 | VS per vertex → clip pos; FS per fragment → color | Gen | GENERAL-OK | gl_Position / fragment output |
| 412 | Overdraw reruns fragments | Gen | GENERAL-OK | |
| 413 | Attribute, uniform, varying definitions | Gen | OK | |
| 413 | Varyings interpolated | Gen | IMPRECISE | `flat` exists (GLSL ES 3.00) |
| 414 | position local; modelMatrix → world | Beh | OK | three.js built-ins (modelMatrix = matrixWorld) |
| 414 | normalMatrix → view-space normals | Beh | OK | WebGLRenderer.js:2160–2161; script shows it depends on the camera |
| 415 | Swizzle sets .xyzw .rgba .stpq | Gen | GENERAL-OK | GLSL ES spec |
| 415 | Z-up→Y-up needs a sign flip | Gen | GENERAL-OK | (x,y,z)→(x,z,−y) keeps handedness |
| 416 | mix, step, smoothstep, clamp, fract, mod, dot, reflect | Gen | GENERAL-OK | GLSL ES built-ins |
| 416 | step ≠ smoothstep | Gen | GENERAL-OK | |
| 417 | No implicit int→float | Gen | GENERAL-OK | GLSL ES 3.00 "no implicit conversions" (Khronos) |
| 417 | mediump loses range on mobile | Gen | GENERAL-OK | GLSL ES precision minimums; three.js defaults to highp (WebGLCapabilities.js:85) |
| 418 | ShaderMaterial; onBeforeCompile | API | OK | exist (script); pair onBeforeCompile with customProgramCacheKey |
| 418 | Misconception: must rebuild lighting | Beh | OK | onBeforeCompile keeps the built-in chunks |
| 419 | dFdx, dFdy, fwidth | Gen | GENERAL-OK | GLSL ES 3.00 core; three.js flat shading uses them (normal_fragment_begin.glsl.js:6–7) |
| 419 | AA lines without geometry | Gen | RULE-OF-THUMB | fwidth grid technique |
| 420 | gl_FragCoord device pixels, bottom-left | Gen | GENERAL-OK | Khronos gl_FragCoord (lower-left, 0.5 centers) |
| 420 | Includes DPR | Beh | OK | canvas.width = width × pixelRatio (:683) |
| 421 | Uniform branches cheap | Gen | RULE-OF-THUMB | |
| 421 | discard disables early-z | Gen | RULE-OF-THUMB | Khronos wiki: "almost always" on some hardware; say "can disable" as L356 does |
| 422 | Debug output as color | Gen | OK | |
| 426 | Fragment cost × res × DPR² | Gen | RULE-OF-THUMB | |
| 426 | VS reruns in shadow passes | Beh | IMPRECISE | WebGLShadowMap.js:428–441 (depth material, not yours) |
| 427 | State spaces per variable | Proc | OK | |
| 435 | Triage categories | Gen | RULE-OF-THUMB | |
| 436 | Nothing-renders checklist | Gen | RULE-OF-THUMB | |
| 437 | AxesHelper, ArrowHelper, Box3Helper, CameraHelper, GridHelper, PlaneHelper | API | OK | core exports (script) |
| 437 | VertexNormalsHelper | API | OK | addon: examples/jsm/helpers/VertexNormalsHelper.js |
| 437 | CameraHelper shows shadow frustums | Beh | OK | `new CameraHelper(light.shadow.camera)` |
| 438 | ArrowHelper origin/parent matters | Beh | OK | ArrowHelper(dir, origin, length); dir must be unit length |
| 439 | elements column-major | Beh | OK | script: set(1..16) → [1,5,9,13,...] |
| 439 | Translation at 12–14 | Beh | OK | script: makeTranslation(7,8,9) → [7,8,9] |
| 439 | Negative determinant = mirrored | Beh | OK | script: makeScale(−1,1,1).determinant() = −1 |
| 439 | set() is row-major | API | OK | script |
| 440 | Degenerate cases (normalize, lookAt, zero scale, ray–plane) | Beh | IMPRECISE | script: zero vector, no NaN, zero matrix, null |
| 440 | NaN spreads silently | Gen | GENERAL-OK | IEEE 754 in JS and GLSL |
| 441 | Visibility, layers, override material | API | OK | Layers; scene.overrideMaterial (script) |
| 442 | Spector.js shows calls, state, textures, source | Gen | GENERAL-OK | |
| 443 | Compile logs vs injected code and line numbers | Beh | OK | WebGLProgram.js:15–26, 58–74 (±6 lines of the full source) |
| 444 | Wireframe, MeshNormalMaterial, depth material, UV checker | API | OK | exist (script) |
| 444 | MeshNormalMaterial as a space check | Beh | IMPRECISE | view space (meshnormal.glsl.js:76) |
| 448 | Helper placement is a space decision | Gen | OK | |
| 449 | Remove helpers before measuring | Gen | RULE-OF-THUMB | |
| 457 | Merge, instance, batch, atlas, share materials | API | OK | mergeGeometries (BufferGeometryUtils.js:133), InstancedMesh, BatchedMesh (not named) |
| 457 | Instancing doesn't fix fill rate | Gen | RULE-OF-THUMB | |
| 458 | Cap / lower DPR | API | OK | setPixelRatio (:640) |
| 459 | Render on demand | Gen | OK | |
| 460 | Reuse scratch objects | Gen | RULE-OF-THUMB | |
| 461 | Per-object frustum culling with bounds | Beh | OK | :1892, 1914 (frustumCulled / intersectsFrustum) |
| 461 | LOD | API | OK | LOD class; autoUpdate in projectObject |
| 461 | Instanced bounds | Beh | OK | InstancedMesh.boundingSphere (script); BatchedMesh.perObjectFrustumCulled |
| 462 | alphaTest instead of blending | Gen | RULE-OF-THUMB | alphaTest = discard; alphaHash also exists |
| 463 | Cheaper materials, fewer lights, smaller shadow maps | Gen | RULE-OF-THUMB | |
| 463 | Misconception: Physical = Standard cost | Beh | IMPRECISE | WebGLPrograms.js:140–146; transmission pass (:1782) |
| 464 | Size, compress, share, mipmap | Gen | RULE-OF-THUMB | |
| 465 | Pre-compile, pre-upload, spread work, workers | API | OK | compile/compileAsync (:1396, 1515), initTexture (:3595) |
| 466 | renderer.info.memory plus heap snapshots | API | OK | WebGLInfo.js:5–8 {geometries, textures} |
| 467 | Adaptive quality with hysteresis | Gen | RULE-OF-THUMB | |
| 479 | SDF negative inside; min/max; smoothstep mask | Gen | RULE-OF-THUMB | standard convention (Quilez); not fetched |
| 480 | Perlin/simplex smooth and deterministic | Gen | RULE-OF-THUMB | not fetched |
| 481 | Worley = distance to nearest feature point | Gen | RULE-OF-THUMB | Worley 1996; not fetched |
| 482 | fBm octaves; sub-pixel octaves alias | Gen | RULE-OF-THUMB | |
| 483 | Curl noise divergence-free | Gen | GENERAL-OK | Bridson et al., SIGGRAPH 2007 |
| 484 | Mask remap and combine ops | Gen | RULE-OF-THUMB | |
| 485 | Large time loses precision | Gen | GENERAL-OK | float32 mantissa; GLSL ES precision rules |
| 486 | Frame 0 cell depends on UV origin | Beh | OK | three.js UVs bottom-left; Texture.flipY true (script) |
| 487 | Spawn rate per second | Gen | RULE-OF-THUMB | Niagara convention; not fetched |
| 488 | Euler step order | Gen | IMPRECISE | it's semi-implicit Euler (Gaffer on Games) |
| 489 | Camera-plane vs camera-position facing | Beh | OK | three.js Sprite offsets in view XY (sprite.glsl.js:15, 33) |
| 490 | Soft particles use scene depth | Gen | OK | DepthTexture exists |
| 491 | Additive order-independent, never darkens | Beh | IMPRECISE | needs depthWrite:false (default true) |
| 491 | Additive still overdraws | Gen | GENERAL-OK | |
| 495 | Unreal quad overdraw view | Gen | GENERAL-OK | Epic "Viewport Modes" (optimization view modes) |
| 496 | Baking noise trades math for memory | Gen | RULE-OF-THUMB | |
| 497 | Lerp, Frac, ComponentMask, DDX/DDY, Noise, SphereMask | Gen | GENERAL-OK | Epic Material Expression Reference |
| 497 | HLSL lerp, frac, saturate | Gen | IMPRECISE | leaves out fmod vs mod sign difference (Microsoft Learn) and ddx/ddy |
| 505 | Ray–plane plus grab offset | API | OK | Ray.intersectPlane / Plane |
| 506 | Projection onto local axis → world | Gen | OK | |
| 507 | face.normal local→world via "the normal matrix" | Beh | IMPRECISE | face.normal is local (script); object.normalMatrix is view space (:2161) |
| 508 | GPU picking readback stall | Beh | OK | sync readRenderTargetPixels; async exists (:3216) |
| 509 | Raycast cost: depth vs triangles | Gen | RULE-OF-THUMB | measured drill |
| 510 | Constant-size labels, occlusion | Gen | OK | |
| 511 | Bounds fit plus frame-rate-independent damping | Gen | OK | |
| 512 | Mirrored variant inside-out after baking | Beh | OK | live: front face flips on det<0 (:1200); baked: applyMatrix4 keeps winding (script) |
| 513 | Chrome black on mobile (env, formats) | Gen | RULE-OF-THUMB | |
| 514 | Packed map plus swizzle debug | Beh | OK | see 397 |
| 515 | DPR² proof, adaptive DPR | Gen | OK | |
| 516 | Upload and compile hitch, warm-up | Beh | OK | compileAsync / initTexture |
| 517 | Stencil vs post outline | Beh | OK | needs `stencil:true` (:76) |
| 518 | Normals as color | Beh | IMPRECISE | MeshNormalMaterial is view space (see 444) |
| 519 | Disposal and leak detection | Beh | OK | renderer.info.memory |
| 523–536 | Coverage checklist | Proc | OK | repo process rules; no three.js claims to test |
