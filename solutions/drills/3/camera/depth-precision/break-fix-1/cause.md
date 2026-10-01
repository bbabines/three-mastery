The code assumed perspective depth is linear in distance. It is non-linear and packs precision near the near plane, so the linear fraction predicts the wrong depth-buffer value.
