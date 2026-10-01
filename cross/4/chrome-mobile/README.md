---
id: 4.materials.environment-maps.cross.1
loop: 4
tier: core
concepts: [assets.ktx2, materials.environment-maps, debugging.triage]
mode: cross-domain
context: materials.environment-maps/chrome
lenses: []
misconceptions: []
---

# Chrome finish looks black on mobile

> **The job:** Choose a supported environment texture so a metal finish can reflect it.

## Task

A metal finish needs an environment to reflect, and a compressed environment may not upload on a device without the format. Write `prepareChrome(scene, material, preferred, fallback, preferredSupported)` to choose the supported environment, set it as an equirectangular reflection map, and make the material metallic. Return which source was used. Keep the fallback available for devices that cannot use the preferred texture.

<div data-scene="chrome"></div>

## Your code

Write it in `cross/4/chrome-mobile/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/chrome-mobile
```

## The check

The check covers both device branches and verifies the scene environment and material. Afterward, inspect the scene by eye: a test cannot prove chrome looks right on every display.

<details><summary>Hint</summary>

A background image is not automatically the environment light, and compressed formats need device support.

</details>

## Where else?

Where else should texture-format support decide a fallback?

<details><summary>A few answers</summary>

An HDR showroom, a compressed finish swatch, or an older device's material preview.

</details>
