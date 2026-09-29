---
id: rotation.slerp
name: Slerp
domain: rotation
tier: light
prerequisites: [rotation.quaternions, math.lerp]
misconceptions:
  lerp-euler: '"Lerping Euler angles is equivalent."'
contexts:
  camera-transitions: Camera orientation transitions
  face-target: Turning to face a target
  blending: Blending orientations
---

## Definition

Slerp blends between two turns by a fraction t, turning at an even speed along the shortest way round.

## Space lens

Both quaternions must be measured from the same place, like two `object.quaternion` values under the same parent; the blend is measured from there too.
