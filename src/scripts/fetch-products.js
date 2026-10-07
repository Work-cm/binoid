/**
 * Download products from the source site's public API as clean UTF-8 JSON.
 *
 * Usage: node src/scripts/fetch-products.js <category> [outfile]
 *   e.g.: node src/scripts/fetch-products.js cannabinoids
 *         node src/scripts/fetch-products.js "research chemicals" rc.json
 *
 * Output is written to src/scripts/<category-slug>-products.json by default.
 */
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.nitazenechemicals.com/api/products';

async function run() {
  const category = process.argv[2];
  if (!category) {
    console.error('Usage: node src/scripts/fetch-products.js <category> [outfile]');
    process.exit(1);
  }
  const url = `${BASE}?category=${encodeURIComponent(category)}`;
  console.log('GET', url);

  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) {
    console.error(`HTTP ${res.status}`);
    process.exit(1);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    console.error('Unexpected response — not an array');
    process.exit(1);
  }

  const file = process.argv[3] || `${category.replace(/%20|\s+/g, '-')}-products.json`;
  const out = path.join(__dirname, file);
  fs.writeFileSync(out, JSON.stringify(data, null, 2), 'utf8');
  console.log(`${data.length} products written to ${out}`);
  data.forEach(p => console.log(`  ${p.slug} | ${p.name} | ${(p.images || []).length} imgs`));
}

run().catch(e => { console.error(e.message); process.exit(1); });
