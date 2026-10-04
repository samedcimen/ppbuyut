const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

/**
 * Downloads an image with a proper filename. Falls back to opening it in a new
 * tab when the host doesn't allow cross-origin reads.
 *
 * TODO(backend): route through `/api/proxy`, which sets Content-Disposition.
 */
export async function downloadImage(url: string, baseName: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    const ext = EXT_BY_TYPE[blob.type.split(";")[0]] ?? "jpg";
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${baseName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
