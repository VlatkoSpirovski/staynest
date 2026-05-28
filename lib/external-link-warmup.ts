export function warmExternalOrigin(url?: string | null) {
  if (!url || typeof document === "undefined") return;

  try {
    const origin = new URL(url).origin;
    const selector = `link[data-staynest-warm-origin="${origin}"]`;

    if (document.head.querySelector(selector)) return;

    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = origin;
    link.crossOrigin = "anonymous";
    link.dataset.staynestWarmOrigin = origin;
    document.head.appendChild(link);
  } catch {
    // Ignore invalid external URLs; the link itself can still handle them.
  }
}
