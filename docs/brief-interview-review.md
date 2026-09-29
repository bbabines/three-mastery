# Brief: changes from the interview-readiness review

Sep 29, 2026 · Brad

**Status: applied Sep 29, 2026, except item 5's fixes.** Brad approved items 1–4 and 6 as written, plus a seventh tour, renderer settings. They're in `concept-inventory.md`, `writing-pages.md`, `domains.ts`, and `CLAUDE.md`, and the first tour page (Tour: the Object3D API) is built for Brad's review. Item 5's report is done, in `docs/r186-check/`; a separate session is applying its fixes. Item 6 needed no change: the Domain 2 commit had already updated the status. The "Needs Brad" notes below are kept as the record of what was asked.

## Why

Two reviews rated how well someone who finishes this repo would do in a verbal and live-coding three.js interview on an unknown domain. They agreed that the teaching is accurate. The main gaps were thin breadth basics and some unverified or out-of-date r186 claims.

The goal this brief serves: a solid base of three.js knowledge and syntax, built over 1–2 years and kept fresh. The aim is to excel at Loops 3 and 4 (diagnosis and judgment), which is what sets a developer apart in the AI era. Loops 1–2 are the foundation for them.

## Out of scope for this repo

These are covered elsewhere, so the reviews' points about them are set aside:

- React Three Fiber and drei: studied separately when needed.
- TSL and WebGPU: a separate tutorial and side project.
- Speaking answers aloud: practiced in a separate setup, closer to an interview.
- Animation (`AnimationMixer`, clips): left out for now.

## Decisions

### 1. Blank-file drills go last

A drill set that starts from an empty file (renderer, scene, camera, resize, loop) is deferred to the very end. Setting up a project from scratch is rare, and people use the docs when they do.

The concepts it would teach are already in the loops, as shown below. The only change needed now is making sure the pages show the exact syntax in their B sections:

| Piece | Where it lives | Syntax to show in B |
| --- | --- | --- |
| DPR and its cost | Primer; Domain 14 Resolution and DPR; Domain 9 Pointer events; Domain 12 Fragment coordinates | `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` |
| Resize | Domain 4 Aspect and resize | `renderer.setSize(w, h, false)`, `camera.aspect = w / h`, `camera.updateProjectionMatrix()` |
| Fit a model to the camera | Domain 4 Fit to bounds | `Box3.setFromObject`, `getBoundingSphere` |
| Disposal | Domain 6 Disposal ownership | `geometry.dispose()`, `material.dispose()`, `texture.dispose()` |

### 2. Add tour pages

Tour pages are light-tier Loop 1 pages that cover a family of classes rather than one idea. Interviews often open with these basics before going deep. Each tour goes at the start of the domain it belongs to, so `domains.ts` stays the single teaching order.

| Tour | Domain | Covers |
| --- | --- | --- |
| Object3D API | 2, before Local vs world | position, rotation, scale, quaternion, add, remove, attach, getWorldPosition and friends, lookAt, visible, layers, userData |
| Object types | 5 | Mesh, InstancedMesh, BatchedMesh, Points, Line and LineSegments, Sprite, Group |
| Loaders and textures | 6 | GLTFLoader, DRACOLoader, KTX2Loader, Meshopt, HDRLoader; TextureLoader, CanvasTexture, DataTexture, VideoTexture |
| Controls | 9 | OrbitControls, TransformControls, PointerLockControls |
| Renderer settings | 10 | antialias, powerPreference, setPixelRatio, setSize, outputColorSpace, toneMapping and exposure, shadowMap; added after the review |
| Materials | 11 | Basic, Lambert, Phong, Standard, Physical, Toon, Matcap, Normal, Depth |
| Lights | 11 | Ambient, Hemisphere, Directional, Point, Spot, RectArea, and each one's setup quirks |

A tour page has:

- one sentence for the family;
- a table of members with when to use each one and what it costs, in plain words;
- in A, a scene with a switcher between members;
- in B, the constructor and the three or four properties you actually set;
- the usual read-the-code drill.

Later loops give them apply and break-and-fix drills like any light concept. Examples: a Standard material that looks black with no environment map, a RectAreaLight with no init call.

**Needs Brad:**

- adding the tours to `concept-inventory.md` and `domains.ts`;
- a "tour page" variant in `writing-pages.md`;
- reviewing the first tour (Object3D) before the rest are built.

### 3. Use three.js, don't re-implement it, but write the code that uses it

The inventory has two places that ask for math three.js already provides, which clashes with the decision "never re-implement math three.js provides":

- **Domain 5, Face normals by hand** (core).
- **Domain 8,** "Drills build them by hand, then measure them", covering ray–sphere, ray–triangle (Möller–Trumbore), ray–AABB (slab method), and closest-point.

Change them so the skill is **using** normals and raycasting, not computing them:

- **Normals:** get them with three.js (`Triangle.getNormal`, `computeVertexNormals`, the `normal` attribute, `hit.face.normal`), know which space each one is in, and move them to world space correctly (`hit.normal` or `face.normal` plus the normal matrix). Rename the concept away from "by hand".
- **Raycasting:** type the raycasting code yourself, from memory. This covers:
  - pointer to NDC using the canvas rect;
  - `raycaster.setFromCamera`;
  - `intersectObject` or `intersectObjects` with the recursive flag;
  - reading the hit (`distance`, `point`, `face`, `faceIndex`, `uv`, `instanceId`, `object`);
  - filtering with layers or a target list;
  - walking up from the hit mesh to the part you care about (`traverseAncestors`, or checking `parent` and `userData`).
- **Ray shape tests:** know what `ray.intersectPlane`, `intersectSphere`, `intersectBox`, `intersectTriangle`, and `closestPointToPoint` return and when to reach for each. What they do inside is at most a "how it works" note, never a drill.

**Needs Brad:** approving the inventory wording for these changes.

### 4. Build Loop 3 before polishing Loop 4

Loop 3 (break-and-fix) is the strongest match to real interviews. When the later loops are built, Loop 3 comes first. This doesn't change the current step, which is still Loop 1 for Domains 2–14.

Because Loops 3 and 4 are the goal, each concept's list of misconceptions matters more: those become Loop 3's bugs. When writing or reviewing a page, check that each listed misconception is a mistake people really make.

### 5. Verify every r186 claim

**Done Sep 29, 2026:** the report is in `docs/r186-check/README.md`. Fixes are waiting on Brad.

Every three.js claim in the repo gets checked against the installed `three@0.186.0`, with evidence, before any more content is built on it.

- **Scope:** `concept-inventory.md`, every built page and its `questions.ts`, `CLAUDE.md`, `writing-pages.md`, and the addendum.
- **Kinds of claim:**
  - **API exists:** check the r186 exports and source.
  - **Deprecated or renamed:** look for deprecation warnings in the source.
  - **Behavior:** prove it with a small Node script where possible (math, transforms, raycasting). Read the source for rendering behavior.
  - **Not three.js-specific:** things like "Unreal uses −Y for normal-map green" or "draw-call overhead is mostly CPU". Label these separately; confirm them from official docs where possible, and mark rules of thumb as such.
- **Output:** a report listing each claim, its evidence (a file and line in `node_modules/three`, or script output), and a verdict. Fixes happen after Brad has seen the report.
- **Optional:** a test that checks every three.js name used in page snippets exists in the pinned version, so a future upgrade shows what broke.

Claims from the reviews to check first. None of these is verified yet:

- **Draw sorting** (Domain 10, State changes and sorting): the inventory says opaque objects sort front to back and by program. One review says r186 sorts opaque objects by render order, then material, then depth.
- **HDRLoader vs RGBELoader:** one review says `RGBELoader` was deprecated around r180 in favor of `HDRLoader`.
- **Missing names:**
  - `BatchedMesh` should be named under Domain 14's "batch".
  - `OutputPass` should be named in Domain 10's post-processing. Without it, a composer loses tone mapping and color-space output.
- **Dot product page wording:** the heading "Only for length-1 directions" (`drills/1/math/dot-product/read-the-code-1/README.md`) suggests the operation needs unit vectors, but only the −1 to 1 range does.

### 6. Fix stale status

`CLAUDE.md` and `README.md` say only Local vs world space is built in Domain 2. `drills/1/transforms/` now has nine pages, uncommitted.

## Order of work

1. The r186 check, then a report for Brad.
2. One inventory edit for Brad to approve, covering:
   - the fixes from the report;
   - the tour concepts;
   - the normals and raycasting wording.
3. The tour-page variant in `writing-pages.md`.
4. The Object3D tour page, for Brad's review.
5. The status updates in `CLAUDE.md` and `README.md`.

The earlier "Next" in `CLAUDE.md` still holds alongside this: Brad's review of the Domain 2 pages unblocks the rest of Domain 2.
