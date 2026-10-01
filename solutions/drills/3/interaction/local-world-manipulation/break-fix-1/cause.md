The code added a world-space delta directly to a local position. Under a rotated parent that local X is not world X, so the desired world point must be converted back into parent space.
