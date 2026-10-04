/**
 * Downloads an image served by /api/proxy. The proxy sets Content-Disposition
 * with the right file name and extension, so a plain same-origin link is enough.
 */
export function downloadImage(proxyUrl: string) {
  const a = document.createElement("a");
  a.href = `${proxyUrl}&download=1`;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
