---
id: 4.assets.placement
loop: 4
domain: assets
parts:
  - assets.loaders-tour
  - assets.gltf-structure
  - assets.load-lifecycle
  - assets.decode-upload-compile
  - assets.draco-meshopt
  - assets.ktx2
  - assets.memory-math
  - assets.reuse-caching
  - assets.disposal
  - assets.preload-lazy
---

# Placement check: Assets and runtime delivery

A no-docs check of the decisions in this domain. Write every function in `placement/4/assets/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `colorTexture` | Recognize a texture that should be treated as display color. |
| `namedMesh` | Find a named mesh inside a loaded scene. |
| `hasTextureData` | Check whether texture source data has arrived. |
| `needsFirstUseWarmup` | Decide whether first visible use can still hitch. |
| `decoderChoice` | Choose an available compressed-mesh decoder. |
| `isGpuCompressed` | Recognize a GPU-compressed texture object. |
| `rgbaBytes` | Estimate RGBA8 texture bytes across mip levels. |
| `sharesGeometry` | Check whether two parts reuse one geometry. |
| `disposeIfOwned` | Dispose a material only when this viewer owns it. |
| `shouldPreload` | Preload an asset only if near use and within memory budget. |
