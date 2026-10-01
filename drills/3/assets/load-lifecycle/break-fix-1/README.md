---
id: 3.assets.load-lifecycle.break-and-fix.1
loop: 3
tier: light
concepts: [assets.load-lifecycle, assets.preload-lazy]
mode: break-and-fix
context: assets.load-lifecycle/error-states
lenses: [cost]
misconceptions: []
---

# Preloading: a failed variant reported as ready

> **The job:** preload likely-next variants and report a failed load as a failure.

## Task

`preloadLikely(items, load)` receives URLs tagged as likely or unlikely next choices. It should load only likely choices and resolve with the loaded results, or reject if one of those loads fails. The starter correctly skips unlikely choices, but a failed likely load silently becomes `null` in the result list.

Fix the failure path, name the effect on the loading state in `cause.md`, and write a regression assertion in `check.ts`. Try both buttons in the scene.

<div data-scene="preload"></div>

## Measure

Preloading trades startup bytes and memory for a faster likely-next selection. Record how many assets are fetched with the likely filter and how many would be fetched if everything were preloaded.

## Your code

Edit `drills/3/assets/load-lifecycle/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/assets/load-lifecycle/break-fix-1

## The check

The acceptance test checks the successful results, skipped unlikely URLs, and rejection from a failed likely load. The regression check must catch the swallowed error.

<details><summary>Hint</summary> A catch that returns a value changes a rejected promise into a resolved one. </details>

## Where else?

Where else is an honest failure state better than an empty success?

<details><summary>A few answers</summary> A missing HDR environment, a failed texture transcode, or an optional part that needs a fallback. </details>
