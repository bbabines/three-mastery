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

> **The job:** Measure whether picking cost comes from tree depth or triangle density.

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

Keep the same ray and repeat count for both workloads; report the measurements before choosing an acceleration strategy.

</details>

## Where else?

Where would this comparison change a picking design?

<details><summary>A few answers</summary>

A deep product assembly, a scanned mesh, or hover selection over hundreds of parts.

</details>
