---
id: camera.fit-to-bounds
name: Fit to bounds
domain: camera
tier: light
prerequisites: [camera.projection-matrix]
misconceptions:
  vertical-enough: '"Vertical FOV is enough on portrait screens."'
contexts:
  focus-part: Focus on a part
  auto-frame: Auto-frame on load
  thumbnails: Thumbnail generation
---

## Definition

To frame an object, wrap it in a bounding sphere and back the camera off until the sphere fits the narrower of the view's two angles: the vertical `fov` on a wide screen, the side-to-side angle on a tall one.

## Space lens

`Box3.setFromObject` and the sphere from `getBoundingSphere` are in the world, so the camera's new position is a spot in the world, measured from the sphere's center along the way the camera looks.
