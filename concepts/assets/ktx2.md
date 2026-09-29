---
id: assets.ktx2
name: KTX2 and Basis textures
domain: assets
tier: light
prerequisites: [assets.decode-upload-compile]
misconceptions:
  jpg-memory: '"A 200 KB JPG costs 200 KB of memory." It decodes to raw RGBA.'
contexts:
  mobile-vram: Mobile VRAM budget
  swatch-library: Large swatch libraries
  texture-heavy: Texture-heavy products
---

## Definition

KTX2 is a texture file whose Basis Universal data KTX2Loader converts at load time into a compressed format the device's GPU reads directly, so the texture stays compressed in GPU memory, while a JPG or PNG is unpacked to full-size pixels however small its file.

## Cost lens

A decoded JPG or PNG costs 4 bytes a pixel on the GPU, plus a third for mipmaps. The GPU-compressed formats KTX2Loader picks cost 1 byte a pixel or less. Converting a KTX2 file costs CPU time in a worker, plus a one-time download of the transcoder.
