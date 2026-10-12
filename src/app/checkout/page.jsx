'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import OrderSummary from '@/components/checkout/OrderSummary';
import OrderContactForm from '@/components/checkout/OrderContactForm';
import { FaLock } from 'react-icons/fa';

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({
    subtotal: 0,
    shipping: 40,
    tax: 0,
    total: 0
  });

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + ((item.price ?? 0) * item.quantity), 0);
    const shipping = 40; // Flat shipping fee
    const tax = 0; // No tax
    const total = subtotal + shipping + tax;

    setOrderDetails({ subtotal, shipping, tax, total });
    setLoading(false);
  }, [router, cart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb + secure badge */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-900">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-gray-900">Cart</Link>
            <span>/</span>
            <span className="text-gray-900">Checkout</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1">
            <FaLock className="text-xs" />
            Secure Checkout
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Complete Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Order contact form */}
            <OrderContactForm cart={cart} orderDetails={orderDetails} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <OrderSummary cartItems={cart} orderDetails={orderDetails} />

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-500 font-black text-base leading-none">₿</span>
                <h3 className="text-sm font-bold text-gray-900">Payment: BTC/USDT only</h3>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                We accept Bitcoin (BTC) or USDT as our only payment methods. After placing your
                order, we&apos;ll send you our wallet address and the exact amount via email or Telegram.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Need help?</h3>
              <p className="text-gray-500 text-xs mb-4 leading-relaxed">
                Questions about your order? Our team is here to assist.
              </p>
              <a href="https://t.me/chemsolution12maf" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sky-500 hover:text-sky-600 text-sm font-semibold transition-colors">
                Chat on Telegram &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
