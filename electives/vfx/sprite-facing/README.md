---
id: vfx.sprite-facing.page
elective: vfx
kind: page
concepts: [vfx.sprite-facing]
renderer: webgpu
---

# Sprite facing

> **In short:** A flat sprite can face the camera's position, face parallel to its image plane, follow velocity, or turn only around an upright axis.
>
> **Used for:** Smoke puffs, fast motion streaks, and ground-aligned markers.

## A · The basics

Hold two cards at opposite ends of a wide table. Turning both exactly parallel to your camera's screen is not quite the same as turning each toward your eye. The difference grows near the screen edges. Orbit the viewer: the blue card faces the camera position; the orange card stays upright while turning around Y.

<div data-scene="preview"></div>

## B · Going deeper

### The code and TSL you type

```js
const target = camera.position.clone();
if (lockY) target.y = sprite.position.y;
sprite.lookAt(target);
```

| Code or TSL | GLSL | Unreal / Niagara | Purpose |
| --- | --- | --- | --- |
| `lookAt(camera.position)` | view-direction basis | Camera Facing | Points a card at the eye. |
| `target.y = sprite.y` | flattened direction | Axis Locked | Keeps a card upright. |
| `normalize(velocity)` | normalized vector | Velocity Alignment | Aims a streak along motion. |

Three.js `Sprite` provides camera-facing geometry; a mesh plane and a custom orientation give more control. A camera-plane billboard shares one orientation across the screen, while point-facing planes differ at the edges. Their transparent pixels can still overdraw large areas.

**Common mistake:** copying the camera quaternion when the effect needs each plane to face the camera's *position*.

## Exercise · Build it

Write `faceCamera` in `drill.ts`. Return a plane's quaternion for camera-position facing, optionally locked to Y; preserve both vectors. Run `npm run drill -- electives/vfx/sprite-facing`. The check includes a plane away from screen center.
