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

To change how something is drawn, you either write both shaders yourself with a `ShaderMaterial`, or keep a built-in material, with all its lighting, and patch a few lines of its shader with `onBeforeCompile` before three.js compiles it.

## Cost lens

Each patched variant is its own shader program, compiled the first time it's drawn. The shadow pass draws meshes with a separate depth material, so a patch that moves vertices needs the same patch on a `customDepthMaterial` (`customDistanceMaterial` for point lights), drawn again for every shadow-casting light.
