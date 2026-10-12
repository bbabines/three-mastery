---
id: product.tactile-materials.page
elective: product
kind: page
concepts: [product.tactile-materials]
---

# Tactile materials and texture scale

> **In short:** A tactile surface combines believable feature size, small shading changes, and lighting that makes those changes visible.
>
> **Used for:** Leather straps, fabric upholstery, wood grain, rubber grips, and brushed metal.

## Evidence

The watch's strap records roughness `0.4732`, metalness `0.3257`, normal scale `(0.3, -0.3)`, and normal texture repetition `(3, 3)`. Its leather normal map lives in a custom material extension, not the standard glTF normal slot. Loading only the standard material silently loses a major part of the look. The restored external texture uses repeat wrapping, `flipY: true`, and non-color data interpretation.

The nonzero strap metalness is an artistic reference setting. Ordinary leather is dielectric: use metalness `0` when building a physically based leather material. Compare both rather than adopting the reference value as a universal leather rule.

Isolate the restored normal map, then compare lighting with the material locked. The roughness variation switch adds clearly labeled synthetic study data; it is not a map extracted from the watch.

<div data-scene="leatherLab"></div>

## Why it works

**Normal detail** changes the shading direction at each pixel. **Roughness detail** changes how broadly a reflection spreads. **Base color detail** changes surface color. Those channels describe different facts; a dark pore is not automatically rougher, deeper, or less metallic.

**Analogy:** a textured countertop can look smooth beneath broad, even light. Move a lamp across it and small slopes catch different amounts of light. The surface was present in both views; the second lighting reveals it.

Uniform illumination can hide grain because nearby surface directions see similar light. A directional source or a gradient in the environment makes small differences more visible. A useful reflection band should reveal grain while retaining enough fill to read dark leather. Increasing normal strength under featureless lighting can distort the surface without solving visibility.

**Texture scale** is the feature size relative to the product. Larger repetition makes each grain smaller. The reference's repeat `3` is meaningful only with its UV layout. It is not three grains per centimeter. A fabric weave, wood grain, and leather pores each need their own reference scale and directional mapping; reusing one leather normal map cannot reproduce all three materials.

At distant views, small features occupy less than a screen pixel. Filtering then averages them. Judge grain at the configurator's default view and closest permitted zoom, and inspect movement for sparkle or crawling edges.

### Choose the right surface response

**Sheen** adds the soft grazing response used for fabric fibers. **Anisotropy** stretches highlights along a surface direction, useful for brushed metal. **Clearcoat** adds a separate reflective layer, useful for a coating. Each needs evidence from the real finish; adding every layer does not make a surface more realistic.

The cover's custom anisotropy value is `0.8364`. Its direction texture uses WebGi settings that are not automatically translated into three.js's anisotropy encoding. The following scene demonstrates a UV-aligned three.js adaptation with adjustable direction. The strap sheen and coating are comparison studies, not effects claimed to exist in the source leather. The rubber study changes surface response while retaining leather grain and strap geometry; it is not a complete rubber asset.

<div data-scene="finishLayers"></div>

## The code

The controls run these operations in `scenes.ts`.

### Restore the leather detail

```js
strap.normalMap = normalTexture;
normalTexture.colorSpace = THREE.NoColorSpace;
normalTexture.repeat.set(3, 3);
strap.normalScale.set(0.3, -0.3); // this asset's orientation
```

The negative Y is a reference-specific orientation choice. Do not apply it to every normal map. When adding or removing a map, set `material.needsUpdate = true` so the shader uses the correct variant.

### Separate surface channels

```js
strap.metalness = 0; // dielectric leather
strap.roughness = 0.47;
strap.roughnessMap = studyTexture; // non-color data; shader reads green
```

The green-channel map multiplies the scalar roughness. It does not replace it. Author roughness from finish evidence, not by automatically copying color brightness.

### Add a justified layer

```js
physical.sheen = 0.5; // cloth comparison
physical.sheenColor.set('#b3c2d5');
cover.anisotropy = 0.8; // brushed-metal comparison
cover.anisotropyRotation = THREE.MathUtils.degToRad(45);
```

These properties require `MeshPhysicalMaterial`. They add shader work when enabled. A three.js anisotropy map stores direction in red/green and strength in blue; a source map with another encoding needs conversion.

## Exercises

1. Keep normal strength `0.3`, repetition `3`, and roughness fixed. Compare uniform, reference, and graduated lighting. Acceptance: save one view where grain is readable and explain the illumination change that revealed it.
2. Compare normal only, roughness only, both, and neither from one close camera. Acceptance: identify shading-direction changes separately from reflection-width changes, and label the synthetic map honestly.
3. Compare repeat `1`, `3`, and `12`, then orbit and zoom out. Acceptance: identify oversized grain and detail that averages away; select a scale supported by the actual reference, not maximum crispness.
4. Compare dielectric versus reference leather. Then rotate a brushed highlight and inspect sheen at grazing angles. Acceptance: explain why each response belongs to a particular finish and why it does not supply geometry or a new texture pattern.

## How it goes wrong

| Symptom | Cause and repair |
| --- | --- |
| Grain is invisible | First compare illumination and zoom. Keep map strength fixed while diagnosing. |
| Leather looks inflated or etched | Normal amplitude is exaggerated or oriented incorrectly. Restore the measured reference and check the bake convention. |
| Every material has the same pores | The texture pattern and scale were reused without evidence. Acquire maps for the actual material. |
| Roughness follows printed decoration | Color was mistaken for finish data. Author the channels independently. |
| Brush highlights turn at UV seams | Direction frames disagree. Repair UV/tangent alignment and map encoding. |
| Cloth looks like varnished leather | Sheen, clearcoat, grain pattern, and base roughness describe different finishes. Remove unjustified layers. |

Explain whether your weakest view needs a different material, a different light, or more screen pixels. Save the settings that support that diagnosis.

<div data-mark-done></div>
