The code treated hit.face.normal as a world direction. Raycast face normals are local; uneven scale requires a world normal matrix before using one to orient a marker.
