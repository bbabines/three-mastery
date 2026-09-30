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

A load runs while the page carries on and ends in one of two ways: with the loaded objects, or with an error.

## Cost lens

Downloading and parsing happen before the load is done. Uploading the result to the GPU and compiling its shaders happen after, on the first render that draws it.
