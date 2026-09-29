---
id: assets.preload-lazy
name: Preload vs lazy load
domain: assets
tier: light
prerequisites: [assets.decode-upload-compile, assets.reuse-caching]
misconceptions:
  preload-everything: '"Preload everything."'
contexts:
  likely-next: Likely-next variant
  off-screen: Off-screen models
  priority: Priority ordering
---

## Definition

Preloading gets a model ready before it's asked for, so it appears at once but costs startup time and memory; lazy loading waits until it's asked for, which saves both but makes the user wait the first time.

## Cost lens

Everything preloaded costs its download before or alongside the first view, and its memory for as long as it's kept. Everything lazy-loaded costs a wait, for download, decode, upload, and compile, the first time it's used.
