---
id: 3.geometry.bounding-volumes.break-and-fix.1
loop: 3
tier: light
concepts: [geometry.bounding-volumes]
mode: break-and-fix
context: geometry.bounding-volumes/culling
lenses: []
misconceptions: []
---

# Bounding volumes: the missing vertex

> **The job:** Keep a part's bounding sphere current after moving a vertex.

## Task

`deformAndBound(geometry, index, point)` moves one local-space vertex to `point` and returns a new sphere that covers the edited geometry. The starter marks the position buffer for upload but returns the old sphere. That can make the renderer cull the part while its moved vertex should still be visible. Leave `point` unchanged.

The scene moves a vertex away from a small part. The returned sphere should grow to cover it.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/bounding-volumes/break-fix-1

## The check

The acceptance test edits a vertex beyond the old bound and checks the returned sphere. Your check should prove that a later, different edit also remains inside the bound.

<details><summary>Hint</summary>

The bounding-volumes page separates marking a buffer for GPU upload from recomputing the CPU bound used for culling.

</details>

## Where else?

What other direct shape edit can leave a stale bound?

<details><summary>A few answers</summary>

Terrain sculpting, a stretching cable, or a cloth mesh after deformation.

</details>
