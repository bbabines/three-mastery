The code used the camera's world transform, which moves camera-space coordinates in the wrong direction. The inverse camera transform is needed for world to view.
