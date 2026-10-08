'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaFlask, FaShoppingCart, FaStar, FaCheckCircle, FaQuoteLeft, FaWhatsapp, FaTelegramPlane, FaArrowRight } from 'react-icons/fa';
import { useCart } from '@/components/cart/CartProvider';
import SEOKeywords from '@/components/seo/SEOKeywords';
import HomeSEOContent from '@/components/seo/HomeSEOContent';
import HeroSplit from '@/components/home/HeroSplit';

export default function HomeClient({ featuredProducts = [] }) {
  return (
    <div className="min-h-screen bg-white">
      <SEOKeywords />
      <HeroSplit products={featuredProducts} />
      <TickerStrip />
      <ImageRibbon products={featuredProducts} />
      <BentoProducts products={featuredProducts} />
      <ProcessStrip />
      <TickerStrip dark />
      <SingleQuote />
      <HomeSEOContent />
      <CTAPanel />
    </div>
  );
}

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ n, children, light = false }) {
  return (
    <div className={`flex items-center gap-4 mb-8 font-mono text-[11px] uppercase tracking-[0.3em] ${light ? 'text-lime-300/70' : 'text-emerald-600'}`}>
      <span>{n}</span>
      <span className={`h-px w-10 ${light ? 'bg-lime-400/40' : 'bg-emerald-300'}`} />
      <span>{children}</span>
    </div>
  );
}

/* ================= TICKER STRIP ================= */
const TICKER_ITEMS = [
  'Synthetic Cannabinoid Specialists', '99.9% Average Purity', 'COA With Every Order', '500+ Verified Compounds',
  '50+ Countries Delivered', '48h Dispatch', '10K+ Researchers',
  'ISO-Compliant Storage', 'Discreet Packaging',
];

function TickerStrip({ dark = false }) {
  return (
    <div className={`relative overflow-hidden border-y ${dark ? 'bg-[#06130d] border-lime-500/15' : 'bg-white border-gray-200'}`}>
      <div className="overflow-hidden py-4">
        <div className="animate-marquee flex w-max whitespace-nowrap" style={{ animationDuration: '38s' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} className={`flex items-center gap-6 pr-6 font-display font-bold text-sm sm:text-base uppercase tracking-[0.12em] ${dark ? 'text-white/70' : 'text-gray-900'}`}>
              {t}
              <span className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-lime-400' : 'bg-lime-500'}`} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= IMAGE RIBBON — PRODUCT PHOTO MARQUEE ================= */
function ImageRibbon({ products = [] }) {
  const withImages = products.filter(p => p.images?.[0]);
  if (!withImages.length) return null;

  const items = [...withImages, ...withImages];

  return (
    <section className="relative bg-white border-b border-gray-200 overflow-hidden">
      <div className="container mx-auto px-6 pt-14 pb-4">
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-600">
          <span>Catalog</span>
          <span className="h-px w-10 bg-emerald-300" />
          <span className="text-gray-400">In stock now</span>
        </div>
      </div>
      <div className="overflow-hidden pb-14">
        <div className="animate-marquee flex w-max gap-4 pr-4" style={{ animationDuration: `${Math.max(withImages.length * 6, 40)}s` }}>
          {items.map((p, i) => (
            <Link
              key={`${p._id}-${i}`}
              href={`/products/${p.slug}`}
              className="group relative shrink-0 w-44 sm:w-56 h-56 sm:h-72 overflow-hidden rounded-[1.5rem] border border-gray-200 bg-gray-50"
            >
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                sizes="(min-width:640px) 224px, 176px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06130d]/80 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-display text-white text-sm font-bold leading-tight line-clamp-1">{p.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime-300/90 mt-1">{p.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= BENTO PRODUCTS ================= */
function getPrice(p) {
  if (p.priceVariants?.length) return p.priceVariants.reduce((m, v) => (v.price < m ? v.price : m), p.priceVariants[0].price);
  if (p.price && p.price > 0) return p.price;
  return 0;
}

function useAddToCart() {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);
  const handle = (e, product) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1800);
    const br = e.currentTarget.getBoundingClientRect();
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      const cr = cartIcon.getBoundingClientRect();
      const dot = document.createElement('div');
      dot.style.cssText = `position:fixed;z-index:9999;width:12px;height:12px;border-radius:50%;background:linear-gradient(135deg,#10b981,#84cc16);pointer-events:none;transition:transform 0.65s cubic-bezier(0.4,0,1,1),opacity 0.65s ease;top:${br.top + br.height / 2}px;left:${br.left + br.width / 2}px;box-shadow:0 0 12px rgba(132,204,22,0.6);`;
      document.body.appendChild(dot);
      requestAnimationFrame(() => { dot.style.transform = `translate(${cr.left - br.left}px,${cr.top - br.top}px) scale(0.3)`; dot.style.opacity = '0'; });
      setTimeout(() => { dot.remove(); cartIcon.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 300 }); }, 680);
    }
  };
  return { addedId, handle };
}

function BentoTile({ product, size, addedId, onAdd }) {
  const price = getPrice(product);
  const big = size === 'lg';
  const med = size === 'md';
  const inStock = product.countInStock > 0;

  return (
    <div className={`group relative h-full overflow-hidden rounded-[1.75rem] bg-[#06130d] text-white ${big ? 'min-h-[420px]' : med ? 'min-h-[220px]' : 'min-h-[220px]'}`}>
      <Link href={`/products/${product.slug}`} className="absolute inset-0">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill sizes={big ? '(min-width:768px) 50vw, 100vw' : '(min-width:768px) 25vw, 100vw'} className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900 to-lime-900"><FaFlask className="text-white/20 text-5xl" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06130d] via-[#06130d]/40 to-transparent" />
      </Link>

      {/* Top chips */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10 pointer-events-none">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white/80">{product.category}</span>
        {!inStock && <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-black/60 border border-white/15">Sold out</span>}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/products/${product.slug}`}>
              <h3 className={`font-display font-bold leading-tight group-hover:text-lime-200 transition-colors ${big ? 'text-2xl sm:text-3xl' : 'text-lg'} line-clamp-2`}>{product.name}</h3>
            </Link>
            {big && <p className="text-white/55 text-sm mt-2 line-clamp-2 max-w-md">{product.description}</p>}
            <div className="flex items-center gap-3 mt-3">
              <span className="font-mono text-base sm:text-lg text-white">€{price.toFixed(2)}</span>
              <span className="flex gap-0.5">{[1,2,3,4,5].map(n => <FaStar key={n} className={`text-[9px] ${n <= Math.round(product.rating || 0) ? 'text-amber-400' : 'text-white/20'}`} />)}</span>
            </div>
          </div>
          {inStock ? (
            <motion.button
              onClick={(e) => onAdd(e, product)}
              whileTap={{ scale: 0.92 }}
              aria-label={`Add ${product.name} to cart`}
              className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors ${addedId === product._id ? 'bg-emerald-500 text-white' : 'bg-white text-[#06130d] hover:bg-lime-200'}`}
            >
              {addedId === product._id ? <FaCheckCircle size={14} /> : <FaShoppingCart size={14} />}
            </motion.button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function BentoProducts({ products = [] }) {
  const { addedId, handle } = useAddToCart();
  const sizes = ['lg', 'sm', 'sm', 'md', 'sm', 'sm', 'sm', 'sm'];
  const list = products.slice(0, 8);

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-6">
        <FadeUp>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <SectionLabel n="01">Featured</SectionLabel>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-[-0.04em] leading-[0.95]">
                Featured<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-600">cannabinoids</span> &amp; more.
              </h2>
            </div>
            <Link href="/products" className="group inline-flex items-center gap-3 text-sm font-bold text-gray-900 hover:text-emerald-600 transition-colors">
              Full catalog
              <span className="w-9 h-9 rounded-full border border-gray-300 group-hover:border-emerald-500 flex items-center justify-center transition-all group-hover:rotate-[-45deg]"><FaArrowRight size={11} /></span>
            </Link>
          </div>
        </FadeUp>

        {list.length ? (
          <div className="grid md:grid-cols-4 md:auto-rows-[210px] gap-4">
            {list.map((p, i) => (
              <FadeUp key={p._id} delay={i * 0.06} className={sizes[i] === 'lg' ? 'md:col-span-2 md:row-span-2' : sizes[i] === 'md' ? 'md:col-span-2' : ''}>
                <div className="h-full">
                  <BentoTile product={p} size={sizes[i]} addedId={addedId} onAdd={handle} />
                </div>
              </FadeUp>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400"><FaFlask className="text-5xl mx-auto mb-4 opacity-30" /><p className="text-sm">No featured products at the moment.</p></div>
        )}
      </div>
    </section>
  );
}

/* ================= PROCESS — HORIZONTAL SNAP STRIP ================= */
const steps = [
  { n: '01', title: 'Browse & order', desc: 'Explore 500+ verified cannabinoids and compounds. Add to cart and send your order request in minutes.', tag: 'Catalog', img: 'https://images.unsplash.com/photo-1503262028195-93c528f03218?w=800&q=80&auto=format&fit=crop' },
  { n: '02', title: 'Lab verified', desc: 'Every compound is independently tested. Your COA is attached to your order confirmation.', tag: 'Quality', img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80&auto=format&fit=crop' },
  { n: '03', title: 'Discreet delivery', desc: 'Dispatched within 48h in plain unmarked packaging. Full tracking at every step.', tag: 'Logistics', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80&auto=format&fit=crop' },
  { n: '04', title: 'Ongoing support', desc: 'Questions on handling or storage? Reach us on WhatsApp or Telegram any time.', tag: 'Support', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&auto=format&fit=crop' },
];

function ProcessStrip() {
  return (
    <section className="py-20 sm:py-28 bg-gray-50 border-t border-gray-200 overflow-hidden">
      <div className="container mx-auto px-6">
        <FadeUp>
          <SectionLabel n="02">Process</SectionLabel>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-[-0.04em] leading-[0.95]">From order<br />to bench.</h2>
            <p className="text-gray-500 text-sm max-w-xs">Four steps. Scroll sideways to walk through them.</p>
          </div>
        </FadeUp>
      </div>

      <div className="flex gap-5 overflow-x-auto px-6 pb-6 snap-x snap-mandatory scrollbar-hide lg:pl-[calc((100vw-88px-80rem)/2+1.5rem)]">
        {steps.map(({ n, title, desc, tag, img }, i) => (
          <FadeUp key={n} delay={i * 0.08} className="snap-start shrink-0">
            <div className="group relative w-[300px] sm:w-[380px] h-[400px] overflow-hidden rounded-[1.75rem] bg-white border border-gray-200 flex flex-col hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-200/50 transition-all">
              {/* Photo band */}
              <div className="relative h-36 w-full shrink-0 overflow-hidden">
                <Image src={img} alt={title} fill sizes="380px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
                <span className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white bg-black/50 backdrop-blur border border-white/20 rounded-full px-2.5 py-1">{tag}</span>
              </div>
              <div className="flex-1 flex flex-col justify-between p-7 pt-1">
                <span className="font-display font-extrabold text-7xl text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-lime-500 leading-none">{n}</span>
                <div>
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-7 right-7 h-[2px] bg-gradient-to-r from-emerald-500 to-lime-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            </div>
          </FadeUp>
        ))}
        <div className="shrink-0 w-6" />
      </div>
    </section>
  );
}

/* ================= TESTIMONIALS — SINGLE QUOTE ================= */
const testimonials = [
  { text: "CannabinoidSite' quality is unmatched. Their cannabinoids have been instrumental in advancing our research programme.", author: "Dr. J. Smith", role: "Research Scientist", img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { text: "Fast shipping, excellent service. Purity consistently exceeds our lab expectations every single time we order.", author: "L. Johnson", role: "Laboratory Director", img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { text: "We rely on CannabinoidSite for all our chemical needs. Their quality control processes are genuinely impressive.", author: "M. Williams", role: "Chemical Analyst", img: 'https://randomuser.me/api/portraits/men/52.jpg' },
  { text: "Their compounds significantly accelerated our development timeline. Consistently high quality and reliability.", author: "Dr. A. Rodriguez", role: "Pharmaceutical Researcher", img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { text: "Professional grade COA on every product. Prompt support and discreet packaging — exactly what we need.", author: "T. Okafor", role: "Independent Researcher", img: 'https://randomuser.me/api/portraits/men/36.jpg' },
];

function SingleQuote() {
  const [i, setI] = useState(0);
  const t = testimonials[i];

  return (
    <section className="relative bg-[#06130d] text-white py-24 sm:py-32 overflow-hidden">
      <div className="absolute -top-32 right-0 w-[480px] h-[480px] rounded-full bg-lime-700/20 blur-[150px] pointer-events-none" />
      <div className="container mx-auto px-6">
        <FadeUp>
          <SectionLabel n="03" light>Researchers</SectionLabel>
        </FadeUp>

        <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-20 items-start">
          {/* Avatar column */}
          <FadeUp>
            <div className="flex lg:flex-col gap-3">
              {testimonials.map((x, idx) => (
                <button
                  key={x.author}
                  onClick={() => setI(idx)}
                  aria-label={`Show quote from ${x.author}`}
                  className={`relative w-12 h-12 rounded-2xl overflow-hidden transition-all ${idx === i ? 'scale-110 ring-2 ring-lime-400 shadow-lg shadow-lime-500/40' : 'opacity-50 hover:opacity-90 ring-1 ring-white/10'}`}
                >
                  <Image src={x.img} alt={x.author} fill sizes="48px" className="object-cover" />
                </button>
              ))}
            </div>
          </FadeUp>

          {/* Quote */}
          <div className="min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                <FaQuoteLeft className="text-lime-500/40 text-3xl mb-6" />
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold leading-[1.25] tracking-[-0.02em] max-w-3xl">
                  {t.text}
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <FaStar key={n} className="text-amber-400 text-xs" />)}</div>
                  <span className="h-px w-8 bg-white/20" />
                  <p className="text-sm"><span className="font-bold">{t.author}</span> <span className="text-white/40">— {t.role}</span></p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= CTA ================= */
function CTAPanel() {
  return (
    <section className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 py-24 sm:py-32">
        <FadeUp>
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-20 items-end">
            <div>
              <SectionLabel n="04">Contact</SectionLabel>
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-[-0.045em] leading-[0.9]">
                Talk to a<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-600">human.</span>
              </h2>
              <p className="mt-6 text-gray-500 max-w-md leading-relaxed">
                Questions on a compound, bulk pricing or shipping to your country? We reply within 24 hours on WhatsApp or Telegram.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <div className="relative rounded-[1.75rem] overflow-hidden h-40 w-full sm:w-[380px] mb-2 border border-gray-200">
                <Image src="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80&auto=format&fit=crop" alt="Laboratory analysis" fill sizes="380px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#06130d]/50 to-transparent" />
                <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/90">Verified in-house lab</span>
              </div>
              <a href="https://wa.me/19852913802" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-between gap-6 bg-emerald-500 hover:bg-emerald-400 text-white font-display font-bold px-7 py-5 rounded-full transition-colors min-w-[260px]">
                <span className="flex items-center gap-3"><FaWhatsapp size={18} /> WhatsApp</span>
                <FaArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a href="https://t.me/Zhong5cla" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-between gap-6 bg-[#06130d] hover:bg-emerald-900 text-white font-display font-bold px-7 py-5 rounded-full transition-colors min-w-[260px]">
                <span className="flex items-center gap-3"><FaTelegramPlane size={17} /> Telegram</span>
                <FaArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
