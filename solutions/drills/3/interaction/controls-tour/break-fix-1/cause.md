The code left OrbitControls enabled during a gizmo drag, so both controls reacted to the same pointer. Orbit must be disabled while dragging and updated when it resumes.
