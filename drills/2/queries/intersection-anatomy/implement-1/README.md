---
id: 2.queries.intersection-anatomy.implement.1
loop: 2
tier: core
concepts: [queries.intersection-anatomy]
mode: implement
context: queries.intersection-anatomy/orient-marker
lenses: [space]
misconceptions: []
---

# Hit anatomy: a world normal

> **The job:** Turn a hit face normal into a direction in world space.

## Task

A raycast hit face normal is local to the mesh. Return a world-space unit normal using the object's normal matrix. The mesh may have non-uniform scale.

| Function | Return |
| --- | --- |
| `worldHitNormal(normal: THREE.Vector3, object: THREE.Object3D)` | The hit face normal in world space. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/queries/intersection-anatomy/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/intersection-anatomy/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

A direction transform is wrong for a normal under non-uniform scale.

</details>

## Where else?

Where else would the same code help? The concept card lists Painting at a UV, Picking an instance.
