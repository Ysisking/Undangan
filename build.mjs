// Menggabungkan engine + gaya dasar ke setiap template, lalu menulis hasil siap-hosting ke dist/.
// Jalankan:  node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const engine = fs.readFileSync(path.join(SRC, 'engine.js'), 'utf8');
const base = fs.readFileSync(path.join(SRC, 'base.css'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function bungkus(head, body, title, desc) {
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
${head.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)}
</head>
<body>
${body}
</body>
</html>
`;
}

fs.mkdirSync(DIST, { recursive: true });
const daftar = [];
for (const f of fs.readdirSync(path.join(SRC, 'templates')).filter((x) => x.endsWith('.html')).sort()) {
  const slug = f.replace(/\.html$/, '');
  let s = fs.readFileSync(path.join(SRC, 'templates', f), 'utf8');
  s = s.replace('/*@BASE*/', () => base).replace('<!--@ENGINE-->', () => `<script>\n${engine}</script>`);
  const [head, body] = s.split('<!--@BODY-->');
  if (!body) throw new Error(`${f}: penanda <!--@BODY--> tidak ada`);

  const cfg = /<script id="data-undangan">([\s\S]*?)<\/script>/.exec(s);
  const ctx = { window: {} };
  vm.runInNewContext(cfg[1], ctx);
  const D = ctx.window.UNDANGAN;
  const m = D.mempelai;
  const [a, b] = m.urutan === 'wanita-dulu' ? [m.wanita, m.pria] : [m.pria, m.wanita];
  const pasangan = `${a.panggilan} & ${b.panggilan}`;
  const title = `Undangan Pernikahan ${pasangan}`;
  const desc = `Dengan penuh syukur, kami mengundang Anda di hari bahagia ${pasangan}.`;

  fs.mkdirSync(path.join(DIST, slug), { recursive: true });
  // Versi hosting: isi undangan dipisah ke data.js supaya bisa diubah dari halaman admin
  const dataJs = `window.UNDANGAN = ${JSON.stringify(D, null, 2)};\n`;
  const pisah = (t) => t.replace(/<script id="data-undangan">[\s\S]*?<\/script>/, '<script src="data.js"></script>');
  fs.writeFileSync(path.join(DIST, slug, 'index.html'), bungkus(pisah(head), pisah(body), title, desc));
  fs.writeFileSync(path.join(DIST, slug, 'data.js'), dataJs);
  fs.writeFileSync(path.join(DIST, `${slug}.artifact.html`), s);
  daftar.push(slug);
  console.log('✓', slug, `(${(fs.statSync(path.join(DIST, slug, 'index.html')).size / 1024).toFixed(0)} KB)`);
}

// katalog: versi artifact (tanpa kerangka) dan versi hosting
if (fs.existsSync(path.join(SRC, 'katalog.html'))) {
const kat = fs.readFileSync(path.join(SRC, 'katalog.html'), 'utf8');
fs.writeFileSync(path.join(DIST, 'katalog.artifact.html'), kat);
const [kh, kb] = kat.split('<!--@BODY-->');
fs.writeFileSync(path.join(DIST, 'index.html'), bungkus(kh, kb, 'Katalog Undangan', 'Pilihan template undangan pernikahan digital.'));
console.log('✓ katalog');
}
