The code used a fixed per-frame lerp fraction. At a higher refresh rate it applies more steps per second; a damping fraction based on delta time keeps the motion consistent.
