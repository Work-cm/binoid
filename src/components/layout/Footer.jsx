'use client';

import Link from 'next/link';
import { FaTelegramPlane, FaEnvelope, FaTruck, FaShieldAlt, FaLock, FaHeadset } from 'react-icons/fa';
import Logo from '@/components/common/Logo';

const columns = [
  {
    title: 'Shop',
    links: [
      { href: '/products', label: 'All products' },
      { href: '/products?category=cannabinoids', label: 'Cannabinoids' },
      { href: '/products?category=nitazenes', label: 'Nitazenes' },
      { href: '/products?category=opioids', label: 'Opioids' },
      { href: '/products?category=research%20chemicals', label: 'Research chemicals' },
    ],
  },
  {
    title: 'Customer care',
    links: [
      { href: '/faq', label: 'FAQ' },
      { href: '/shipping', label: 'Shipping & delivery' },
      { href: '/refund', label: 'Returns & refunds' },
      { href: '/account/orders', label: 'Track my order' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/terms', label: 'Terms of service' },
      { href: '/privacy', label: 'Privacy policy' },
    ],
  },
];

const perks = [
  { Icon: FaTruck, title: 'Fast dispatch', desc: 'Orders ship within 48 hours' },
  { Icon: FaShieldAlt, title: 'Lab verified', desc: 'COA included with every order' },
  { Icon: FaLock, title: 'Discreet packaging', desc: 'Plain, unmarked parcels' },
  { Icon: FaHeadset, title: '24h support', desc: 'Telegram or email' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Perks strip */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0"><Icon size={16} /></span>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid lg:grid-cols-[1.4fr_2fr] gap-12 lg:gap-16 pb-12 border-b border-gray-200">
          <div>
            <Link href="/" className="group inline-block mb-5"><Logo size={40} /></Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
              BinoidStore is your trusted online store for premium synthetic cannabinoids and
              laboratory-grade research chemicals. Every batch is independently tested and shipped
              discreetly worldwide.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@binoidstore.com'}`} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
                <FaEnvelope size={13} /> Email us
              </a>
              <a href="https://t.me/chemsolution12maf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
                <FaTelegramPlane size={14} /> Telegram
              </a>
            </div>
            <div className="mt-6 inline-flex items-center gap-2.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold px-3.5 py-2 rounded-lg">
              <span className="text-amber-500 font-black text-base leading-none">₿</span>
              Payment accepted in Bitcoin (BTC) and USDT only
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {columns.map(({ title, links }) => (
              <div key={title}>
                <p className="text-sm font-bold text-gray-900 mb-4">{title}</p>
                <ul className="space-y-2.5">
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} className="text-sm text-gray-500 hover:text-indigo-700 transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6">
          <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} BinoidStore &middot; binoidstore.com. All rights reserved.</p>
          <p className="text-gray-400 text-[11px] max-w-xl sm:text-right">
            Products are sold strictly for laboratory research purposes. Not for human or veterinary consumption.
          </p>
        </div>
      </div>
    </footer>
  );
}
