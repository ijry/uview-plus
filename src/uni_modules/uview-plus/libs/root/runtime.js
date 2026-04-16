// Compatibility shim for stale incremental build caches.
// New root integration no longer depends on this file.

export function createGlobalUpRoot(AppRootComponent) {
  return AppRootComponent
}

export default {
  createGlobalUpRoot,
}

