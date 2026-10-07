'use client';

import Link from 'next/link';
import { FaTelegramPlane, FaWhatsapp, FaArrowRight } from 'react-icons/fa';
import Logo from '@/components/common/Logo';

const columns = [
  {
    title: 'Catalog',
    links: [
      { href: '/products', label: 'All compounds' },
      { href: '/products?category=cannabinoids', label: 'Cannabinoids' },
      { href: '/products?category=nitazenes', label: 'Nitazenes' },
      { href: '/products?category=opioids', label: 'Opioids' },
      { href: '/products?category=research%20chemicals', label: 'Research chemicals' },
      { href: '/products?category=etomidate', label: 'Etomidate' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/faq', label: 'FAQ' },
      { href: '/shipping', label: 'Shipping' },
      { href: '/refund', label: 'Returns' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/terms', label: 'Terms' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#06130d] text-white overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-emerald-600 via-lime-400 to-emerald-600" />
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] rounded-full bg-lime-700/15 blur-[160px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 pt-16 pb-8">
        {/* Top row: contact pills + columns */}
        <div className="grid lg:grid-cols-[1.2fr_2fr] gap-12 lg:gap-20 pb-16 border-b border-white/[0.08]">
          <div>
            <Link href="/" className="group inline-block mb-6"><Logo size={40} dark /></Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-8">
              Premium synthetic cannabinoids and research chemicals, verified for scientific excellence. Trusted by laboratories and researchers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <a href="https://wa.me/15125922145" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-between gap-4 border border-emerald-400/30 hover:border-emerald-400 hover:bg-emerald-500/10 text-white font-semibold text-sm px-5 py-3.5 rounded-full transition-all">
                <span className="flex items-center gap-3"><FaWhatsapp className="text-emerald-400" size={16} /> WhatsApp support</span>
                <FaArrowRight size={11} className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </a>
              <a href="https://t.me/cannachem" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-between gap-4 border border-blue-400/30 hover:border-blue-400 hover:bg-blue-500/10 text-white font-semibold text-sm px-5 py-3.5 rounded-full transition-all">
                <span className="flex items-center gap-3"><FaTelegramPlane className="text-blue-400" size={15} /> @cannachem</span>
                <FaArrowRight size={11} className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </a>
              <div className="inline-flex items-center gap-3 border border-amber-400/30 bg-amber-500/10 text-white font-semibold text-sm px-5 py-3.5 rounded-full">
                <span className="text-amber-400 font-black text-lg leading-none">₿</span>
                <span>Payment: <span className="text-amber-300">Bitcoin (BTC/USDT) only</span></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {columns.map(({ title, links }) => (
              <div key={title}>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-lime-300/70 mb-5">{title}</p>
                <ul className="space-y-3">
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} className="font-display text-base sm:text-lg font-semibold text-white/70 hover:text-white transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="pt-10 pb-6 select-none" aria-hidden>
          <p className="font-display font-extrabold leading-[0.8] tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-b from-white/[0.14] to-white/[0.02] whitespace-nowrap overflow-hidden" style={{ fontSize: 'clamp(3.5rem, 13.5vw, 15rem)' }}>
            CANNABINOID
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t border-white/[0.08]">
          <p className="text-white/35 text-xs">&copy; {new Date().getFullYear()} CannabinoidSite. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-white/35">
            {['Lab verified', 'Batch COA', 'Discreet packaging', '48h dispatch', 'BTC/USDT only'].map(b => (
              <span key={b} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-lime-400" />{b}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
