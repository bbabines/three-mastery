The code assumed transposing `matrixWorld` undoes it, but translation and scale require its true inverse, so the stored local hit was wrong.
