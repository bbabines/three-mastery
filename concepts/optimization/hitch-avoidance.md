---
id: optimization.hitch-avoidance
name: Hitch avoidance
domain: optimization
tier: light
prerequisites: [assets.decode-upload-compile, gpu.frame-budget]
misconceptions:
  load-only-delay: '"Load time is the only delay."'
contexts:
  first-click: First-click hitch
  variant-switch: Variant-switch hitch
  route-transitions: Route transitions
---

## Definition

Hitch avoidance keeps the one-time work of showing something new, like compiling shaders and uploading textures, out of the frame where the user is watching, by doing it early, spreading it over several frames, or doing it off the main thread.

## Cost lens

The same total work, moved. Compiles and uploads still cost main-thread and GPU time, but in moments when nothing is expected to change, or split so that no single frame misses its refresh. Decoding in workers uses other CPU cores instead of the main thread.
