'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useCart } from '@/components/cart/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaShoppingCart, FaUser, FaSearch, FaFlask, FaCannabis, FaSyringe, FaTimes,
  FaSignOutAlt, FaUserShield, FaHome, FaInfoCircle, FaBoxOpen, FaWhatsapp, FaTelegramPlane, FaAtom,
} from 'react-icons/fa';
import Logo from '@/components/common/Logo';

const railLinks = [
  { href: '/', label: 'Home', Icon: FaHome, match: (p) => p === '/' },
  { href: '/products', label: 'Catalog', Icon: FaBoxOpen, match: (p) => p.startsWith('/products') },
  { href: '/about', label: 'About', Icon: FaInfoCircle, match: (p) => p.startsWith('/about') },
];

const shopCategories = [
  { href: '/products?category=cannabinoids', label: 'Cannabinoids', Icon: FaCannabis, desc: 'Synthetic & natural compounds' },
  { href: '/products?category=nitazenes', label: 'Nitazenes', Icon: FaSyringe, desc: 'Nitazene compounds' },
  { href: '/products?category=opioids', label: 'Opioids', Icon: FaAtom, desc: 'Opioid reference compounds' },
  { href: '/products?category=research%20chemicals', label: 'Research Chemicals', Icon: FaFlask, desc: 'Specialized compounds' },
];

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const searchRef = useRef(null);
  const userRef = useRef(null);
  const catalogRef = useRef(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const cartCount = cart ? cart.reduce((s, i) => s + i.quantity, 0) : 0;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    setSearchOpen(false);
    setUserMenuOpen(false);
    setCatalogOpen(false);
  }, [pathname]);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  useEffect(() => {
    const onClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
      if (catalogRef.current && !catalogRef.current.contains(e.target)) setCatalogOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setUserMenuOpen(false);
        setCatalogOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [searchOpen]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
  }, [searchQuery]);

  return (
    <>
      {/* ============ DESKTOP: LEFT RAIL ============ */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[88px] z-40 flex-col items-center bg-[#06130d] border-r border-white/[0.06]">
        {/* Vertical gradient hairline */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-600/0 via-lime-500/60 to-emerald-600/0" />

        {/* Logo mark */}
        <Link href="/" className="group mt-5 mb-8" aria-label="CannabinoidSite home">
          <Logo size={40} showWordmark={false} dark />
        </Link>

        {/* Nav */}
        <nav className="flex flex-col items-center gap-1 w-full px-3">
          {railLinks.map(({ href, label, Icon, match }) => {
            const active = match(pathname);
            const isCatalog = href === '/products';
            return (
              <div key={href} className="relative w-full" ref={isCatalog ? catalogRef : undefined}>
                <Link
                  href={href}
                  onMouseEnter={() => isCatalog && setCatalogOpen(true)}
                  className="group relative flex flex-col items-center gap-1.5 w-full py-3 rounded-2xl transition-colors"
                >
                  {active && (
                    <motion.span layoutId="railPill" className="absolute inset-0 rounded-2xl bg-lime-500/12 border border-lime-400/25" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                  {active && <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-full bg-gradient-to-b from-emerald-400 to-lime-400 shadow-[0_0_12px_rgba(132,204,22,0.8)]" />}
                  <Icon className={`relative z-10 text-base transition-colors ${active ? 'text-lime-300' : 'text-white/45 group-hover:text-lime-300'}`} />
                  <span className={`relative z-10 text-[9px] font-bold uppercase tracking-[0.18em] transition-colors ${active ? 'text-lime-200' : 'text-white/40 group-hover:text-white/80'}`}>{label}</span>
                </Link>

                {/* Catalog flyout */}
                {isCatalog && (
                  <AnimatePresence>
                    {catalogOpen && (
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        onMouseLeave={() => setCatalogOpen(false)}
                        className="absolute left-full top-0 ml-4 w-72 z-50"
                      >
                        <div className="bg-[#0b1f16] border border-lime-500/20 rounded-2xl shadow-2xl shadow-emerald-950/60 overflow-hidden">
                          <div className="h-[2px] bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-600" />
                          <div className="p-2">
                            <p className="text-[10px] text-lime-300/60 uppercase tracking-widest px-3 py-1.5 font-bold">Browse by category</p>
                            {shopCategories.map(({ href: h, label: l, Icon: I, desc }) => (
                              <Link key={h} href={h} onClick={() => setCatalogOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-lime-500/10 group/item transition-all">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center shrink-0 group-hover/item:bg-lime-500/20 transition-colors">
                                  <I className="text-lime-300 text-xs" />
                                </div>
                                <div>
                                  <p className="text-white/85 text-sm font-semibold group-hover/item:text-lime-300 transition-colors leading-none">{l}</p>
                                  <p className="text-white/40 text-xs mt-0.5">{desc}</p>
                                </div>
                              </Link>
                            ))}
                            <div className="mt-1 pt-2 border-t border-white/10">
                              <Link href="/products" onClick={() => setCatalogOpen(false)} className="flex items-center justify-center py-1.5 text-xs text-lime-300 hover:text-lime-200 font-semibold transition-colors">Full catalog &rarr;</Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Contact shortcuts */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <a href="https://wa.me/15125922145" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-emerald-400/80 hover:text-emerald-300 hover:border-emerald-400/40 hover:bg-emerald-500/10 transition-all">
            <FaWhatsapp size={15} />
          </a>
          <a href="https://t.me/cannachem" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-blue-400/80 hover:text-blue-300 hover:border-blue-400/40 hover:bg-blue-500/10 transition-all">
            <FaTelegramPlane size={15} />
          </a>
        </div>

        {/* Vertical domain tag */}
        <p className="mb-5 text-[9px] font-bold tracking-[0.3em] uppercase text-white/25 [writing-mode:vertical-rl] rotate-180 select-none">cannabinoidsite.com</p>
      </aside>

      {/* ============ TOP UTILITY BAR (all sizes) ============ */}
      <header className="fixed top-0 right-0 left-0 lg:left-[88px] z-40 h-14 lg:h-12 bg-[#06130d]/85 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Mobile logo / Desktop breadcrumb-ish status */}
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="lg:hidden group shrink-0"><Logo size={30} dark /></Link>
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-semibold tracking-wide text-white/40 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse shrink-0" />
              <span className="truncate">Lab-verified cannabinoids &middot; 48h dispatch &middot; Worldwide</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 h-9 lg:h-8 px-3 rounded-xl border border-white/10 text-white/50 hover:text-lime-300 hover:border-lime-400/40 hover:bg-lime-500/10 transition-all"
              aria-label="Search"
            >
              <FaSearch size={12} />
              <span className="hidden sm:inline text-xs">Search compounds</span>
              <kbd className="hidden lg:inline-flex items-center ml-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-white/40">Ctrl K</kbd>
            </button>

            {/* Cart (desktop only — mobile has tab bar) */}
            <Link href="/cart" className="relative cart-icon hidden lg:flex w-9 h-8 items-center justify-center rounded-xl text-white/70 hover:text-lime-300 hover:bg-lime-500/10 transition-all">
              <FaShoppingCart size={14} />
              {cartCount > 0 && (
                <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-lime-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none shadow-md shadow-lime-500/40">
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* User */}
            {mounted && user && (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className={`flex items-center gap-2 h-9 lg:h-8 pl-1 pr-2 rounded-xl border text-sm transition-all ${userMenuOpen ? 'border-lime-400/40 bg-lime-500/10' : 'border-white/10 hover:border-lime-400/40'}`}
                  aria-label="Account menu"
                >
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-lime-500 flex items-center justify-center text-white text-[11px] font-black">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="hidden md:block text-white/70 text-xs font-semibold">{user.name.split(' ')[0]}</span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-[#0b1f16] border border-lime-500/20 rounded-2xl shadow-2xl shadow-emerald-950/60 py-1.5 z-50"
                    >
                      <div className="px-4 py-2 border-b border-white/10 mb-1">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/40 truncate">{user.email}</p>
                      </div>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-lime-300 hover:bg-lime-500/10 transition-colors">
                        <FaUser size={12} /> Profile
                      </Link>
                      {user.isAdmin && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-lime-300 hover:bg-lime-500/10 transition-colors">
                          <FaUserShield size={12} /> Admin
                        </Link>
                      )}
                      <div className="border-t border-white/10 my-1" />
                      <button onClick={() => { setUserMenuOpen(false); logout(); }} className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-lime-300 hover:bg-lime-500/10 transition-colors">
                        <FaSignOutAlt size={12} /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============ MOBILE: BOTTOM TAB BAR ============ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#06130d]/95 backdrop-blur-xl border-t border-white/[0.06] pb-[env(safe-area-inset-bottom)]">
        <div className="h-[2px] bg-gradient-to-r from-emerald-600 via-lime-500 to-emerald-600" />
        <div className="grid grid-cols-4 h-16">
          {railLinks.map(({ href, label, Icon, match }) => {
            const active = match(pathname);
            return (
              <Link key={href} href={href} className="relative flex flex-col items-center justify-center gap-1">
                {active && <motion.span layoutId="tabDot" className="absolute top-1.5 w-1 h-1 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.9)]" />}
                <Icon className={`text-base ${active ? 'text-lime-300' : 'text-white/45'}`} />
                <span className={`text-[9px] font-bold uppercase tracking-[0.16em] ${active ? 'text-lime-200' : 'text-white/40'}`}>{label}</span>
              </Link>
            );
          })}
          <Link href="/cart" className="relative cart-icon flex flex-col items-center justify-center gap-1">
            {pathname.startsWith('/cart') && <motion.span layoutId="tabDot" className="absolute top-1.5 w-1 h-1 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.9)]" />}
            <span className="relative">
              <FaShoppingCart className={`text-base ${pathname.startsWith('/cart') ? 'text-lime-300' : 'text-white/45'}`} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-gradient-to-r from-emerald-500 to-lime-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none">{cartCount}</span>
              )}
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-[0.16em] ${pathname.startsWith('/cart') ? 'text-lime-200' : 'text-white/40'}`}>Cart</span>
          </Link>
        </div>
      </nav>

      {/* ============ SEARCH OVERLAY ============ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-24 sm:pt-32 bg-[#06130d]/70 backdrop-blur-md"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-[#0b1f16] rounded-2xl shadow-2xl shadow-emerald-950/60 overflow-hidden border border-lime-500/25"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                <FaSearch className="text-lime-400 shrink-0" size={16} />
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Search compounds, categories..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white text-base outline-none placeholder-white/30 border-0 focus:ring-0 p-0"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-white/40 hover:text-white shrink-0" aria-label="Close search">
                  <FaTimes size={14} />
                </button>
              </form>
              <div className="p-3">
                <p className="text-[10px] text-lime-300/60 uppercase tracking-widest font-bold px-2 pb-2">Quick categories</p>
                <div className="grid grid-cols-1 gap-1">
                  {shopCategories.map(({ href, label, Icon, desc }) => (
                    <Link key={href} href={href} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-lime-500/10 transition-all group/item">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center shrink-0 group-hover/item:bg-lime-500/20 transition-colors">
                        <Icon className="text-lime-300 text-xs" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/85 text-sm font-semibold leading-none">{label}</p>
                        <p className="text-white/40 text-xs mt-0.5 truncate">{desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
