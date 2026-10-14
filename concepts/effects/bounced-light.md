---
id: effects.bounced-light
name: Bounced light
domain: effects
prerequisites: [gpu.multi-pass, gpu.render-targets, materials.environment-maps, materials.pbr]
misconceptions:
  sees-everything: '"Bounced light picks up color from anything in the scene."'
  ao-is-bounce: '"Ambient occlusion and bounced light are the same effect."'
  always-better: '"Turning on bounced light always makes a product look more real."'
  free-when-still: '"It costs nothing once the camera stops."'
  metal-picks-up: '"Bounced light makes polished metal pick up nearby colors."'
contexts:
  colored-prop: A product beside a colored prop
  room: A product in a room with painted walls
  crevices: Filling crevices that look too dark
---

## Definition

Bounced light (screen-space global illumination, SSGI) lets nearby surfaces light each other, using only what is on screen: a bright colored surface tints what faces it, and gaps fill with reflected light instead of going flat dark.

## Cost lens

It traces short rays through the depth of every pixel each frame, so its cost grows with the sample count and with the number of pixels. One frame is noisy, so it leans on smoothing over frames. It keeps running while the camera is still.
