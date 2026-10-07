'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaStar, FaArrowLeft, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '@/components/cart/CartProvider';
import ProtectedImage from '@/components/common/ProtectedImage';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const [selectedGrams, setSelectedGrams] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);

  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();


  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Try to determine if the slug is actually a MongoDB ID
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(slug);
        
        // Choose the appropriate API endpoint based on the slug format
        const endpoint = isMongoId ? `/api/products/id/${slug}` : `/api/products/${slug}`;
        
        const { data } = await axios.get(endpoint);
        setProduct(data);

        // Default-select the lowest gram tier from the product's real variants
        const variants = (data.priceVariants || []).slice().sort((a, b) => a.quantity - b.quantity);
        if (variants.length) {
          setSelectedTier(variants[0]);
          setSelectedGrams(variants[0].quantity);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Failed to load product');
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      const gramsVariant = selectedTier
        ? { grams: selectedTier.quantity, price: selectedTier.price }
        : { grams: 50, price: product.price || 0 };
      addToCart({ ...product }, quantity, gramsVariant);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Product Not Found</h1>
          <p className="text-gray-900 mb-6 text-sm">{error || 'The product you are looking for does not exist.'}</p>
          <Link href="/products" className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm">
            <FaArrowLeft className="text-xs" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const specs = [
    ['Category', product.category],
    ['CAS Number', product.casNumber || '—'],
    ['Purity', product.purity || '≥ 99%'],
    ['Form', product.form || 'Powder / crystalline'],
    ['Storage', product.storage || 'Cool, dry, away from light'],
    ['Availability', product.countInStock > 0 ? 'In stock' : 'Out of stock'],
    ['Documentation', 'COA included with order'],
  ];

  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-16 pb-28 lg:pb-20">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-emerald-600 transition-colors">Catalog</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-emerald-600 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[220px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
          {/* ===== LEFT — sticky image column ===== */}
          <div className="lg:sticky lg:top-20 space-y-3">
            <div className="relative aspect-square w-full rounded-[1.75rem] overflow-hidden bg-[#06130d]">
              {product.images && product.images.length > 0 ? (
                <ProtectedImage
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/40">No image</div>
              )}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white/85">{product.category}</span>
                <span className={`font-mono text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 rounded-full backdrop-blur border ${product.countInStock > 0 ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200' : 'bg-red-500/20 border-red-400/40 text-red-200'}`}>
                  {product.countInStock > 0 ? 'In stock' : 'Sold out'}
                </span>
              </div>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-16 w-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === index ? 'border-emerald-500' : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <ProtectedImage src={image} alt={`${product.name} ${index + 1}`} fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== RIGHT — details ===== */}
          <div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-[-0.045em] leading-[0.92]">{product.name}</h1>

            <div className="flex items-center gap-3 mt-5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating || 0) ? 'text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="font-mono text-xs text-gray-400">{(product.rating || 0).toFixed(1)} / 5</span>
            </div>

            {/* Spec table */}
            <dl className="mt-10 border-t border-gray-200">
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-4 py-3.5 border-b border-gray-200">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-gray-400 pt-0.5">{k}</dt>
                  <dd className="text-sm text-gray-900 font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            {/* Tiers — real product variants */}
            <div className="mt-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gray-400 mb-3">Select quantity</p>
              <div className="grid grid-cols-4 gap-2">
                {(product.priceVariants?.length ? product.priceVariants.slice().sort((a, b) => a.quantity - b.quantity) : []).map(tier => {
                  const active = selectedGrams === tier.quantity;
                  return (
                    <button
                      key={tier.quantity}
                      onClick={() => { setSelectedTier(tier); setSelectedGrams(tier.quantity); }}
                      className={`flex flex-col items-center py-3 rounded-2xl border transition-all ${
                        active ? 'bg-[#06130d] border-[#06130d] text-white' : 'bg-white border-gray-200 text-gray-900 hover:border-emerald-400'
                      }`}
                    >
                      <span className="font-display font-bold text-base leading-none">{tier.quantity}g</span>
                      <span className={`font-mono text-[10px] mt-1.5 ${active ? 'text-lime-300' : 'text-gray-400'}`}>€{tier.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price + CTA */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gray-400 mb-1">Total for {selectedGrams ?? 50}g × {quantity}</p>
                <p className="font-display text-4xl font-extrabold text-gray-900 tracking-[-0.03em] leading-none">&euro;{(Number(selectedTier?.price ?? product.price ?? 0) * quantity).toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="w-11 h-12 flex items-center justify-center text-gray-900 hover:bg-gray-100 disabled:opacity-40 transition-colors text-lg"
                    aria-label="Decrease quantity"
                  >&minus;</button>
                  <input
                    type="number" min="1" value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 bg-transparent text-gray-900 text-center text-sm border-0 focus:outline-none focus:ring-0 h-12 p-0"
                    aria-label="Quantity"
                  />
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-11 h-12 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors text-lg"
                    aria-label="Increase quantity"
                  >+</button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock <= 0}
                  className={`flex-1 h-12 px-6 rounded-full flex items-center justify-center gap-2.5 font-display font-bold text-sm transition-colors ${
                    product.countInStock > 0
                      ? 'bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 text-[#06130d] shadow-lg shadow-emerald-500/25'
                      : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FaShoppingCart className="text-sm" />
                  {product.countInStock > 0 ? 'Add to cart' : 'Out of stock'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-14">
              <div className="flex items-center gap-4 mb-5 font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-600">
                <span>Notes</span><span className="h-px w-10 bg-emerald-300" /><span>Description</span>
              </div>
              <div className="text-gray-700 text-base leading-loose space-y-4">
                {product.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewForm({ slug, onReviewAdded }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !rating || !comment) {
      toast.error('Please fill in all fields and select a rating.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      toast.success('Review submitted!');
      setSuccess(true);
      onReviewAdded({ name, rating, comment, createdAt: new Date().toISOString() });
      setName('');
      setRating(0);
      setComment('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <FaStar className={`w-6 h-6 ${star <= (hoverRating || rating) ? 'text-amber-400' : 'text-gray-200'} transition-colors`} />
              </button>
            ))}
            {rating > 0 && <span className="text-sm text-gray-900 ml-2 self-center font-medium">{rating}/5</span>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience with this product..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 placeholder-gray-400 resize-none"
          />
        </div>
        {success ? (
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <FaCheckCircle /> Review submitted successfully!
          </div>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        )}
      </form>
    </div>
  );
}
