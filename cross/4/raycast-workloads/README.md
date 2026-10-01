---
id: 4.scene-graph.traverse.cross.1
loop: 4
tier: core
concepts: [scene-graph.traverse, queries.filtering, gpu.measurement]
mode: cross-domain
context: gpu.measurement/timing-frame
lenses: [cost]
misconceptions: []
---

# Raycast cost: deep hierarchy vs high triangle count

> **The job:** combine ideas from several domains in one small piece of code.

## Task

Write `measureRaycasts(raycaster, hierarchy, dense, repeats)` to time repeated recursive raycasts against a deep object tree and repeated direct raycasts against one dense mesh. Return each hit count and elapsed milliseconds. The times vary by device: report measurements rather than imposing a speed threshold.

<div data-scene="workloads"></div>

## Measure

Run both cases in the scene and write down the times and hit counts. Repeat after changing only one dimension: tree depth or triangle count. Use Chrome's performance panel to inspect where the CPU time goes.

## Your code

Write it in `cross/4/raycast-workloads/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/raycast-workloads
```

## The check

The check verifies both branches are actually raycast the requested number of times, the hierarchy search is recursive, and the returned times are finite and nonnegative.

<details><summary>Hint</summary>

Use the relevant three.js methods shown on the concept pages. Make the result observable before trying to optimize it.

</details>

## Where else?

Where else would this choice appear in an interactive 3D tool?
