---
id: jewelry.capstone
name: The whole piece in your own code
domain: jewelry
prerequisites: [jewelry.pro-file, jewelry.two-environments, jewelry.polished-metal, jewelry.ceramic-pearl, jewelry.small-textures, jewelry.gem-shader, jewelry.finishing]
misconceptions:
  one-big-fix: '"One setting will make it look real."'
  blame-the-model: '"If it looks off, the model is bad."'
contexts:
  diagnose-viewer: Diagnosing a product viewer that looks off
  configurator: A metal and stone configurator
  own-models: Running your own models through the recipe
---

## Definition

The playground's look is a stack of separate pieces, each fixing one thing: a clean model, two environments, plain polished materials, tiling textures, a traced gem shader, tone mapping, and finishing passes.

## Cost lens

The gem shader is the biggest cost, GPU work for every pixel the stones cover. The finishing passes add a few full-screen passes, and everything else costs about the same as any lit material.
