// Pages switch without a reload, so whatever a page starts (renderers, frame loops, observers)
// registers a stop here, and the viewer runs them all when you leave the page.
const stops: (() => void)[] = [];

// A container that's already gone was mounted after you left a page that was still loading.
export function onLeave(container: HTMLElement, stop: () => void) {
  if (container.isConnected) stops.push(stop);
  else stop();
}

export function leavePage() {
  for (const stop of stops.splice(0)) stop();
}
