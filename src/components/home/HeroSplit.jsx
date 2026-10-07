'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowRight, FaFlask, FaCertificate, FaTruck, FaGlobeAmericas, FaCannabis } from 'react-icons/fa';

const FALLBACK_ROWS = [
  { name: '5CL-ADBA', category: 'cannabinoids', purity: '99.8%', price: 120 },
  { name: 'ADB-BUTINACA', category: 'cannabinoids', purity: '99.6%', price: 110 },
  { name: 'JWH-018', category: 'cannabinoids', purity: '99.4%', price: 95 },
  { name: '5F-ADB', category: 'cannabinoids', purity: '99.6%', price: 105 },
  { name: 'MDMB-4en-PINACA', category: 'cannabinoids', purity: '99.7%', price: 115 },
  { name: 'Isotonitazene', category: 'nitazenes', purity: '99.9%', price: 180 },
  { name: 'Metonitazene', category: 'nitazenes', purity: '99.7%', price: 175 },
  { name: 'Protonitazene', category: 'nitazenes', purity: '99.5%', price: 170 },
  { name: 'Morphine Sulfate', category: 'opioids', purity: '99.8%', price: 160 },
  { name: 'Oxycodone HCl', category: 'opioids', purity: '99.6%', price: 155 },
];

const CATEGORY_CHIPS = [
  { label: 'Cannabinoids', href: '/products?category=cannabinoids', primary: true },
  { label: 'Nitazenes', href: '/products?category=nitazenes' },
  { label: 'Opioids', href: '/products?category=opioids' },
  { label: 'Research chemicals', href: '/products?category=research%20chemicals' },
];

function getPrice(p) {
  if (p.priceVariants?.length) return p.priceVariants.reduce((m, v) => (v.price < m ? v.price : m), p.priceVariants[0].price);
  if (p.price && p.price > 0) return p.price;
  return 0;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

export default function HeroSplit({ products = [] }) {
  const rows = products.length
    ? products.map(p => ({ name: p.name, slug: p.slug, category: p.category, purity: p.purity || '99%+', price: getPrice(p), inStock: p.countInStock > 0 }))
    : FALLBACK_ROWS.map(r => ({ ...r, inStock: true }));

  const looped = [...rows, ...rows];

  return (
    <section className="relative bg-[#06130d] text-white overflow-hidden lg:min-h-[62vh] flex items-stretch">
      {/* Background grid + glow */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)', backgroundSize: '72px 72px' }} />
      <div className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-emerald-600/30 blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[520px] h-[520px] rounded-full bg-lime-600/20 blur-[160px] pointer-events-none" />
      {/* Oversized watermark leaf */}
      <FaCannabis className="absolute -right-16 -bottom-20 text-[26rem] text-emerald-400/[0.04] pointer-events-none select-none hidden lg:block" aria-hidden />

      <div className="relative z-10 w-full grid lg:grid-cols-[1.25fr_1fr] pt-14 lg:pt-12">
        {/* ============ LEFT — STACKED HEADLINE ============ */}
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col justify-between px-6 sm:px-10 lg:px-14 py-10 lg:py-12 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
          <div>
            <motion.div variants={item} className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase text-lime-300/90 border border-lime-400/25 bg-lime-500/10 rounded-md px-2.5 py-1">
                <FaCannabis className="text-[11px]" /> Cannabinoid specialists
              </span>
              <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-emerald-500/60 to-transparent" />
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/30">Lot 2026-A</span>
            </motion.div>

            <h1 className="font-display font-extrabold leading-[0.88] tracking-[-0.04em]">
              <motion.span variants={item} className="block text-[clamp(1.6rem,3.2vw,2.75rem)] text-white/70 font-semibold tracking-[-0.02em] mb-2">Premium research</motion.span>
              <motion.span variants={item} className="block text-[clamp(2.9rem,7.2vw,6.5rem)] text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-300 to-emerald-200">Cannabinoids</motion.span>
              <motion.span variants={item} className="block text-[clamp(2.5rem,6vw,5.5rem)] text-white/90 italic font-medium">lab verified.</motion.span>
            </h1>

            <motion.p variants={item} className="mt-6 max-w-md text-white/55 text-sm sm:text-base leading-relaxed">
              5CL-ADBA, ADB-BUTINACA, JWH-018 and the full synthetic cannabinoid range — plus nitazenes, opioids and novel research chemicals. Every batch independently tested, every order shipped with its Certificate of Analysis.
            </motion.p>

            <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-4">
              <Link href="/products?category=cannabinoids" className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-400 to-lime-400 text-[#06130d] font-display font-bold text-sm px-6 py-3.5 rounded-2xl hover:from-emerald-300 hover:to-lime-300 transition-colors shadow-lg shadow-emerald-500/20">
                Shop cannabinoids
                <span className="w-7 h-7 rounded-xl bg-[#06130d] text-white flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:rotate-[-45deg]">
                  <FaArrowRight size={11} />
                </span>
              </Link>
              <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white border border-white/15 hover:border-emerald-400/50 rounded-2xl px-5 py-3.5 transition-colors">
                Full catalog
              </Link>
            </motion.div>

            <motion.div variants={item} className="mt-5 flex flex-wrap items-center gap-2">
              {CATEGORY_CHIPS.map(({ label, href, primary }) => (
                <Link
                  key={href}
                  href={href}
                  className={`font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border transition-colors ${primary ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25' : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'}`}
                >
                  {label}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Bottom proof row — pill chips */}
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            {[
              { Icon: FaCertificate, v: '99.9%', l: 'Avg. purity' },
              { Icon: FaTruck, v: '48h', l: 'Dispatch' },
              { Icon: FaGlobeAmericas, v: '50+', l: 'Countries' },
            ].map(({ Icon, v, l }) => (
              <div key={l} className="flex items-center gap-3 pl-2 pr-5 py-2 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/30 to-lime-500/30 border border-lime-400/30 flex items-center justify-center shrink-0">
                  <Icon className="text-lime-300 text-[10px]" />
                </span>
                <span>
                  <span className="block font-display font-bold text-lg leading-none">{v}</span>
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-white/40 mt-1">{l}</span>
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ============ RIGHT — LIVE CATALOG BOARD ============ */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col min-h-[340px] lg:min-h-0"
        >
          {/* Faint image behind */}
          <div className="absolute inset-0 opacity-20">
            <Image src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80&auto=format&fit=crop" alt="" fill sizes="50vw" className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-[#06130d] via-[#06130d]/40 to-[#06130d]" />
          </div>

          {/* Board header */}
          <div className="relative z-10 flex items-center justify-between px-6 sm:px-8 pt-6 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">Live inventory</span>
            </div>
            <span className="font-mono text-[11px] text-white/30">{rows.length} listed</span>
          </div>

          {/* Column labels */}
          <div className="relative z-10 grid grid-cols-[1fr_auto_auto] gap-4 px-6 sm:px-8 pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
            <span>Compound</span>
            <span className="w-16 text-right">Purity</span>
            <span className="w-20 text-right">From</span>
          </div>

          {/* Scrolling rows */}
          <div className="relative z-10 flex-1 overflow-hidden border-y border-white/[0.06]" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}>
            <div className="animate-ticker-vertical" style={{ animationDuration: `${Math.max(rows.length * 3.2, 18)}s` }}>
              {looped.map((r, i) => (
                <Link
                  key={`${r.name}-${i}`}
                  href={r.slug ? `/products/${r.slug}` : '/products'}
                  className="group grid grid-cols-[1fr_auto_auto] gap-4 items-center px-6 sm:px-8 h-[60px] border-b border-white/[0.05] hover:bg-lime-500/[0.07] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 shrink-0 flex items-center justify-center bg-emerald-500/15 border border-emerald-400/20 group-hover:bg-lime-500/20 transition-colors" style={{ borderRadius: '62% 38% 55% 45% / 48% 62% 38% 52%' }}>
                      <FaFlask className="text-lime-300 text-[10px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white/90 truncate group-hover:text-lime-200 transition-colors">{r.name}</p>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 truncate">{r.category}</p>
                    </div>
                  </div>
                  <span className="w-16 text-right font-mono text-xs text-emerald-300/90">{r.purity}</span>
                  <span className="w-20 text-right font-mono text-sm text-white/80">{r.price > 0 ? `€${r.price.toFixed(0)}` : '—'}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Board footer */}
          <div className="relative z-10 px-6 sm:px-8 py-4 flex items-center justify-between">
            <p className="text-[11px] text-white/35">Prices shown are starting prices per listing.</p>
            <Link href="/products" className="text-xs font-bold text-lime-300 hover:text-white transition-colors inline-flex items-center gap-1.5">
              All compounds <FaArrowRight size={9} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
