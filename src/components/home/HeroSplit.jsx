'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCannabis, FaSyringe, FaAtom, FaFlask, FaStar, FaShieldAlt, FaTruck, FaGlobeAmericas } from 'react-icons/fa';

const CATEGORY_TILES = [
  { label: 'Cannabinoids', href: '/products?category=cannabinoids', Icon: FaCannabis, count: '200+', color: 'bg-indigo-600' },
  { label: 'Nitazenes', href: '/products?category=nitazenes', Icon: FaSyringe, count: '40+', color: 'bg-coral-500' },
  { label: 'Opioids', href: '/products?category=opioids', Icon: FaAtom, count: '60+', color: 'bg-ink' },
  { label: 'Research chemicals', href: '/products?category=research%20chemicals', Icon: FaFlask, count: '150+', color: 'bg-indigo-400' },
];

function getPrice(p) {
  if (p.priceVariants?.length) return p.priceVariants.reduce((m, v) => (v.price < m ? v.price : m), p.priceVariants[0].price);
  if (p.price && p.price > 0) return p.price;
  return 0;
}

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

export default function HeroSplit({ products = [] }) {
  const spotlight = products.find(p => p.images?.[0]) || null;
  const spotlightPrice = spotlight ? getPrice(spotlight) : 0;

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 pt-6 lg:pt-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-5">
          {/* ---------- Main hero banner ---------- */}
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 text-white min-h-[380px] lg:min-h-[460px] flex items-center"
          >
            {/* decorative shapes */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-coral-500/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-indigo-400/30 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />

            <div className="relative z-10 grid md:grid-cols-[1.1fr_1fr] gap-8 items-center p-8 sm:p-10 lg:p-12 w-full">
              <div>
                <motion.span variants={fade} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-3.5 py-1.5 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral-400 animate-pulse" /> New batch in stock &middot; Lot 2026-A
                </motion.span>
                <motion.h1 variants={fade} className="mt-5 font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.05] tracking-tight">
                  Premium cannabinoids,<br />
                  <span className="text-coral-300">lab verified</span> &amp; shipped fast.
                </motion.h1>
                <motion.p variants={fade} className="mt-4 text-white/80 text-sm sm:text-base leading-relaxed max-w-md">
                  Shop 500+ research compounds including 5CL-ADBA, ADB-BUTINACA and JWH-018. Every order ships with its Certificate of Analysis in discreet packaging.
                </motion.p>
                <motion.div variants={fade} className="mt-7 flex flex-wrap gap-3">
                  <Link href="/products" className="inline-flex items-center gap-2 bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-coral-900/30">
                    Shop now <FaArrowRight size={12} />
                  </Link>
                  <Link href="/products?category=cannabinoids" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors">
                    Browse cannabinoids
                  </Link>
                </motion.div>
                <motion.div variants={fade} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/75">
                  <span className="flex items-center gap-2"><FaShieldAlt className="text-coral-300" /> 99.9% avg. purity</span>
                  <span className="flex items-center gap-2"><FaTruck className="text-coral-300" /> 48h dispatch</span>
                  <span className="flex items-center gap-2"><FaGlobeAmericas className="text-coral-300" /> 50+ countries</span>
                </motion.div>
              </div>

              {/* Spotlight product card */}
              {spotlight && (
                <motion.div
                  initial={{ opacity: 0, x: 30, rotate: 2 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="hidden md:block justify-self-end w-full max-w-[300px]"
                >
                  <Link href={`/products/${spotlight.slug}`} className="block bg-white rounded-2xl p-3 shadow-2xl shadow-indigo-950/40 text-gray-900 group">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                      <Image src={spotlight.images[0]} alt={spotlight.name} fill sizes="300px" priority className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className="absolute top-2.5 left-2.5 bg-coral-500 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md">Best seller</span>
                    </div>
                    <div className="p-2.5">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{spotlight.category}</p>
                      <p className="font-semibold text-sm leading-snug line-clamp-1 mt-0.5">{spotlight.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-coral-600 font-extrabold text-lg">&euro;{spotlightPrice.toFixed(2)}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-600"><FaStar className="text-amber-400" /> {(spotlight.rating || 5).toFixed(1)}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* ---------- Side promo cards ---------- */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative overflow-hidden rounded-2xl bg-coral-50 border border-coral-100 p-6 flex flex-col justify-between min-h-[200px]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-coral-600">Limited offer</span>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-gray-900 mt-2 leading-tight">Free shipping over &euro;500</h3>
                <p className="text-gray-600 text-sm mt-2">Discreet, tracked delivery on qualifying orders.</p>
              </div>
              <Link href="/shipping" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-coral-700 hover:text-coral-800">Shipping details <FaArrowRight size={11} /></Link>
              <span className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-coral-200/60" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="relative overflow-hidden rounded-2xl bg-ink text-white p-6 flex flex-col justify-between min-h-[200px]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">Pay with crypto</span>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl mt-2 leading-tight">BTC &amp; USDT accepted</h3>
                <p className="text-white/70 text-sm mt-2">Fast, private payments. Wallet details sent after checkout.</p>
              </div>
              <Link href="/faq" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-coral-300 hover:text-coral-200">How it works <FaArrowRight size={11} /></Link>
              <span className="absolute -right-4 -top-4 text-7xl font-black text-white/5 select-none">₿</span>
            </motion.div>
          </div>
        </div>

        {/* ---------- Category tiles ---------- */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {CATEGORY_TILES.map(({ label, href, Icon, count, color }) => (
            <motion.div key={href} variants={fade}>
              <Link href={href} className="group flex items-center gap-4 bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md rounded-xl p-4 transition-all">
                <span className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}><Icon size={18} /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-gray-900 truncate">{label}</span>
                  <span className="block text-xs text-gray-500">{count} products</span>
                </span>
                <FaArrowRight size={11} className="ml-auto text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
