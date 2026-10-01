The code read geometry.boundingBox in the mesh’s local space. A parent move or turn does not change that box; setFromObject after a world-matrix update yields world bounds.
