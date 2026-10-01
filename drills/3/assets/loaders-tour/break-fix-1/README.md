---
id: 3.assets.loaders-tour.break-and-fix.1
loop: 3
tier: light
concepts: [assets.loaders-tour, assets.draco-meshopt]
mode: break-and-fix
context: assets.loaders-tour/compressed-model
lenses: [cost]
misconceptions:
  - assets.loaders-tour/loader-alone
---

# Compressed models: one decoder was never attached

> **The job:** prepare a glTF loader for both common compressed-geometry paths.

## Task

`configureCompressed` receives a glTF loader and already-created Draco and Meshopt decoders. A Draco-compressed product loads, but a Meshopt-compressed product fails before its geometry reaches the GPU. Fix the setup, name the missing preparation in `cause.md`, then write the regression assertion in `check.ts`.

<div data-scene="decoders"></div>

## Measure

When comparing Draco and Meshopt assets, record downloaded bytes and decode time separately. A smaller download does not prove faster startup or lower runtime GPU memory.

## Your code

Edit `drills/3/assets/loaders-tour/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/assets/loaders-tour/break-fix-1

## The check

The acceptance test checks that each decoder reaches its matching setter. The regression assertion must reject a loader configured for only one compression format.

<details><summary>Hint</summary> GLTFLoader does not create its optional decoders for you. </details>

## Where else?

Where else does file support depend on setup outside the basic loader?

<details><summary>A few answers</summary> KTX2 textures, environment maps, and browser-supported transcoding formats. </details>
