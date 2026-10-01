The code treated triangle positions in the index buffer as vertex numbers. Indexed geometry may reuse vertices in any order, so each corner must be looked up through geometry.index first.
