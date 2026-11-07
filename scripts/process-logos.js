import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function encodePng(width, height, rgbaBuffer) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // no interlace

  const rowSize = 1 + width * 4;
  const scanlines = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const srcRow = y * width * 4;
    const destRow = y * rowSize;
    scanlines[destRow] = 0; // filter type 0
    rgbaBuffer.copy(scanlines, destRow + 1, srcRow, srcRow + width * 4);
  }

  const idatData = zlib.deflateSync(scanlines, { level: 9 });
  const idat = makeChunk('IDAT', idatData);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, makeChunk('IHDR', ihdr), idat, iend]);
}

function decodePng(filePath) {
  const buf = fs.readFileSync(filePath);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);

  let offset = 8;
  const idatChunks = [];
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IDAT') {
      idatChunks.push(buf.subarray(offset + 8, offset + 8 + len));
    }
    offset += 12 + len;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  
  // Convert scanlines to simple RGBA buffer (assuming filter 0 or handling common filters)
  const rowSize = 1 + width * 4;
  const rgba = Buffer.alloc(width * height * 4);
  
  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * rowSize];
    const srcRow = y * rowSize + 1;
    const destRow = y * width * 4;
    if (filter === 0) {
      decompressed.copy(rgba, destRow, srcRow, srcRow + width * 4);
    } else if (filter === 1) { // Sub
      for (let x = 0; x < width * 4; x++) {
        const left = x >= 4 ? rgba[destRow + x - 4] : 0;
        rgba[destRow + x] = (decompressed[srcRow + x] + left) & 0xff;
      }
    } else if (filter === 2) { // Up
      for (let x = 0; x < width * 4; x++) {
        const up = y > 0 ? rgba[(y - 1) * width * 4 + x] : 0;
        rgba[destRow + x] = (decompressed[srcRow + x] + up) & 0xff;
      }
    } else if (filter === 3) { // Average
      for (let x = 0; x < width * 4; x++) {
        const left = x >= 4 ? rgba[destRow + x - 4] : 0;
        const up = y > 0 ? rgba[(y - 1) * width * 4 + x] : 0;
        rgba[destRow + x] = (decompressed[srcRow + x] + Math.floor((left + up) / 2)) & 0xff;
      }
    } else if (filter === 4) { // Paeth
      for (let x = 0; x < width * 4; x++) {
        const a = x >= 4 ? rgba[destRow + x - 4] : 0;
        const b = y > 0 ? rgba[(y - 1) * width * 4 + x] : 0;
        const c = (x >= 4 && y > 0) ? rgba[(y - 1) * width * 4 + x - 4] : 0;
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        let pr = (pa <= pb && pa <= pc) ? a : ((pb <= pc) ? b : c);
        rgba[destRow + x] = (decompressed[srcRow + x] + pr) & 0xff;
      }
    }
  }

  return { width, height, rgba };
}

function getBoundingBox(width, height, rgba) {
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = rgba[(y * width + x) * 4 + 3];
      if (a > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, maxX, minY, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function crop(src, box, padding = 20) {
  const minX = Math.max(0, box.minX - padding);
  const maxX = Math.min(src.width - 1, box.maxX + padding);
  const minY = Math.max(0, box.minY - padding);
  const maxY = Math.min(src.height - 1, box.maxY + padding);

  const newW = maxX - minX + 1;
  const newH = maxY - minY + 1;
  const dest = Buffer.alloc(newW * newH * 4);

  for (let y = 0; y < newH; y++) {
    const srcY = minY + y;
    for (let x = 0; x < newW; x++) {
      const srcX = minX + x;
      const srcIdx = (srcY * src.width + srcX) * 4;
      const destIdx = (y * newW + x) * 4;
      dest[destIdx] = src.rgba[srcIdx];
      dest[destIdx + 1] = src.rgba[srcIdx + 1];
      dest[destIdx + 2] = src.rgba[srcIdx + 2];
      dest[destIdx + 3] = src.rgba[srcIdx + 3];
    }
  }
  return { width: newW, height: newH, rgba: dest };
}

function recolor(img, r, g, b) {
  const result = Buffer.alloc(img.rgba.length);
  for (let i = 0; i < img.rgba.length; i += 4) {
    const a = img.rgba[i + 3];
    result[i] = r;
    result[i + 1] = g;
    result[i + 2] = b;
    result[i + 3] = a; // keep alpha anti-aliasing
  }
  return { width: img.width, height: img.height, rgba: result };
}

function resize(img, newW, newH) {
  const result = Buffer.alloc(newW * newH * 4);
  const xRatio = img.width / newW;
  const yRatio = img.height / newH;

  for (let y = 0; y < newH; y++) {
    const srcY = Math.min(img.height - 1, Math.floor(y * yRatio));
    for (let x = 0; x < newW; x++) {
      const srcX = Math.min(img.width - 1, Math.floor(x * xRatio));
      const srcIdx = (srcY * img.width + srcX) * 4;
      const destIdx = (y * newW + x) * 4;
      result[destIdx] = img.rgba[srcIdx];
      result[destIdx + 1] = img.rgba[srcIdx + 1];
      result[destIdx + 2] = img.rgba[srcIdx + 2];
      result[destIdx + 3] = img.rgba[srcIdx + 3];
    }
  }
  return { width: newW, height: newH, rgba: result };
}

// Horizontal lockup: Icon on the left, wordmark on the right
function createCombo(iconImg, wordmarkImg, padding = 40, gap = 50) {
  // Scale icon to match wordmark height nicely or vice versa
  // Wordmark height is ~280, icon can be ~300
  const targetH = 320;
  const scaledIconW = Math.round((iconImg.width / iconImg.height) * targetH);
  const scaledIcon = resize(iconImg, scaledIconW, targetH);

  const scaledWordmarkW = Math.round((wordmarkImg.width / wordmarkImg.height) * (targetH * 0.75));
  const scaledWordmarkH = Math.round(targetH * 0.75);
  const scaledWordmark = resize(wordmarkImg, scaledWordmarkW, scaledWordmarkH);

  const totalW = padding * 2 + scaledIcon.width + gap + scaledWordmark.width;
  const totalH = padding * 2 + targetH;
  const combo = Buffer.alloc(totalW * totalH * 4); // all zeros = transparent

  // Paste icon
  const iconOffsetY = padding;
  const iconOffsetX = padding;
  for (let y = 0; y < scaledIcon.height; y++) {
    for (let x = 0; x < scaledIcon.width; x++) {
      const sIdx = (y * scaledIcon.width + x) * 4;
      const dIdx = ((iconOffsetY + y) * totalW + (iconOffsetX + x)) * 4;
      combo[dIdx] = scaledIcon.rgba[sIdx];
      combo[dIdx + 1] = scaledIcon.rgba[sIdx + 1];
      combo[dIdx + 2] = scaledIcon.rgba[sIdx + 2];
      combo[dIdx + 3] = scaledIcon.rgba[sIdx + 3];
    }
  }

  // Paste wordmark vertically centered
  const wmOffsetX = padding + scaledIcon.width + gap;
  const wmOffsetY = padding + Math.floor((targetH - scaledWordmark.height) / 2);
  for (let y = 0; y < scaledWordmark.height; y++) {
    for (let x = 0; x < scaledWordmark.width; x++) {
      const sIdx = (y * scaledWordmark.width + x) * 4;
      const dIdx = ((wmOffsetY + y) * totalW + (wmOffsetX + x)) * 4;
      combo[dIdx] = scaledWordmark.rgba[sIdx];
      combo[dIdx + 1] = scaledWordmark.rgba[sIdx + 1];
      combo[dIdx + 2] = scaledWordmark.rgba[sIdx + 2];
      combo[dIdx + 3] = scaledWordmark.rgba[sIdx + 3];
    }
  }

  return { width: totalW, height: totalH, rgba: combo };
}

// Generate ICO file from 32x32 and 64x64 PNGs
function createIco(pngBuffers) {
  // ICO header: 6 bytes (reserved: 0, type: 1, count: N)
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const entries = [];
  for (const { width, height, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry[0] = width >= 256 ? 0 : width;
    entry[1] = height >= 256 ? 0 : height;
    entry[2] = 0; // palette
    entry[3] = 0; // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map(p => p.buffer)]);
}

// Process
console.log('Decoding source logos...');
const rawIcon = decodePng('public/assets/img/logos/2.png');
const rawWordmark = decodePng('public/assets/img/logos/4.png');

console.log('Computing bounding boxes...');
const iconBox = getBoundingBox(rawIcon.width, rawIcon.height, rawIcon.rgba);
const wordmarkBox = getBoundingBox(rawWordmark.width, rawWordmark.height, rawWordmark.rgba);

console.log('Cropping...');
const croppedIcon = crop(rawIcon, iconBox, 30);
const croppedWordmark = crop(rawWordmark, wordmarkBox, 20);

// Generate variants
console.log('Generating color variants...');
// Dark (#0B3D3B or #09090b)
const iconDark = recolor(croppedIcon, 11, 61, 59); // Primary #0B3D3B
const wordmarkDark = recolor(croppedWordmark, 11, 61, 59);

// White (#FFFFFF)
const iconWhite = recolor(croppedIcon, 255, 255, 255);
const wordmarkWhite = recolor(croppedWordmark, 255, 255, 255);

// Accent Teal (#14B8A6)
const iconTeal = recolor(croppedIcon, 20, 184, 166);
const wordmarkTeal = recolor(croppedWordmark, 20, 184, 166);

// Combinations
const comboDark = createCombo(iconDark, wordmarkDark);
const comboWhite = createCombo(iconWhite, wordmarkWhite);
const comboTeal = createCombo(iconTeal, wordmarkTeal);

// Save PNGs
const outDir = 'public/assets/img/logos';
fs.writeFileSync(path.join(outDir, 'icon-dark.png'), encodePng(iconDark.width, iconDark.height, iconDark.rgba));
fs.writeFileSync(path.join(outDir, 'icon-white.png'), encodePng(iconWhite.width, iconWhite.height, iconWhite.rgba));
fs.writeFileSync(path.join(outDir, 'icon-teal.png'), encodePng(iconTeal.width, iconTeal.height, iconTeal.rgba));

fs.writeFileSync(path.join(outDir, 'wordmark-dark.png'), encodePng(wordmarkDark.width, wordmarkDark.height, wordmarkDark.rgba));
fs.writeFileSync(path.join(outDir, 'wordmark-white.png'), encodePng(wordmarkWhite.width, wordmarkWhite.height, wordmarkWhite.rgba));
fs.writeFileSync(path.join(outDir, 'wordmark-teal.png'), encodePng(wordmarkTeal.width, wordmarkTeal.height, wordmarkTeal.rgba));

fs.writeFileSync(path.join(outDir, 'combo-dark.png'), encodePng(comboDark.width, comboDark.height, comboDark.rgba));
fs.writeFileSync(path.join(outDir, 'combo-white.png'), encodePng(comboWhite.width, comboWhite.height, comboWhite.rgba));
fs.writeFileSync(path.join(outDir, 'combo-teal.png'), encodePng(comboTeal.width, comboTeal.height, comboTeal.rgba));

// Generate Favicons
const fav32 = resize(iconTeal, 32, 32);
const fav64 = resize(iconTeal, 64, 64);
const fav128 = resize(iconTeal, 128, 128);
const fav32Png = encodePng(32, 32, fav32.rgba);
const fav64Png = encodePng(64, 64, fav64.rgba);
const fav128Png = encodePng(128, 128, fav128.rgba);

fs.writeFileSync('public/favicon.png', fav64Png);
fs.writeFileSync('public/icon.png', fav128Png);
fs.writeFileSync('public/apple-icon.png', fav128Png);
const icoBuffer = createIco([
  { width: 32, height: 32, buffer: fav32Png },
  { width: 64, height: 64, buffer: fav64Png }
]);
fs.writeFileSync('public/favicon.ico', icoBuffer);
fs.writeFileSync('app/favicon.ico', icoBuffer);

console.log('Successfully generated all logo variants and favicons!');
