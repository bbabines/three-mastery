The code multiplied the vertex index by the position item size, ignoring the larger stride of the shared interleaved buffer. It overwrote the wrong values and never marked that buffer for upload.
