/**
 * Import products (images, descriptions, price variants)
 * from a JSON file in src/scripts/ into MongoDB.
 *
 * Upserts by slug — existing products are updated in place,
 * nothing is deleted.
 *
 * Run with: node src/scripts/import-cannabinoids.js [filename.json]
 * Default file: cannabinoids-products.json
 */
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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

function sanitize(raw) {
  return {
    name: raw.name,
    slug: raw.slug,
    category: raw.category,
    images: raw.images || [],
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

async function run() {
  const jsonFile = process.argv[2] || 'cannabinoids-products.json';
  const file = path.join(__dirname, jsonFile);
  const products = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
  console.log(`Loaded ${products.length} products from JSON`);

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB');

  let created = 0;
  let updated = 0;

  for (const raw of products) {
    const doc = sanitize(raw);
    const existing = await Product.findOne({ slug: doc.slug });
    if (existing) {
      await Product.updateOne({ slug: doc.slug }, { $set: doc });
      updated++;
    } else {
      await Product.create(doc);
      created++;
    }
  }

  console.log(`Done. ${created} created, ${updated} updated.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
