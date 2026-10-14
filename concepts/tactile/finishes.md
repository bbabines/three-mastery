---
id: tactile.finishes
name: 'Finishes: sheen, clearcoat, and limits'
domain: tactile
prerequisites: [tactile.maps, materials.pbr, shaders.extending-materials]
misconceptions:
  sheen-alone: '"sheen: 1 makes velvet."'
  clearcoat-everywhere: '"Clearcoat on everything adds realism."'
contexts:
  upholstery: Velvet and suede upholstery options in a sofa configurator
  furniture: A varnished wooden table on a furniture site
  car-paint: Car paint with a clear coat in a vehicle viewer
---

## Definition

Sheen adds the soft edge glow of fibers (it needs a sheenColor, which starts black), clearcoat adds a clear glossy layer over the material, and neither belongs on materials that don't have one; light scattering inside wax or skin isn't in three.js's materials and has to be faked.

## Cost lens

Sheen and clearcoat each add lighting work for every pixel and light, and a clearcoat normal map adds a texture read. A shader-added glow costs a few math steps per light. Transmission costs the most: an extra render of the scene behind the object.
