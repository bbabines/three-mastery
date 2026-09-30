---
id: assets.draco-meshopt
name: Draco vs Meshopt
domain: assets
tier: light
prerequisites: [assets.decode-upload-compile]
misconceptions:
  gpu-memory: '"Compressed geometry uses less GPU memory." Compression is undone at decode; only quantization (KHR_mesh_quantization, which gltfpack applies by default) keeps smaller numbers on the GPU.'
contexts:
  payload-budget: Payload budget
  mobile-decode: Mobile decode time
  per-asset: Choosing per asset
---

## Definition

Draco and Meshopt are two ways to compress a glTF model's geometry, and both are undone when the model loads.

## Cost lens

Both save download time, and Draco costs more CPU time to decode. Neither changes GPU memory; only quantization, storing numbers in fewer bytes, does.
