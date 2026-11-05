// Builds the browser extension: icons from the site icon, then a zip for the
// Chrome Web Store (dist/ppbuyut-extension-<version>.zip).
//   node scripts/build-extension.mjs
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateRawSync } from "node:zlib";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const extension = join(root, "extension");
const { version } = JSON.parse(readFileSync(join(extension, "manifest.json"), "utf8"));

mkdirSync(join(extension, "icons"), { recursive: true });
for (const size of [16, 32, 48, 128]) {
  await sharp(join(root, "public/icons/icon-512.png"))
    .resize(size, size)
    .png()
    .toFile(join(extension, "icons", `${size}.png`));
}

const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });

/** A plain deflate zip (no dependency needed for a handful of files). */
function zip(paths) {
  const local = [];
  const central = [];
  let offset = 0;
  for (const path of paths) {
    const name = Buffer.from(relative(extension, path).replaceAll("\\", "/"));
    const data = readFileSync(path);
    const packed = deflateRawSync(data);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x0800, 6); // UTF-8 names
    header.writeUInt16LE(8, 8); // deflate
    header.writeUInt32LE(0x00210000, 10); // 1980-01-01, so builds are reproducible
    header.writeUInt32LE(crc32(data), 14);
    header.writeUInt32LE(packed.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(name.length, 26);
    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50, 0);
    entry.writeUInt16LE(20, 4);
    entry.writeUInt16LE(20, 6);
    header.copy(entry, 8, 6, 30); // flags … name length
    entry.writeUInt32LE(offset, 42);
    local.push(header, name, packed);
    central.push(entry, name);
    offset += header.length + name.length + packed.length;
  }
  const size = central.reduce((n, b) => n + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(paths.length, 8);
  end.writeUInt16LE(paths.length, 10);
  end.writeUInt32LE(size, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, ...central, end]);
}

mkdirSync(join(root, "dist"), { recursive: true });
const out = join(root, "dist", `ppbuyut-extension-${version}.zip`);
writeFileSync(out, zip(files(extension)));
console.log(`Icons written; ${out}`);
