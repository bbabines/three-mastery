---
id: effects.progressive
name: Progressive smoothing
domain: effects
prerequisites: [gpu.multisampling, gpu.multi-pass, gpu.render-targets]
misconceptions:
  antialias-every-edge: '"`antialias: true` smooths every edge."'
  same-cost: '"Averaging costs the same every frame."'
contexts:
  still-shot: A still product shot or export
  fine-detail: Thin parts and fine texture that shimmer
  noisy-effects: Calming noisy screen-space effects
---

## Definition

Progressive smoothing draws each still frame from a slightly different spot inside every pixel and averages the frames, so edges, highlights, and fine texture come out clean once the view stops moving.

## Cost lens

While it averages, it draws the scene once a frame, like an unsmoothed frame. Once the set number of frames is in, it stops drawing the scene until the view moves again.
