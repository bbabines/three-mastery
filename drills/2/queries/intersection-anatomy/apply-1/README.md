---
id: 2.queries.intersection-anatomy.apply.1
loop: 2
tier: core
concepts: [queries.intersection-anatomy]
mode: apply
context: queries.intersection-anatomy/pick-instance
lenses: [space]
misconceptions: []
---

# Hit anatomy: identify an instance

> **The job:** Read the instance ID and world hit point from a Raycaster result.

## Task

A hit on an InstancedMesh includes `instanceId`. Return that ID, or −1 if the hit was on an ordinary Mesh. Also return the hit's world point without changing it.

| Function | Return |
| --- | --- |
| `instanceIndex(hit: THREE.Intersection)` | The instance index, or −1 for a non-instanced hit. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Hit point | World space |
| Instance ID | Index within the instanced mesh; no space |

## Your code

Write it in `drills/2/queries/intersection-anatomy/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/intersection-anatomy/apply-1
```

## The check

The test reads an instance ID when present and returns a sentinel for an ordinary mesh.

<details><summary>Hint</summary>

An intersection has object, point, distance, and optional instanceId fields.

</details>

## Where else?

Where else does the instance number identify the selected item?

<details><summary>A few answers</summary> Instanced shelf parts, repeated bolts, or a large point display. </details>
