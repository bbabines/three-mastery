The code performed a synchronous pixel read, which waits for queued GPU work even for one pixel. Async readback returns a promise without blocking the main thread.
