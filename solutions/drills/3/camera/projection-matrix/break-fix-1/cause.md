The code reversed width and height when building the camera aspect. PerspectiveCamera expects width divided by height, so portrait and landscape framing were swapped.
