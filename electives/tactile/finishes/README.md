---
id: tactile.finishes.page
elective: tactile
kind: page
concepts: [tactile.finishes]
---

# Finishes: sheen, clearcoat, and limits

> **In short:** Sheen adds the soft glow of fuzz, clearcoat adds a clear glossy layer on top, and each belongs only on materials that really have one.
>
> **Used for:** Velvet and suede upholstery, varnished wood furniture, car paint and lacquered parts, and knowing when a material like wax or skin needs more than three.js offers.

## Why it works

### Sheen: fuzz needs a color

Velvet and suede are covered in tiny fibers. Where the surface turns away from you, you look along the fibers and they catch light: a soft glow at the edges that no map carries. **Sheen** adds that layer to `MeshPhysicalMaterial`.

`sheen` is how much, `sheenColor` is its color, and `sheenRoughness` how far it spreads. three.js multiplies the sheen by its color, and `sheenColor` starts black, so `sheen: 1` alone changes nothing. A lighter tint of the fabric's own color usually looks right. Try each color, and watch the roll's edges.

<div data-scene="sheen"></div>

### Clearcoat: a clear layer on top

Some finishes have two reflections: a clear layer on top, and the material under it. Varnished wood is one: a sharp reflection from the varnish over the softer sheen of the grain. **Clearcoat** adds that top layer, with its own `clearcoatRoughness`. It uses the shape's own normals, so it stays smooth over a bumpy base, like a thick coat; `clearcoatNormalMap` makes it follow the bumps, like a thin one.

This wood scan was photographed varnished, so its gloss is already in its roughness map, and a coat doubles it. Raise the roughness under the coat to make the wood under it satin, then add the coat. Then try the coat on the leather, the steel, and the fabrics.

<div data-scene="clearcoat"></div>

### What three.js can't do: wax and skin

In wax, skin, marble, and milk, light goes in, spreads around inside, and comes out somewhere else. That's **subsurface scattering**, and it's why a candle glows at its edges when lit from behind. `MeshPhysicalMaterial` doesn't do it: light stops at the surface. `transmission` lets light through, but as glass does, blurred by roughness; nothing spreads inside.

What's left is to fake it: add light where the key is behind a thin part. The scene's glow is a few lines added to the shader. The room is dim, so the light behind the candle does the work; switch it to the front and the glow disappears. The `SubsurfaceScatteringShader` add-on and the WebGPU `MeshSSSNodeMaterial` use the same trick. Skin works the same way, and needs it more: without it, faces look like plastic.

<div data-scene="wax"></div>

## The code

### Velvet

```js
material.sheen = 1;
material.sheenColor.set(0xff6f8a); // lighter than the velvet; black, the default, shows nothing
material.sheenRoughness = 0.45;    // how far the glow spreads from the edges
```

### Varnish over wood

```js
material.roughness = 2.5;            // the map × 2.5: satin wood under the coat
material.clearcoat = 1;              // a clear layer on top
material.clearcoatRoughness = 0.1;   // glossy; at 0.05 it mirrors the room like glass
```

`roughness = 2.5` works because three.js multiplies the map by it and caps the result at 1. A glTF file can't carry it: glTF's `roughnessFactor` tops out at 1, so a model exported for another viewer needs a brighter roughness map instead.

### A back-light glow

```js
// added after #include <lights_fragment_end>, for each DirectionalLight
vec3 through = normalize(directionalLights[i].direction + normal * 0.3);
float facing = pow(saturate(dot(geometryViewDir, -through)), 3.0);           // looking toward the light
float thin = 0.15 + 0.85 * pow(1.0 - saturate(dot(normal, geometryViewDir)), 2.0); // most at the edges
reflectedLight.directDiffuse += directionalLights[i].color * diffuseColor.rgb * facing * thin * 1.5;
```

## What's off?

Each scene starts with something wrong. The counter says how many things are still off, not which.

<div data-scene="offVelvet"></div>

<div data-scene="offLeather"></div>

## How it goes wrong

- **"sheen: 1 makes velvet."** Not on its own: `sheenColor` starts black, and the sheen is multiplied by it. Set a color.
- **Chalky, dusty edges.** The sheen is white, or it's on a material with no fuzz. Tint it from the fabric, or take it off.
- **"Clearcoat on everything adds realism."** It adds a second, sharp reflection, which only coated materials have. On fabric it looks wet; on leather it makes patent leather.
- **Varnished wood looks like glass.** The scan's gloss is already in its roughness map. Raise the roughness under the coat, or leave the coat off.
- **A candle or a hand lit from behind looks like stone.** There's no subsurface scattering in `MeshPhysicalMaterial`. Fake the glow, or light it from the front.

<div data-mark-done></div>
