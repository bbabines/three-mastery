---
id: effects.budget
name: Choosing effects for a frame budget
domain: effects
prerequisites: [effects.progressive, effects.ambient-occlusion, effects.bounced-light, effects.reflections, effects.contact-shadows, effects.motion-smoothing, effects.ground-shadow, effects.hdri-ground, effects.anisotropy, effects.transmission]
misconceptions:
  everything-lower-res: '"Turn everything on and lower the resolution."'
  desktop-is-phone: '"If it runs smoothly on my desktop, it will on a phone."'
  still-costs-same: '"A still view costs as much as a moving one."'
contexts:
  configurator: A product configurator on a storefront
  showcase: A hero product shot on a landing page
  phone-viewer: A 3D viewer on a phone
---

## Definition

Choosing effects for a frame budget means picking, for each kind of screen and for a moving and a still view, the few effects that show on the product, and measuring them on the device that has to run them.

## Cost lens

A frame's GPU time has to fit the display's frame time with room left for the browser; pixels, scene draws, and per-pixel samples are what it grows with, and a still view that averages frames can stop drawing altogether.
