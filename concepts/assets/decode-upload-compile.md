---
id: assets.decode-upload-compile
name: Decode, upload, compile
domain: assets
tier: core
prerequisites: [assets.load-lifecycle]
misconceptions:
  renders-instantly: '"Once loaded, it renders instantly."'
contexts:
  first-interaction-hitch: First-interaction hitch
  variant-switch: Variant switch
  prewarm: Pre-warming with compileAsync
---

## Definition

Before a loaded model can be drawn, its data is decoded, uploaded to GPU memory, and given compiled shader programs, and three.js leaves the last two for the first render that draws it.

## Cost lens

Decoding is CPU time, mostly off the main thread. Uploading and compiling happen during a render while the main thread waits, so when they're big they show up as a frozen frame.
