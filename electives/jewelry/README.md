# Jewelry look-dev: reference files

The pages take apart iJewel's playground (playground.ijewel3d.com/v2/), so they load iJewel's own files from `assets/reference/ijewel/`. Git ignores that folder: the files are iJewel's, kept for study only, never committed and never shipped in the Shopify app. On a new machine, put them back before opening a page:

```
assets/reference/ijewel/
  Spring.glb                         the Spring brooch, exported from the playground
  hdr/env_metal_011_172e446a13.exr   the environment the metal reflects
  hdr/env_gem_001_b9c4533e70.exr     the environment the gems reflect
  materials/                         .pmat and .dmat files, from fetch-materials.mjs
  textures/                          the wood's two maps, from fetch-materials.mjs
```

1. Open the playground, load the Spring sample, and download the model and both environments into the folders above.
2. Fetch the material files and textures that `Spring.glb` points to:

   ```bash
   node electives/jewelry/tools/fetch-materials.mjs
   ```

`tools/exr-peek.mjs` prints an environment's brightness and writes a preview at a chosen exposure, since an `.exr` opened as a normal image looks blank white.
