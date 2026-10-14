---
id: tactile.whats-off.page
elective: tactile
kind: page
concepts: [tactile.whats-off]
---

# What's off? Diagnose and fix

> **In short:** When a material looks wrong, name what you see, check the light before the maps, and change one thing at a time, because a broken scene usually has more than one cause.
>
> **Used for:** Fixing a product viewer someone else lit, reviewing a configurator before launch, answering "why does this look fake?", and judging a scan before you buy more.

## How to diagnose

### Start from the symptom

Say what looks wrong in plain words, the way someone would report it: "the leather looks plastic", "the product floats". Each symptom points to a few suspects, and most come from the light or the settings, not the texture.

| What you see | Check first |
| --- | --- |
| Plastic, wet, or glassy | `roughness` on top of the map, a clear coat, a key from the front |
| Flat, every material alike | the HDRI, the key's angle, a fill light |
| Floating | the shadow's bias, the key against the HDRI |
| Wrong or faded color | the HDRI's tint, tone mapping, the color map's color space |
| Metallic | `metalness` read from a packed map |
| Wrong size | `texture.repeat` against the scan's real size |
| Crawling far away | mipmaps |

### Light first, then maps, then scale

**Maps decide what it is, light decides whether it feels touchable, and scale decides whether it's believable.** So check in that order of suspicion: light first. Swap in gray clay and look at the gray ball. If the clay looks flat too, no map will save it. If the clay looks right, look at each map's settings, then its size.

### One change at a time

Change one thing, look, and keep it or undo it. Change three at once and you can't tell which one helped, or whether one undid another. Expect more than one cause: the first fix often makes the next problem easier to see, and sometimes makes it look worse for a moment.

## What's off?

Each scene starts broken in two or three ways, mixing mistakes from the earlier units. The counter says how many things are still off, not which. "Show the answer" names each cause and the unit that teaches it. Some controls look like fixes and aren't.

Someone already swapped the texture here.

<div data-scene="offPlastic"></div>

A velvet sofa option, with its sheen already turned up.

<div data-scene="offFelt"></div>

A tabletop scan on a sample board and a plank.

<div data-scene="offWood"></div>

Fix one cause at a time and watch the roll: each fix alone leaves it floating.

<div data-scene="offFloat"></div>

Try gray clay before anything else.

<div data-scene="offFlat"></div>

Fix the metalness first, then look again before calling it done.

<div data-scene="offMetallic"></div>

Plain polished rings: no maps at all, so it can only be the light.

<div data-scene="offRings"></div>

A concrete floor seen from standing height. Tick "move the camera slowly" first.

<div data-scene="offCrawl"></div>

## How it goes wrong

- **"If it looks off, the texture is bad."** Settings stay on the material whatever maps you load, so a new download keeps every mistake. Check gray clay, the light, and the settings first; replace a scan only when you've seen its maps are wrong.
- **"One fix will do."** Most broken scenes have two or three causes, and one fix can make the next show more. Keep going until it looks right, not until something changed.
- **Changed everything at once, and now it's worse.** Undo, then change one thing at a time.
- **The first fix made it look worse.** It uncovered a second cause: with the suede's metalness fixed, the AmbientLight added for the "metal" washes it pale. Keep going.

<div data-mark-done></div>
