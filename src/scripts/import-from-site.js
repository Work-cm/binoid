/**
 * Import the full product catalog from cannabinoidsite.com into MongoDB.
 *
 * - Fetches https://www.cannabinoidsite.com/api/products (same API this app exposes)
 * - Copies every product field: name, slug, category, description, CAS number,
 *   price + priceVariants (measuring units), stock, rating, featured flag
 * - Downloads every product image (remote CDN URLs AND site-relative paths)
 *   into public/images/products/<slug>/ and rewrites images[] to local paths
 * - Upserts by slug — existing products are updated in place, nothing is deleted
 *
 * Run with: node src/scripts/import-from-site.js
 * Optional: node src/scripts/import-from-site.js --skip-images  (data only)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SOURCE_BASE = 'https://www.cannabinoidsite.com';
const API_URL = `${SOURCE_BASE}/api/products`;
const SKIP_IMAGES = process.argv.includes('--skip-images');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set. Fill it in your .env file first.');
  process.exit(1);
}

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  images: [String],
  description: String,
  casNumber: String,
  price: Number,
  priceVariants: [{ quantity: Number, price: Number }],
  countInStock: Number,
  rating: Number,
  numReviews: Number,
  featured: Boolean,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

/* ---------- helpers ---------- */

function fetchJson(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'BinoidStore-Importer/1.0' } }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 5) {
        res.resume();
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : `${SOURCE_BASE}${res.headers.location}`;
        return fetchJson(next, redirects + 1).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`GET ${url} -> HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
        catch (e) { reject(new Error(`Invalid JSON from ${url}`)); }
      });
      res.on('error', reject);
    });
    req.setTimeout(30000, () => req.destroy(new Error(`Timeout fetching ${url}`)));
    req.on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const client = url.startsWith('https') ? https : http;
    const doGet = (u, redirects = 0) => {
      const req = client.get(u, { headers: { 'User-Agent': 'BinoidStore-Importer/1.0' } }, (res) => {
        if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 5) {
          res.resume();
          return doGet(res.headers.location.startsWith('http') ? res.headers.location : `${new URL(u).origin}${res.headers.location}`, redirects + 1);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`GET ${u} -> HTTP ${res.statusCode}`));
        }
        const out = fs.createWriteStream(dest);
        res.pipe(out);
        out.on('finish', () => out.close(resolve));
        out.on('error', reject);
        res.on('error', reject);
      });
      req.setTimeout(30000, () => req.destroy(new Error(`Timeout downloading ${u}`)));
      req.on('error', reject);
    };
    doGet(url);
  });
}

function extFromUrl(url) {
  try {
    const pathname = new URL(url, SOURCE_BASE).pathname;
    const ext = path.extname(pathname).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(ext) ? ext : '.jpg';
  } catch {
    return '.jpg';
  }
}

async function localizeImages(rawImages, slug) {
  const localPaths = [];
  for (let i = 0; i < rawImages.length; i++) {
    const src = rawImages[i];
    if (typeof src !== 'string' || !src) continue;

    // Already a local path on OUR site — keep it
    if (src.startsWith('/images/products/')) {
      localPaths.push(src);
      continue;
    }

    const ext = extFromUrl(src);
    const filename = `img-${i + 1}${ext}`;
    const relPath = `/images/products/${slug}/${filename}`;
    const absPath = path.join(process.cwd(), 'public', 'images', 'products', slug, filename);

    if (fs.existsSync(absPath) && fs.statSync(absPath).size > 0) {
      localPaths.push(relPath); // already downloaded
      continue;
    }

    const remoteUrl = src.startsWith('http') ? src : `${SOURCE_BASE}${src}`;
    try {
      await downloadFile(remoteUrl, absPath);
      localPaths.push(relPath);
    } catch (e) {
      console.warn(`    ! image ${i + 1} failed for "${slug}": ${e.message} — keeping remote URL`);
      localPaths.push(src.startsWith('http') ? src : `${SOURCE_BASE}${src}`);
    }
  }
  return localPaths;
}

function sanitize(raw, images) {
  return {
    name: raw.name,
    slug: raw.slug,
    category: (raw.category || '').toLowerCase(),
    images,
    description: raw.description,
    casNumber: raw.casNumber || '',
    price: raw.price ?? (raw.priceVariants?.[0]?.price ?? 0),
    priceVariants: (raw.priceVariants || []).map(v => ({ quantity: v.quantity, price: v.price })),
    countInStock: raw.countInStock ?? 0,
    rating: raw.rating ?? 0,
    numReviews: raw.numReviews ?? 0,
    featured: raw.featured ?? false,
  };
}

/* ---------- main ---------- */

async function run() {
  console.log(`Fetching catalog from ${API_URL} ...`);
  const products = await fetchJson(API_URL);
  console.log(`Loaded ${products.length} products`);

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB\n');

  let created = 0, updated = 0, failed = 0;

  for (const raw of products) {
    try {
      const images = SKIP_IMAGES
        ? (raw.images || []).map(s => (s.startsWith('http') ? s : `${SOURCE_BASE}${s}`))
        : await localizeImages(raw.images || [], raw.slug);

      const doc = sanitize(raw, images);
      const existing = await Product.findOne({ slug: doc.slug });
      if (existing) {
        await Product.updateOne({ slug: doc.slug }, { $set: doc });
        updated++;
      } else {
        await Product.create(doc);
        created++;
      }
      console.log(`  ${existing ? 'updated' : 'created'}  ${doc.slug}  (${images.length} img, ${doc.priceVariants.length} variants)`);
    } catch (e) {
      failed++;
      console.error(`  FAILED    ${raw.slug}: ${e.message}`);
    }
  }

  const total = await Product.countDocuments();
  console.log(`\nDone. ${created} created, ${updated} updated, ${failed} failed. Total in DB: ${total}`);
  await mongoose.disconnect();
  process.exit(failed ? 2 : 0);
}

run().catch(err => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
