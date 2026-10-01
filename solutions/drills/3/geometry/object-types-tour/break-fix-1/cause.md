The code moved the InstancedMesh object, which moves all copies together. A per-instance pose belongs in the instance matrix at the chosen index; the mesh bounds also need refreshing after the move.
