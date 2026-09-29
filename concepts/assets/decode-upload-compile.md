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

Between a file arriving and a model appearing, three jobs run: decoding the file's packed data into arrays and pixels, uploading those to the GPU, and compiling a shader program for each new kind of material; decoding happens during the load, and three.js does the other two on the first render that draws the model unless you ask for them earlier.

## Cost lens

Decoding is CPU time, mostly off the main thread: Draco runs in workers and the browser decodes images. Uploading and compiling happen during a render, and the main thread waits for them, so when they're big they show up as a frozen frame.
