The code removed children while its indexed loop walked the same array. Removing one shifts the next helper past the loop index, so marked helpers must be collected first and removed afterward.
