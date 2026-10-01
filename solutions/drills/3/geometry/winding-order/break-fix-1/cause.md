The code flipped stored lighting normals but left the triangle vertex order untouched. Back-face culling uses winding order, so the triangles must reverse their corners.
