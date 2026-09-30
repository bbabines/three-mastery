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

Preloading gets a model ready before it's asked for and lazy loading waits until it is, trading startup time and memory against a wait on first use.

## Cost lens

A preloaded model costs its download alongside the first view, and its memory for as long as it's kept. A lazy-loaded one costs a wait for download, decode, upload, and compile the first time it's used.
