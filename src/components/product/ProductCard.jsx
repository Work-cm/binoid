'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaCheck, FaFlask } from 'react-icons/fa';
import { useCart } from '@/components/cart/CartProvider';

export function lowestPrice(p) {
  if (p?.priceVariants?.length) return p.priceVariants.reduce((m, v) => (v.price < m ? v.price : m), p.priceVariants[0].price);
  if (p?.price && p.price > 0) return p.price;
  return 0;
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const price = lowestPrice(product);
  const inStock = product.countInStock > 0;
  const hasVariants = product.priceVariants && product.priceVariants.length > 1;
  const href = `/products/${product.slug || product._id}`;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    if (hasVariants) {
      window.location.href = href;
      return;
    }
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);

    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      const br = e.currentTarget.getBoundingClientRect();
      const cr = cartIcon.getBoundingClientRect();
      const dot = document.createElement('div');
      dot.style.cssText = `position:fixed;z-index:9999;width:12px;height:12px;border-radius:50%;background:#ff6b4a;pointer-events:none;transition:transform 0.6s cubic-bezier(0.4,0,1,1),opacity 0.6s ease;top:${br.top + br.height / 2}px;left:${br.left + br.width / 2}px;`;
      document.body.appendChild(dot);
      requestAnimationFrame(() => { dot.style.transform = `translate(${cr.left - br.left}px,${cr.top - br.top}px) scale(0.3)`; dot.style.opacity = '0'; });
      setTimeout(() => { dot.remove(); cartIcon.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 300 }); }, 620);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-950/5 transition-all flex flex-col h-full overflow-hidden"
    >
      {/* Image */}
      <Link href={href} className="relative block aspect-square bg-gray-50 overflow-hidden" aria-label={`View ${product.name}`}>
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name || 'Product image'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            quality={85}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300"><FaFlask size={36} /></div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-white/95 backdrop-blur text-gray-700 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md shadow-sm">{product.category}</span>
          {product.featured && <span className="bg-coral-500 text-white text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md shadow-sm">Popular</span>}
        </div>
        <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">COA</span>

        {!inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">Sold out</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        <Link href={href} className="block">
          <h3 className="text-gray-900 font-semibold text-[13px] leading-snug line-clamp-2 min-h-[2.3rem] group-hover:text-indigo-700 transition-colors">{product.name || 'Unnamed product'}</h3>
        </Link>

        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={`w-3 h-3 ${i < Math.round(product.rating || 0) ? 'text-amber-400' : 'text-gray-200'}`} />
            ))}
          </div>
          <span className="text-gray-500 text-xs">({product.numReviews || 0})</span>
          {product.purity && <span className="ml-auto text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">{product.purity}</span>}
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div>
            {hasVariants && <span className="block text-[10px] text-gray-500 uppercase tracking-wide">From</span>}
            <span className="text-coral-600 font-extrabold text-lg leading-none">&euro;{price.toFixed(2)}</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={!inStock}
            aria-label={hasVariants ? `Choose options for ${product.name}` : `Add ${product.name} to cart`}
            className={`h-9 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${added ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            {added ? <><FaCheck size={10} /> Added</> : <><FaShoppingCart size={11} /> {hasVariants ? 'Options' : 'Add'}</>}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
