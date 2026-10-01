---
id: 2.materials.environment-maps.implement.1
loop: 2
tier: core
concepts: [materials.environment-maps]
mode: implement
context: materials.environment-maps/consistent-look
lenses: []
misconceptions: [materials.environment-maps/just-background]
---

# Environment maps: consistent look

> **The job:** Use one environment texture for physically based reflections on every material in a scene, while keeping a separate background image for the camera.

## Task

Use one environment texture for physically based reflections on every material in a scene, while keeping a separate background image for the camera. Write `setStudioEnvironment(scene, lighting, backdrop)` and return the same scene. Keep its other settings.

The sphere should reflect the studio texture while the camera sees the separate backdrop.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/environment-maps/implement-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/environment-maps/implement-1
```

## The check

The test checks `scene.environment` and `scene.background` separately and requires the original scene.

<details><summary>Hint</summary> The scene has different properties for environment lighting and the visible background. </details>

## Where else?

Why can a chrome ball go black even when a sky is visible behind it?

<details><summary>A few answers</summary> A visible sky can be only `scene.background`. Chrome also needs `scene.environment` or its own `envMap`. </details>
