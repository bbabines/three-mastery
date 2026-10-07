---
id: jewelry.ceramic-pearl.page
elective: jewelry
kind: page
concepts: [jewelry.ceramic-pearl]
---

# Ceramic and pearl from lighting alone

> **In short:** Glossy ceramic and pearl need no textures: a plain color with the right roughness reflects the room, and the room supplies all the detail.
>
> **Used for:** Ceramic and enamel jewelry, pearls, glossy painted parts on a product, and soap-bubble or oil-film effects.

## Evidence

Spring's pink flowers and its red inner band are ceramic, and three pearls sit among its leaves. Their material files hold:

| Material | Color | Metalness | Roughness | Texture maps |
| --- | --- | --- | --- | --- |
| `ceramic_rosa` (the flowers) | `#cf7c7c` | 0 | 0 | none |
| `ceramic_red_2` (the inner band, "Metal 03" in the file) | `#8d2727` | 0 | 0 | none |
| `pearl_rose_2` (the pearls) | `#ba7547` | 0.967 | 0.25 | none |

- **No textures at all.** No color map, no bump map, no normal map. Each ceramic is a color and two zeros.
- **The pearl has one extra:** iJewel's own thin-film layer, stored as `WEBGI_materials_thin_film_layer`, with `hasThinFilm: true`, a `filmFactor` of 0.315, and three sets of four numbers. iJewel doesn't document what each one does. A thin film is what gives a soap bubble its colors.
- **three.js loads the pearl without it.** GLTFLoader keeps extensions it doesn't know in `material.userData.gltfExtensions`, so the pearl arrives with `iridescence` 0.
- **The shapes are plain too.** The 20 petals are one 1,984-triangle shape, and the 3 pearls one 1,280-triangle sphere.

Pick a material to see its settings, read from the file as three.js loads it.

<div data-scene="reference"></div>

## Why it works

### The room is the detail

A glazed ceramic is a colored body under a thin layer of clear glass. The glass is smooth, so it reflects like a faint mirror. That's all `metalness: 0, roughness: 0` says: the body's own color, plus a sharp, colorless reflection on top. Everything that reads as "glossy", the tiny sharp highlights of the room's lights and the way they slide over the curves as it turns, is the room in that reflection. It moves when the camera moves, so no painted texture could do it.

**Roughness** blurs the reflection. At 0 the room's lights stay sharp, which reads as glaze; around 0.5 they smear into a soft sheen, which reads as plastic. Light it with one lamp instead of the room, and the reflection has only that lamp to show: one small highlight on each curve.

**Analogy: a lake.** Water has no pattern of its own. Look straight down from the dock and you see through it; look across it and it's a mirror of the trees and sky, so everything on its surface comes from around it.

Drag **roughness**, switch to **one lamp**, then turn **clearcoat** on with roughness high.

<div data-scene="glaze"></div>

**Clearcoat** is the other way to glaze: a separate clear layer, with its own roughness, over the whole material. The body can be soft while the coat stays sharp, like a matte tile dipped in clear glaze. iJewel's ceramic doesn't need it, since it's smooth all the way through.

### Edges reflect more

Anything that isn't metal reflects little when you look at it head-on and much more at a low angle, as at the lake. This is the **Fresnel effect** ("freh-NEL"). Glaze reflects about 4% of the room head-on and nearly all of it at the very edge, which is why a glossy ball has a bright rim and a petal's curled edges look wetter than its middle. three.js does it for every Standard and Physical material, with no setting.

Both shapes below use Spring's dark red ceramic. Tilt the tile toward the edge, and orbit to watch the ball's rim.

<div data-scene="edges"></div>

<details>
<summary>The math, if you're curious</summary>

three.js estimates it with **Schlick's approximation**: reflected share = F0 + (1 − F0) × (1 − cos θ)⁵, where θ is the angle from head-on and F0 is the share head-on, 0.04 for glaze. At 80° from head-on, that's about 41%.

</details>

### A pearl is a soft reflection with a film

A real pearl isn't metal, but its surface is many thin, see-through layers, and each one reflects a little. Together they reflect far more than one coat of glaze, and they tint it. iJewel imitates that with metalness 0.967, nearly all reflection tinted by the color, and roughness 0.25 to blur the room into a soft glow.

Light bouncing between the top and bottom of a very thin layer adds a second effect: some colors cancel and others grow, depending on the layer's thickness and the angle you see it at. That's a **thin film**, and the color shift is **iridescence**. iJewel draws it with its own layer. three.js has one built in, `MeshPhysicalMaterial`'s `iridescence`: a strength from 0 to 1, and a film thickness in nanometers that picks which colors appear.

The film matters more than it sounds. Loaded without it, Spring's pearl looks like polished copper; with it, the same numbers read as a rose pearl. Drag **iridescence** and **film thickness**, and orbit to see the colors move with the angle. Then try **white paint**.

<div data-scene="pearl"></div>

## The code

What a developer types to build these looks. The same materials, ready to import, are in `electives/jewelry/ceramic-pearl/materials.ts`.

### Glazed ceramic

```js
const ceramic = new THREE.MeshStandardMaterial({
  color: 0xcf7c7c, // the body's color, as sRGB hex, the way the .pmat stores it
  metalness: 0,    // not a metal: its own color shows, under a faint, colorless reflection
  roughness: 0,    // and that reflection stays sharp: the glaze
});
```

Every glossy material here needs `scene.environment` set; the two lighting files page loads iJewel's.

### A glaze over a softer body

```js
const glazed = new THREE.MeshPhysicalMaterial({
  color: 0xcf7c7c, roughness: 0.6,      // a soft body...
  clearcoat: 1, clearcoatRoughness: 0,  // ...under a sharp, clear coat
});
```

### A pearl

```js
const pearl = new THREE.MeshPhysicalMaterial({
  color: 0xba7547, metalness: 0.967, roughness: 0.25, // iJewel's numbers
  iridescence: 0.6,                                   // the film's strength, 0 to 1
  iridescenceThicknessRange: [100, 400],              // nanometers; with no thickness map, only 400 is used
});
```

`clearcoat` and `iridescence` exist only on `MeshPhysicalMaterial`. Turning either on from 0 builds a new shader once; three.js does that on its own, with no `needsUpdate`.

### Give Spring's pearls a film

```js
model.traverse((part) => {
  const film = part.material?.userData.gltfExtensions?.WEBGI_materials_thin_film_layer;
  if (film?.hasThinFilm) part.material.iridescence = 0.6; // three.js's film, in place of iJewel's
});
```

GLTFLoader already makes Spring's pearl a `MeshPhysicalMaterial`, because the file gives it an index of refraction.

## How it goes wrong

- **"Glossy materials need texture maps."** They don't. A glossy surface's detail is the room it reflects, and it moves with the camera, which a texture can't. Spring's ceramic and pearls have none. When a glossy product looks flat, fix the environment before adding maps.
- **It looks like plastic.** Roughness around 0.4 to 0.6 blurs the room into a smear. Glaze is 0 to about 0.1; or keep the soft body and add a clearcoat.
- **"More lights make a glossy surface look shinier."** A smooth surface shows each lamp as one small highlight, and nothing else. Set `scene.environment`. Blender's material preview lights everything with its own studio picture, so a file that looks glossy there can arrive flat in three.js.
- **"A pearl is a white ball."** White, metalness 0, and middling roughness give a matte bead with no sheen. Make it nearly all reflection (metalness about 0.97), slightly blurred (roughness 0.25), and tinted.
- **An oil slick.** Iridescence near 1 turns the pearl hot pink and green. Keep the strength moderate, around 0.5, and add it last, after the reflection looks right.
- **The pearl looks like copper.** Spring's pearl numbers without a film are a tinted metal. Add `iridescence`, as in the code above.
- **Candy-colored ceramic.** A fully saturated color looks like candy or plastic. Spring's pink is a dusty rose and its red is dark; the reflection adds the brightness.
- **Iridescence or clearcoat does nothing.** It was set on a `MeshStandardMaterial`. Passed to the constructor, three.js warns that it's "not a property"; set afterward, it's ignored without a word. Use `MeshPhysicalMaterial`.

<div data-mark-done></div>
