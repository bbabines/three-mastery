---
id: tactile.maps.page
elective: tactile
kind: page
concepts: [tactile.maps]
---

# The maps, and checking a download

> **In short:** Each map carries one part of a material, roughness and metalness multiply their maps, and a download has to be checked before you trust it.
>
> **Used for:** Fabric and leather options in a configurator, scanned props in a game, architectural finishes, and any material bought or downloaded from a library.

## Why it works

### Each map's job

The **color map** is the material's color with no light in it. The **roughness map** says where it's glossy and where it's matte. The **normal map** tilts the surface pixel by pixel, so bumps catch light without any real geometry. The **AO map** darkens creases, but only for the HDRI's light.

Switch each one off under a raking light, then under a light from the front. The normal map matters most when light skims the surface; from the front, both sides of each bump get about the same light and the relief goes flat.

<div data-scene="eachMap"></div>

### Roughness and metalness multiply their maps

`roughness` isn't a setting next to the map: three.js multiplies the map by it. At 1, the map's values come through as scanned. At 0.5, every value halves, and a matte leather turns glossy. The map holds the real values already, so start at 1.

`metalness` works the same way, reading the packed map's blue. For anything that isn't bare metal it should be 0: leather, fabric, wood, stone, and paint, even paint on steel. Try "1, no map" to see what metal does to a color: the diffuse light goes and the color becomes a tinted mirror.

<div data-scene="values"></div>

### Normal maps have a direction

A normal map stores each tilt as a color: red for left-right, green for up-down. Two conventions disagree on green. three.js expects **OpenGL** style, where green means "tilted up"; **DirectX** style, used by many game tools, flips it. Read the wrong way and lit from above, every crease turns into a bright ridge and every bump sinks, while light from the side shows nothing wrong. So check from above.

`normalScale.y = -1` flips green as the map is read. Try it on each map, with the light from above and then from the side.

<div data-scene="normalStyle"></div>

### Checking a download

A thumbnail hides most problems, so look at each map on its own before you light anything. The color map should be evenly lit: shading on one side of every bump means a lamp was photographed into it, and no setting takes that out. Roughness should follow wear and texture, not light. Metalness should be black for anything that isn't bare metal. And the normal map's red and green should show the same bumps, the green lit from above.

Each problem here is one real downloads have: light painted into the color map, a DirectX normal map, a packed map that claims the scuba suede is 50–80% metal, and the brown leather's green channel showing a different, fainter pattern than its red.

<div data-scene="inspect"></div>

## The code

### Start from the scan's values

```js
material.roughnessMap = arm;  // reads green
material.roughness = 1;       // multiplies the map: 1 keeps it as scanned
material.metalness = 0;       // not metal: leather, fabric, wood, stone, paint
material.metalnessMap = null; // or arm (reads blue), only for bare metal you've checked
```

### A DirectX normal map

```js
material.normalMap = normal;
material.normalScale.set(1, -1); // flip green as it's read
```

A glTF file's normal maps are OpenGL style by the format's rules, and GLTFLoader sets `normalScale` itself, often to (1, −1), so leave a loaded model's alone. This is for maps you load by hand.

### Look at one channel

```js
// fragment shader: show the packed map's blue (metalness) as gray, no lighting
gl_FragColor = vec4(vec3(texture2D(arm, vUv).b), 1.0);
```

## What's off?

Each scene starts with something wrong. The counter says how many things are still off, not which.

<div data-scene="offSuede"></div>

<div data-scene="offLeather"></div>

## How it goes wrong

- **"A downloaded scan is right as it is."** Libraries make mistakes: metalness on fabric, a flipped or broken normal map, light baked into the color. Look at each map before you use it.
- **Matte material turned glossy.** `roughness` was set to 0.5 with a map. It multiplies; set it to 1.
- **Leather or fabric looks dark and metallic.** Metalness came from a packed map that's wrong. Set `metalness = 0` and drop the map.
- **Creases look like ridges with the light above, fine from the side.** "A normal map can't be upside down," but a DirectX one is, for three.js. Set `normalScale.y = -1`, or flip the green channel in the file.
- **Crisp from the side, mushy from above.** The normal map's green is broken, not flipped. No setting fixes it; find another download.
- **The material looks lit from one side wherever the light goes.** Light is baked into the color map. Use a delit scan.

<div data-mark-done></div>
