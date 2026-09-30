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

Slerp gives the turn a fraction of the way between two turns, the way lerp does for positions.

## Space lens

Both turns must be measured from the same place, like two quaternions under the same parent, and the blend is measured from there too.
