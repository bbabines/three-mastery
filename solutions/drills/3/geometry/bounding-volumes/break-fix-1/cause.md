The code edited the position attribute but returned the cached sphere. Direct attribute edits do not update geometry bounds; computeBoundingSphere must run again before culling uses them.
