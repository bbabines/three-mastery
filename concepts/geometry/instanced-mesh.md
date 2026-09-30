---
id: geometry.instanced-mesh
name: InstancedMesh
domain: geometry
tier: light
prerequisites: [geometry.object-types-tour, geometry.bounding-volumes, transforms.compose-decompose]
misconceptions:
  different-materials: '"Instances can use different materials."'
contexts:
  repeated-hardware: Repeated hardware
  select-instance: Selection by instanceId
  instance-color: Per-instance color
---

## Definition

An InstancedMesh draws one geometry with one material many times in a single draw call, each copy placed by its own matrix and optionally tinted by its own color.

## Space lens

Each copy's matrix, set with `setMatrixAt`, is measured from the InstancedMesh itself, so moving the InstancedMesh moves every copy. Its own `boundingSphere` is measured from the InstancedMesh too, around all the copies.

## Cost lens

One draw call for every copy, though the GPU still processes every copy's vertices. After the first draw, changed matrices or colors re-upload their whole buffer when marked with `needsUpdate`.
