const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const images = path.join(root, "images");
const source = path.join(images, "logo-symbol-transparent.png");

const palette = {
  navy: "#073B55",
  teal: "#168B98",
  gold: "#D39A2C",
  cream: "#FFF9EA",
};

function badgeOverlaySvg(subtitle, strapline) {
  return Buffer.from(`
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <circle cx="512" cy="512" r="466" fill="none" stroke="${palette.gold}" stroke-width="18"/>
      <circle cx="512" cy="512" r="428" fill="none" stroke="${palette.navy}" stroke-width="3" opacity=".28"/>
      <text x="512" y="184" text-anchor="middle" fill="${palette.navy}"
        font-family="Montserrat, Arial, sans-serif" font-size="86" font-weight="800" letter-spacing="5">DUNAS <tspan fill="${palette.gold}">&amp;</tspan> OLAS</text>
      <text x="512" y="250" text-anchor="middle" fill="${palette.teal}"
        font-family="Montserrat, Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="8">${subtitle}</text>
      <line x1="228" y1="286" x2="796" y2="286" stroke="${palette.gold}" stroke-width="4"/>
      <line x1="228" y1="745" x2="796" y2="745" stroke="${palette.gold}" stroke-width="4"/>
      <text x="512" y="814" text-anchor="middle" fill="${palette.navy}"
        font-family="Montserrat, Arial, sans-serif" font-size="37" font-weight="800" letter-spacing="4">${strapline}</text>
      <text x="512" y="867" text-anchor="middle" fill="${palette.teal}"
        font-family="Montserrat, Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="5">CARTAGENA DE INDIAS</text>
    </svg>
  `);
}

async function writePair(baseName, pipeline, webpQuality = 92) {
  await pipeline.clone().png({ compressionLevel: 9 }).toFile(path.join(images, `${baseName}.png`));
  await pipeline.clone().webp({ quality: webpQuality, alphaQuality: 100 }).toFile(path.join(images, `${baseName}.webp`));
}

async function build() {
  const sourceMeta = await sharp(source).metadata();
  const croppedSource = await sharp(source)
    .extract({
      left: 10,
      top: 10,
      width: sourceMeta.width - 20,
      height: sourceMeta.height - 20,
    })
    .png()
    .toBuffer();
  const trimmed = await sharp(croppedSource)
    .trim({ background: "#00000000" })
    .png()
    .toBuffer();

  await writePair(
    "logo-master",
    sharp(trimmed).resize(1260, 592, { fit: "contain", background: "#00000000" }),
  );

  await writePair(
    "logo-icon",
    sharp({
      create: { width: 1164, height: 612, channels: 4, background: "#00000000" },
    }).composite([
      {
        input: await sharp(trimmed).resize(1080, 508, { fit: "contain" }).png().toBuffer(),
        left: 42,
        top: 52,
      },
    ]),
  );

  const badgeMarkResized = await sharp(trimmed)
    .resize(760, 357, { fit: "contain" })
    .png()
    .toBuffer();
  const badgeMark = await sharp(badgeMarkResized)
    .extract({ left: 0, top: 12, width: 760, height: 333 })
    .flatten({ background: palette.cream })
    .png()
    .toBuffer();
  const badgeBuffer = await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: palette.cream },
  }).composite([
    { input: badgeOverlaySvg("EXPERIENCIAS DEL CARIBE", "TOURS • ISLAS • CULTURA") },
    { input: badgeMark, left: 132, top: 352 },
  ]).png().toBuffer();
  await writePair("logo-badge", sharp(badgeBuffer));

  const sealBuffer = await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: palette.cream },
  }).composite([
    { input: badgeOverlaySvg("AGENCIA TURÍSTICA LOCAL", "VIAJES CLAROS • APOYO LOCAL") },
    { input: badgeMark, left: 132, top: 352 },
  ]).png().toBuffer();
  await writePair("logo-seal", sharp(sealBuffer));

  const faviconBuffer = await sharp({
    create: { width: 512, height: 512, channels: 4, background: palette.cream },
  }).composite([
    {
      input: await sharp(trimmed).resize(460, 216, { fit: "contain" }).png().toBuffer(),
      left: 26,
      top: 148,
    },
  ]).png().toBuffer();
  await sharp(faviconBuffer).png({ compressionLevel: 9 }).toFile(path.join(images, "favicon-dunas-olas.png"));
  await sharp(faviconBuffer).resize(32, 32).png({ compressionLevel: 9 }).toFile(path.join(images, "favicon-dunas-olas-32.png"));
  await sharp(faviconBuffer).png({ compressionLevel: 9 }).toFile(path.join(images, "favicon-nohemi.png"));
  await sharp(faviconBuffer).resize(32, 32).png({ compressionLevel: 9 }).toFile(path.join(images, "favicon-nohemi-32.png"));

  await sharp(trimmed)
    .resize(1400, 658, { fit: "contain", background: "#00000000" })
    .webp({ quality: 94, alphaQuality: 100 })
    .toFile(path.join(images, "logo.dunas.webp"));
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
