The code compared a world-space ray with a box in the object’s local space. A rotated OBB must first receive the ray in its own local frame, then its hit is mapped back to world space.
