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

A press and a release count as a click only when the pointer stays within a small distance in between, and past that it's a drag.
