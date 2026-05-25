import sharp from 'sharp';
import { mkdirSync } from 'fs';

mkdirSync('icons', { recursive: true });

const sizes = [16, 48, 128];

for (const size of sizes) {
  await sharp('noun-blur-on-4180752.svg')
    .resize(size, size)
    .png()
    .toFile(`icons/icon-${size}.png`);

  console.log(`Generated icons/icon-${size}.png`);
}
