The code rebuilt normals on vertices still shared between adjacent faces. Shared vertices get averaged normals, so hard edges need separate vertices before computing per-face normals.
