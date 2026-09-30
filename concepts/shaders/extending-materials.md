---
id: shaders.extending-materials
name: Extending materials
domain: shaders
tier: light
prerequisites: [shaders.built-in-matrices, materials.materials-tour]
misconceptions:
  rebuild-lighting: '"A custom shader must rebuild lighting from scratch."'
contexts:
  highlight: Highlight on a standard material
  inject-uniforms: Injecting uniforms
  dissolve: Dissolve effect
---

## Definition

To change how something is drawn, you either write both shaders yourself or keep a built-in material, lighting and all, and patch a few lines of its shader before it compiles.

## Cost lens

Each patched variant is its own shader program, compiled the first time it's drawn. A patch that moves vertices also belongs on the mesh's depth material, which the shadow pass draws again for every shadow-casting light.
