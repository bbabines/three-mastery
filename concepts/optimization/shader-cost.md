---
id: optimization.shader-cost
name: Shader and material cost
domain: optimization
tier: light
prerequisites: [materials.materials-tour, gpu.pipeline-stages]
misconceptions:
  physical-always-costly: '"MeshPhysicalMaterial always costs much more than MeshStandardMaterial." With clearcoat, sheen, and transmission at 0 it''s close; each feature turned on adds shader work, and transmission adds a full extra render of the opaque scene.'
contexts:
  mobile-fallback: Mobile fallback
  many-lights: Many lights
  shadow-cost: Shadow cost
---

## Definition

A material's cost is the work its shader does for every pixel it covers, which grows with the material type, each feature switched on, the number of lights, and shadows.

## Cost lens

Pixel work for every pixel a mesh covers, with lighting work for each light that reaches it. Each shadow-casting light renders the casting meshes again every frame, six times for a point light, and transmission renders every solid object again every frame. Changing a material's type or features, or the number of lights, also builds new shader programs (the decode, upload, compile page).
