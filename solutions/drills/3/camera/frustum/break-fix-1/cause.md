The code changed camera.aspect but kept the old projection matrix. A frustum built before updateProjectionMatrix still has the previous viewport shape.
