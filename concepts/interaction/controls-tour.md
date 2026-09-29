---
id: interaction.controls-tour
name: 'Tour: controls'
domain: interaction
tier: light
prerequisites: [transforms.object3d-tour]
misconceptions:
  damping-update: '"Damping works without calling update()."'
  add-controls: '"Add TransformControls to the scene." In r186 you add its `getHelper()`.'
contexts:
  product-orbit: Product viewer orbit
  gizmo-move: Moving a part with a gizmo
  showroom-walk: A walkthrough of a showroom
---

## Definition

Controls are three.js add-ons that turn the mouse, touch, and keys into moves: OrbitControls swings the camera around a point, TransformControls moves one object by its handles, and PointerLockControls turns the camera with the mouse like a first-person game.

## Cost lens

OrbitControls costs a little CPU math each time `update()` runs. TransformControls raycasts against its handles on every pointer move, and its handles are extra meshes to draw.
