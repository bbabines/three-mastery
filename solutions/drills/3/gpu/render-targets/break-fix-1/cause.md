The code drew into an offscreen framebuffer but never rebound the default screen framebuffer, so the next frame still targeted the thumbnail.
