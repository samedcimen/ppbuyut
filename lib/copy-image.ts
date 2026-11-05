/**
 * Copies an image (served by /api/proxy, so same-origin) to the clipboard, to
 * paste straight into a chat or document. Browsers accept only PNG images on
 * the clipboard, so other formats are redrawn as PNG first.
 */

export function canCopyImage() {
  return typeof navigator !== "undefined" && !!navigator.clipboard?.write && typeof ClipboardItem !== "undefined";
}

async function asPng(url: string): Promise<Blob> {
  const blob = await (await fetch(url)).blob();
  if (blob.type === "image/png") return blob;
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  return new Promise((resolve, reject) =>
    canvas.toBlob((png) => (png ? resolve(png) : reject(new Error("PNG conversion failed"))), "image/png"),
  );
}

export async function copyImage(url: string) {
  // The item takes a promise: Safari requires the clipboard write to start
  // right in the click, before the image has been fetched.
  await navigator.clipboard.write([new ClipboardItem({ "image/png": asPng(url) })]);
}
