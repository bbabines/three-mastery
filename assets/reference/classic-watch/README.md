# WebGi classic watch study reference

Featured asset confirmed by Brad October 11, 2026. Source: https://webgi.dev/ ; documented sample: https://asset-samples.threepipe.org/demos/classic-watch.glb . The public site's `https://webgi.dev/watch-2.glb` had identical SHA-256: `fe2dcb2fdd7ce16e564ae3c2732b07c69c034a5f2626ae3b365bcc08b86a84d9`.

The original GLB is untouched. `manifest.json` records source URLs, byte counts, and hashes. `viewer.json` retains the WebGi viewer configuration saved inside the GLB; `audit.json` extracts the source material and extension evidence. Six embedded images are extracted without re-encoding. The external leather normal JPG and studio EXR are copied from their exact saved resource URLs.

The saved configuration is from WebGi 0.9.22. The live site is the newer threepipe-based WebGi (three r163 underneath), set up by its own page code, so much of `viewer.json` is not what renders there. For example, the file saves environment intensity 0.771; the live site uses 1. What the live site actually renders is recorded in `reference-capture.json`.

`reference-webgi.png` (WebGi's default view) and `reference-webgi-front.png` (same distance and height, facing the dial) were captured from the live site on October 12, 2026 by `electives/product/tools/capture-source.mjs --headed`: the real GPU through the installed Chrome, light mode, interaction prompt off, hands at the GLB's rest pose, the site's showcase effects pinned, and only after its 32-frame accumulation settled. `reference-capture.json` records both cameras, the canvas size, which effects were on, and the live light, ground, environment, and tone-mapping settings. The earlier capture was taken on a software GPU right after load, mid-animation, with the interaction cursor showing; it is replaced.

`fetch-reference.mjs` rewrites `manifest.json` from the files it downloads and does not know about the two captures, so re-add their entries after running it.

Attribution: WebGi/Threepipe by repalash and Pixotronics/iJewel3D; original external leather map is served by realvwr. The source file does not establish the watch model's author or a separate commercial asset license. These files are retained for study, not as a storefront asset license.

Read `electives/product/README.md` for measured values, native-rendering boundaries, and the reproducible fetch/measurement/capture tools.
