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
| Hit face normal | The mesh's own space |
| Object transform | Maps the mesh into world space |
| Returned normal | World direction |

## Your code

Write it in `drills/2/queries/intersection-anatomy/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/intersection-anatomy/implement-1
```

## The check

The test uses rotation and uneven scale, compares to the normal matrix, and checks that the input normal stays unchanged.

<details><summary>Hint</summary>

A direction transform is wrong for a normal under non-uniform scale.

</details>

## Where else?

Where else does a local face normal need a world direction?

<details><summary>A few answers</summary> Surface markers, decals, or aligning an object to a hit. </details>
