---
id: 2.assets.reuse-caching.apply.1
loop: 2
tier: light
concepts: [assets.reuse-caching, assets.preload-lazy]
mode: apply
context: assets.reuse-caching/variant-swaps
lenses: [cost]
misconceptions: []
---

# Cache: reuse one request and choose a preload

> **The job:** Keep one promise per URL and prefetch only an asset likely to be needed.

## Task

Return the same cached Promise for repeated URLs; call the loader once. From a list of upcoming assets, return the first likely item that fits a byte budget, or an empty string.

| Function | Return |
| --- | --- |
| `cachedLoad(url: string, cache: Map<string, Promise<string>>, load: (url: string) => Promise<string>)` | The cached Promise for that URL. |
| `nextPreload(items: { url: string; likely: boolean; bytes: number }[], budgetBytes: number)` | The first likely asset within the remaining byte budget. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/assets/reuse-caching/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/assets/reuse-caching/apply-1
```

## The check

The tests require one promise and one load for repeated URLs, then choose a likely preload within the byte budget.

<details><summary>Hint</summary>

Cache the Promise immediately so two callers before completion still share one request.

</details>

## Where else?

Where else should repeated asset requests share pending work?

<details><summary>A few answers</summary> Duplicate rack parts, swatch variants, or a likely next model. </details>
