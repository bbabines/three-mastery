---
id: interaction.click-vs-drag
name: Click vs drag
domain: interaction
tier: light
prerequisites: [interaction.pointer-events]
misconceptions:
  same-object-click: '"pointerup on the same object means a click."'
contexts:
  select-vs-orbit: Select vs orbit
  tap-vs-pan: Tap vs pan
  long-press: Long press
---

## Definition

A press and a release count as a click only if the pointer barely moved in between; past a small threshold it's a drag, and pointer capture keeps a drag's events coming wherever the pointer goes.
