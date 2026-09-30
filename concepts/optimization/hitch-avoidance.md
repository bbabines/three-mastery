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

Hitch avoidance keeps the one-time work of showing something new out of the frame the user is watching, by doing it early, spreading it out, or moving it off the main thread.

## Cost lens

The same total work, moved to moments when nothing is expected to change, or split so no single frame misses its refresh. Decoding in workers uses other CPU cores instead of the main thread.
