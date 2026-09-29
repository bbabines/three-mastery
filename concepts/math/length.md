---
id: math.length
name: Length and lengthSq
domain: math
tier: light
prerequisites: [math.point-vs-direction]
misconceptions:
  needs-real-length: '"Comparing distances needs the real length."'
contexts:
  nearest-object: Nearest-object search
  radius-check: Radius check
  speed-clamp: Speed clamp
---

## Definition

A vector's length is how far it reaches in a straight line, and lengthSq is that length multiplied by itself, which is quicker to get and just as good for comparing lengths with each other (square any fixed limit you compare against).

## Cost lens

lengthSq skips a square root. That only matters in loops over many vertices or objects.
