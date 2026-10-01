The code enabled blending but left depth writes on. The transparent pane then filled the depth buffer as though it were opaque and hid surfaces behind it.
