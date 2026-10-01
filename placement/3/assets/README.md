---
id: 3.assets.placement
loop: 3
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

# Placement check: assets

No docs or three.js source. Write every function from memory, then run `npm run pick -- done` once. The check records missed parts, and passing all parts suggests skipping this domain's drills.

| Function | Returns |
| --- | --- |
| `needsDraco(extensions: string[])` | Whether a Draco decoder must be attached. |
| `primitiveCount(document: { meshes: { primitives: unknown[] }[] }, meshIndex: number)` | The number of glTF primitives for one mesh index. |
| `loadState(completed: boolean, failed: boolean)` | The current async load state. |
| `preuploadTexture(renderer: Pick<THREE.WebGLRenderer, "initTexture">, texture: THREE.Texture)` | The same texture after requesting an early GPU upload. |
| `chooseGeometryCodec(dracoBytes: number, dracoDecodeMs: number, meshoptBytes: number, meshoptDecodeMs: number, maxDecodeMs: number)` | The chosen codec from measured decode and payload costs. |
| `rgbaTextureBytes(width: number, height: number, mipmaps: boolean)` | Approximate raw RGBA bytes; compressed KTX2 may use less. |
| `geometryArrayBytes(geometry: THREE.BufferGeometry)` | The total bytes of unique attribute and index arrays. |
| `cachedLoad(url: string, cache: Map<string, Promise<string>>, load: (url: string) => Promise<string>)` | The cached Promise for that URL. |
| `disposeMeshOwned(mesh: THREE.Mesh, shared: Set<THREE.Material | THREE.BufferGeometry | THREE.Texture>)` | The number of unique owned resources disposed. |
| `nextPreload(items: { url: string; likely: boolean; bytes: number }[], budgetBytes: number)` | The first likely asset within the remaining byte budget. |
