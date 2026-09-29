---
id: assets.load-lifecycle
name: Load lifecycle
domain: assets
tier: light
prerequisites: [assets.loaders-tour]
misconceptions:
  onload-no-hitch: '"onLoad means it will render without a hitch."'
contexts:
  loading-indicator: Loading indicators
  dependent-loads: Dependent loads
  error-states: Error states
---

## Definition

A load runs in the background while the page carries on, reports its progress as the file downloads, and ends by handing over the loaded objects or an error.

## Cost lens

Downloading and parsing happen before `onLoad`. Copying the result to the GPU and compiling its shaders happen after, on the first render that draws it.
