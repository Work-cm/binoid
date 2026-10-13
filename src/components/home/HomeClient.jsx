'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaFlask, FaStar, FaQuoteLeft, FaTelegramPlane, FaEnvelope, FaArrowRight, FaShieldAlt, FaTruck, FaLock, FaHeadset, FaCheckCircle } from 'react-icons/fa';
import SEOKeywords from '@/components/seo/SEOKeywords';
import HomeSEOContent from '@/components/seo/HomeSEOContent';
import HeroSplit from '@/components/home/HeroSplit';
import ProductCard from '@/components/product/ProductCard';

export default function HomeClient({ featuredProducts = [] }) {
  return (
    <div className="min-h-screen bg-white">
      <SEOKeywords />
      <HeroSplit products={featuredProducts} />
      <FeaturedProducts products={featuredProducts} />
      <WhyUs />
      <PromoBanner />
      <Testimonials />
      <HomeSEOContent />
      <ContactCTA />
    </div>
  );
}

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function SectionHeader({ eyebrow, title, action, actionHref }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-7">
      <div>
        {eyebrow && <p className="text-[11px] font-bold uppercase tracking-wider text-coral-600 mb-1.5">{eyebrow}</p>}
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
      </div>
      {action && (
        <Link href={actionHref} className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:text-indigo-800 whitespace-nowrap">
          {action} <FaArrowRight size={11} />
        </Link>
      )}
    </div>
  );
}

/* ================= FEATURED PRODUCTS ================= */
function FeaturedProducts({ products = [] }) {
  const [tab, setTab] = useState('all');
  const cats = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))].slice(0, 5);
  const list = (tab === 'all' ? products : products.filter(p => p.category === tab)).slice(0, 8);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <FadeUp>
          <SectionHeader eyebrow="Handpicked" title="Featured products" action="View all products" actionHref="/products" />
          {cats.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {cats.map(c => (
                <button
                  key={c}
                  onClick={() => setTab(c)}
                  className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-colors ${tab === c ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>
          )}
        </FadeUp>

        {list.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {list.map((p, i) => (
              <FadeUp key={p._id} delay={Math.min(i * 0.05, 0.3)}>
                <ProductCard product={p} />
              </FadeUp>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 border border-dashed border-gray-300 rounded-2xl">
            <FaFlask className="text-4xl mx-auto mb-3 opacity-30" />
            <p className="text-sm">No featured products at the moment.</p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-bold px-6 py-3 rounded-xl">View all products <FaArrowRight size={11} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ================= WHY US ================= */
const perks = [
  { Icon: FaShieldAlt, title: 'Lab-verified purity', desc: 'Every batch is independently tested. Your Certificate of Analysis ships with your order.' },
  { Icon: FaTruck, title: '48-hour dispatch', desc: 'Orders are packed and shipped within two business days with full tracking.' },
  { Icon: FaLock, title: 'Discreet packaging', desc: 'Plain, unmarked parcels with no reference to the contents or our store.' },
  { Icon: FaHeadset, title: 'Real human support', desc: 'Questions on handling or storage? Reach us on Telegram or email.' },
];

function WhyUs() {
  return (
    <section className="py-14 sm:py-16 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        <FadeUp>
          <SectionHeader eyebrow="Why BinoidStore" title="Built for serious researchers" />
        </FadeUp>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map(({ Icon, title, desc }, i) => (
            <FadeUp key={title} delay={i * 0.06}>
              <div className="bg-white border border-gray-200 rounded-xl p-6 h-full hover:border-indigo-300 hover:shadow-md transition-all">
                <span className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4"><Icon size={18} /></span>
                <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= PROMO BANNER ================= */
function PromoBanner() {
  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <FadeUp>
          <div className="relative overflow-hidden rounded-2xl bg-ink text-white grid lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-12">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3.5 py-1.5 text-xs font-semibold text-indigo-200">Quality guarantee</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-5 leading-tight tracking-tight">
                99.9% average purity.<br /><span className="text-coral-400">Certified on every batch.</span>
              </h2>
              <p className="mt-4 text-white/70 text-sm sm:text-base max-w-md leading-relaxed">
                We work only with ISO-compliant labs. If a compound does not meet spec, it never reaches our shelves — and it never reaches you.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/85">
                {['HPLC & GC-MS tested', 'COA attached to every order confirmation', 'ISO-compliant cold-chain storage'].map(t => (
                  <li key={t} className="flex items-center gap-2.5"><FaCheckCircle className="text-coral-400 shrink-0" /> {t}</li>
                ))}
              </ul>
              <Link href="/about" className="mt-8 inline-flex items-center gap-2 bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors">
                Learn about our process <FaArrowRight size={12} />
              </Link>
            </div>
            <div className="relative h-64 lg:h-full min-h-[320px]">
              <Image src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&q=80&auto=format&fit=crop" alt="Laboratory analysis" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent lg:bg-gradient-to-r" />
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ================= TESTIMONIALS ================= */
const testimonials = [
  { text: "BinoidStore's quality is unmatched. Their cannabinoids have been instrumental in advancing our research programme.", author: 'Dr. J. Smith', role: 'Research Scientist', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { text: 'Fast shipping, excellent service. Purity consistently exceeds our lab expectations every single time we order.', author: 'L. Johnson', role: 'Laboratory Director', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { text: 'We rely on BinoidStore for all our chemical needs. Their quality control processes are genuinely impressive.', author: 'M. Williams', role: 'Chemical Analyst', img: 'https://randomuser.me/api/portraits/men/52.jpg' },
  { text: 'Their compounds significantly accelerated our development timeline. Consistently high quality and reliability.', author: 'Dr. A. Rodriguez', role: 'Pharmaceutical Researcher', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { text: 'Professional grade COA on every product. Prompt support and discreet packaging — exactly what we need.', author: 'T. Okafor', role: 'Independent Researcher', img: 'https://randomuser.me/api/portraits/men/36.jpg' },
];

function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];

  return (
    <section className="py-14 sm:py-16 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        <FadeUp>
          <SectionHeader eyebrow="Reviews" title="Trusted by 10,000+ researchers" />
        </FadeUp>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Featured quote */}
          <FadeUp className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-7 sm:p-10 h-full flex flex-col">
              <FaQuoteLeft className="text-indigo-200 text-3xl mb-5" />
              <AnimatePresence mode="wait">
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="flex-1">
                  <p className="font-display text-xl sm:text-2xl font-semibold text-gray-900 leading-relaxed">{t.text}</p>
                  <div className="mt-7 flex items-center gap-4">
                    <span className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-indigo-100"><Image src={t.img} alt={t.author} fill sizes="48px" className="object-cover" /></span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.author}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">{[1,2,3,4,5].map(n => <FaStar key={n} className="text-amber-400 text-xs" />)}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-7 flex gap-2">
                {testimonials.map((_, idx) => (
                  <button key={idx} onClick={() => setI(idx)} aria-label={`Show review ${idx + 1}`} className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-8 bg-indigo-600' : 'w-3 bg-gray-300 hover:bg-gray-400'}`} />
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Rating summary */}
          <FadeUp delay={0.1}>
            <div className="bg-indigo-600 text-white rounded-2xl p-7 h-full flex flex-col justify-between">
              <div>
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Average rating</p>
                <p className="font-display font-extrabold text-6xl mt-2 leading-none">4.9</p>
                <div className="flex gap-1 mt-3">{[1,2,3,4,5].map(n => <FaStar key={n} className="text-coral-300" />)}</div>
                <p className="text-indigo-100 text-sm mt-3">Based on 2,400+ verified reviews</p>
              </div>
              <div className="mt-8 space-y-2.5">
                {[['Quality', 98], ['Shipping', 96], ['Support', 97]].map(([l, v]) => (
                  <div key={l}>
                    <div className="flex justify-between text-xs mb-1"><span>{l}</span><span className="text-indigo-200">{v}%</span></div>
                    <div className="h-1.5 rounded-full bg-white/15 overflow-hidden"><div className="h-full bg-coral-400 rounded-full" style={{ width: `${v}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ================= CONTACT CTA ================= */
function ContactCTA() {
  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <FadeUp>
          <div className="bg-gradient-to-br from-indigo-50 to-coral-50 border border-indigo-100 rounded-2xl p-8 sm:p-12 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-coral-600 mb-2">Need help ordering?</p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Talk to a real person.</h2>
              <p className="mt-3 text-gray-600 max-w-lg leading-relaxed">
                Questions about a compound, bulk pricing or shipping to your country? We reply within 24 hours — by Telegram or email.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@binoidstore.com'}`} className="inline-flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors min-w-[220px]">
                <FaEnvelope size={15} /> Email us
              </a>
              <a href="https://t.me/spaceoil7" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors min-w-[220px]">
                <FaTelegramPlane size={16} /> Telegram
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
