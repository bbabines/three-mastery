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
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/queries/intersection-anatomy/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/intersection-anatomy/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

An intersection has object, point, distance, and optional instanceId fields.

</details>

## Where else?

Where else would the same code help? The concept card lists Orienting a marker, Painting at a UV.
