---
id: optimization.leak-detection
name: Leak detection
domain: optimization
tier: core
prerequisites: [assets.disposal, gpu.measurement]
misconceptions:
  slow-growth-fine: '"Counts that grow slowly are fine."'
contexts:
  spa-routes: SPA route changes
  variant-cycling: Variant cycling
  long-sessions: Long sessions
---

## Definition

Leak detection finds memory that should have been freed but wasn't, by repeating one load-and-unload cycle and checking that the counts come back to where they started.

## Cost lens

GPU memory, JavaScript memory, or both, lost on every cycle and never given back. A leak too small to notice once grows through a long session, until the page slows, the WebGL context is lost, or the tab reloads.
