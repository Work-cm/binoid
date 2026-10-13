'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useCart } from '@/components/cart/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaShoppingCart, FaUser, FaSearch, FaFlask, FaCannabis, FaSyringe, FaTimes, FaBars,
  FaSignOutAlt, FaUserShield, FaEnvelope, FaTelegramPlane, FaAtom, FaChevronDown,
  FaTruck, FaShieldAlt, FaBoxOpen,
} from 'react-icons/fa';
import Logo from '@/components/common/Logo';

const categories = [
  { href: '/products?category=cannabinoids', label: 'Cannabinoids', Icon: FaCannabis, desc: 'Synthetic & natural compounds' },
  { href: '/products?category=nitazenes', label: 'Nitazenes', Icon: FaSyringe, desc: 'Nitazene compounds' },
  { href: '/products?category=opioids', label: 'Opioids', Icon: FaAtom, desc: 'Opioid reference compounds' },
  { href: '/products?category=research%20chemicals', label: 'Research Chemicals', Icon: FaFlask, desc: 'Specialized compounds' },
];

const navLinks = [
  { href: '/products', label: 'Shop All' },
  { href: '/about', label: 'About' },
  { href: '/shipping', label: 'Shipping' },
  { href: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userRef = useRef(null);
  const catRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const cartCount = cart ? cart.reduce((s, i) => s + i.quantity, 0) : 0;
  const cartTotal = cart ? cart.reduce((s, i) => s + (Number(i.price ?? i.variant?.price ?? 0) * i.quantity), 0) : 0;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    setUserMenuOpen(false);
    setCatOpen(false);
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/products?search=${encodeURIComponent(q)}`);
  }, [query, router]);

  const isActive = (href) => {
    if (href === '/products') return pathname.startsWith('/products');
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white transition-shadow ${scrolled ? 'shadow-md shadow-indigo-950/5' : ''}`}>
        {/* ---------- Announcement bar ---------- */}
        <div className="bg-ink text-white">
          <div className="container mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4 text-[12px]">
            <div className="flex items-center gap-5 overflow-hidden">
              <span className="flex items-center gap-2 shrink-0"><FaTruck className="text-coral-400" /> Free discreet shipping on orders over &euro;500</span>
              <span className="hidden md:flex items-center gap-2 shrink-0 text-white/70"><FaShieldAlt className="text-indigo-300" /> COA with every order</span>
              <span className="hidden lg:flex items-center gap-2 shrink-0 text-white/70"><FaBoxOpen className="text-indigo-300" /> 48h dispatch</span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@binoidstore.com'}`} className="hidden sm:flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"><FaEnvelope /> Email</a>
              <a href="https://t.me/spaceoil7" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"><FaTelegramPlane /> Telegram</a>
              <span className="font-semibold text-coral-300">BTC / USDT accepted</span>
            </div>
          </div>
        </div>

        {/* ---------- Main bar ---------- */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 h-[68px] flex items-center gap-3 sm:gap-6">
            {/* Mobile menu */}
            <button onClick={() => setDrawerOpen(true)} className="lg:hidden w-10 h-10 -ml-2 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100" aria-label="Open menu">
              <FaBars size={18} />
            </button>

            {/* Logo */}
            <Link href="/" className="group shrink-0" aria-label="BinoidStore home">
              <Logo size={38} />
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-auto">
              <div className="flex w-full rounded-xl border-2 border-gray-200 focus-within:border-indigo-500 overflow-hidden transition-colors bg-gray-50 focus-within:bg-white">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search compounds, e.g. 5CL-ADBA, JWH-018..."
                  className="flex-1 bg-transparent border-0 focus:ring-0 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400"
                  aria-label="Search products"
                />
                <button type="submit" className="px-5 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 text-sm font-semibold transition-colors" aria-label="Search">
                  <FaSearch size={13} />
                  <span className="hidden lg:inline">Search</span>
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              {/* Account */}
              {mounted && user ? (
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2 h-10 px-2 sm:px-3 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Account menu"
                  >
                    <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">{user.name.charAt(0).toUpperCase()}</span>
                    <span className="hidden sm:flex flex-col items-start leading-none">
                      <span className="text-[10px] text-gray-500">Hello,</span>
                      <span className="text-sm font-semibold text-gray-900">{user.name.split(' ')[0]}</span>
                    </span>
                    <FaChevronDown size={10} className="hidden sm:block text-gray-400" />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-50"
                      >
                        <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                          <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"><FaUser size={12} /> My profile</Link>
                        <Link href="/account/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"><FaBoxOpen size={12} /> My orders</Link>
                        {user.isAdmin && (
                          <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"><FaUserShield size={12} /> Admin</Link>
                        )}
                        <div className="border-t border-gray-100 my-1" />
                        <button onClick={() => { setUserMenuOpen(false); logout(); }} className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-coral-50 hover:text-coral-700 transition-colors"><FaSignOutAlt size={12} /> Sign out</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/auth/login" className="flex items-center gap-2 h-10 px-2 sm:px-3 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Sign in">
                  <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"><FaUser size={13} /></span>
                  <span className="hidden sm:flex flex-col items-start leading-none">
                    <span className="text-[10px] text-gray-500">Welcome</span>
                    <span className="text-sm font-semibold text-gray-900">Sign in</span>
                  </span>
                </Link>
              )}

              {/* Cart */}
              <Link href="/cart" className="cart-icon relative flex items-center gap-2 h-10 px-2 sm:px-3 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Cart">
                <span className="relative w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <FaShoppingCart size={14} />
                  {mounted && cartCount > 0 && (
                    <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-coral-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center leading-none ring-2 ring-white">
                      {cartCount}
                    </motion.span>
                  )}
                </span>
                <span className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-[10px] text-gray-500">Cart</span>
                  <span className="text-sm font-semibold text-gray-900">&euro;{mounted ? cartTotal.toFixed(2) : '0.00'}</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="md:hidden container mx-auto px-4 pb-3">
            <div className="flex w-full rounded-xl border-2 border-gray-200 focus-within:border-indigo-500 overflow-hidden bg-gray-50 focus-within:bg-white transition-colors">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search compounds..."
                className="flex-1 bg-transparent border-0 focus:ring-0 px-4 py-2 text-sm text-gray-900 placeholder-gray-400"
                aria-label="Search products"
              />
              <button type="submit" className="px-4 bg-indigo-600 text-white" aria-label="Search"><FaSearch size={13} /></button>
            </div>
          </form>
        </div>

        {/* ---------- Category nav (desktop) ---------- */}
        <div className="hidden lg:block border-b border-gray-200 bg-white">
          <div className="container mx-auto px-6 h-11 flex items-center gap-1">
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setCatOpen(o => !o)}
                onMouseEnter={() => setCatOpen(true)}
                className={`flex items-center gap-2 h-11 px-4 -ml-4 text-sm font-semibold transition-colors border-b-2 ${catOpen ? 'text-indigo-700 border-indigo-600' : 'text-gray-900 border-transparent hover:text-indigo-700'}`}
                aria-expanded={catOpen}
              >
                <FaBars size={13} /> All Categories <FaChevronDown size={9} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }}
                    onMouseLeave={() => setCatOpen(false)}
                    className="absolute left-0 top-full w-[520px] bg-white border border-gray-200 rounded-b-xl rounded-tr-xl shadow-2xl p-3 z-50 grid grid-cols-2 gap-1"
                  >
                    {categories.map(({ href, label, Icon, desc }) => (
                      <Link key={href} href={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 group transition-colors">
                        <span className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Icon size={15} /></span>
                        <span>
                          <span className="block text-sm font-semibold text-gray-900">{label}</span>
                          <span className="block text-xs text-gray-500">{desc}</span>
                        </span>
                      </Link>
                    ))}
                    <Link href="/products" className="col-span-2 mt-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-semibold text-gray-700 transition-colors">Browse full catalog &rarr;</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {categories.map(({ href, label }) => (
              <Link key={href} href={href} className="h-11 px-4 flex items-center text-sm font-medium text-gray-700 hover:text-indigo-700 border-b-2 border-transparent hover:border-indigo-600 transition-colors">
                {label}
              </Link>
            ))}
            <span className="w-px h-5 bg-gray-200 mx-2" />
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={`h-11 px-4 flex items-center text-sm font-medium border-b-2 transition-colors ${isActive(href) ? 'text-indigo-700 border-indigo-600' : 'text-gray-700 border-transparent hover:text-indigo-700 hover:border-indigo-600'}`}>
                {label}
              </Link>
            ))}
            <Link href="/products?featured=true" className="ml-auto h-8 px-3.5 flex items-center gap-1.5 rounded-full bg-coral-50 text-coral-700 text-xs font-bold hover:bg-coral-100 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-coral-500 animate-pulse" /> New arrivals
            </Link>
          </div>
        </div>
      </header>

      {/* ---------- Mobile drawer ---------- */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
                <Logo size={32} />
                <button onClick={() => setDrawerOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600" aria-label="Close menu"><FaTimes /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4">
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Categories</p>
                {categories.map(({ href, label, Icon, desc }) => (
                  <Link key={href} href={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors">
                    <span className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0"><Icon size={14} /></span>
                    <span>
                      <span className="block text-sm font-semibold text-gray-900">{label}</span>
                      <span className="block text-xs text-gray-500">{desc}</span>
                    </span>
                  </Link>
                ))}

                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 mt-6 mb-2">Menu</p>
                {navLinks.map(({ href, label }) => (
                  <Link key={href} href={href} className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(href) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-800 hover:bg-gray-50'}`}>{label}</Link>
                ))}
                <Link href="/cart" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50">Cart {mounted && cartCount > 0 && <span className="ml-1 text-coral-600 font-bold">({cartCount})</span>}</Link>

                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 mt-6 mb-2">Account</p>
                {mounted && user ? (
                  <>
                    <Link href="/profile" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50">My profile</Link>
                    <Link href="/account/orders" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50">My orders</Link>
                    {user.isAdmin && <Link href="/admin" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50">Admin</Link>}
                    <button onClick={() => { setDrawerOpen(false); logout(); }} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-coral-700 hover:bg-coral-50">Sign out</button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50">Sign in</Link>
                    <Link href="/auth/register" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50">Create account</Link>
                  </>
                )}
              </div>

              <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@binoidstore.com'}`} className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold"><FaEnvelope /> Email</a>
                <a href="https://t.me/spaceoil7" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-semibold"><FaTelegramPlane /> Telegram</a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
