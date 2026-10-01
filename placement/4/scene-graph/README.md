---
id: 4.scene-graph.placement
loop: 4
domain: scene-graph
parts:
  - scene-graph.traverse
  - scene-graph.finding-objects
  - scene-graph.safe-mutation
  - scene-graph.world-bounds
  - scene-graph.scene-stats
  - scene-graph.visibility-layers
  - scene-graph.user-data
  - scene-graph.material-override
  - scene-graph.clone-semantics
---

# Placement check: Scene graph traversal

A no-docs check of the decisions in this domain. Write every function in `placement/4/scene-graph/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `meshCount` | Count descendant meshes, including nested ones. |
| `findNamed` | Find a named descendant in the scene tree. |
| `removeNamed` | Remove matching descendants without mutating during traversal. |
| `worldBox` | Read precise world bounds of nested geometry. |
| `triangleCount` | Count indexed or non-indexed triangles in descendant meshes. |
| `makePickLayer` | Put a selectable object on one raycast layer. |
| `tagPart` | Attach a stable part ID to an object. |
| `overrideMaterial` | Swap a material while returning the original for restoration. |
| `duplicateTree` | Clone a hierarchy while preserving geometry reuse. |
