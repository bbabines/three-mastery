---
id: vfx.sprite-facing
name: Sprite facing
domain: vfx
prerequisites: [rotation.lookat-up, camera.view-matrix]
misconceptions:
  camera-plane-is-position: '"Facing the camera plane equals facing the camera position." They differ away from the screen center.'
contexts:
  smoke: Smoke
  streaks: Motion streaks
  ground: Ground-aligned rings
---

## Definition

Sprite facing turns a flat image toward either the camera position, camera plane, motion direction, or a chosen axis.

## Cost lens

Billboards reduce geometry but their transparent pixels can overdraw large screen areas.
