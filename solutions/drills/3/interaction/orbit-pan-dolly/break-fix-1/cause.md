The code moved the camera for focus but left OrbitControls.target at the old point. The next orbit used that stale center; camera and target must move together.
