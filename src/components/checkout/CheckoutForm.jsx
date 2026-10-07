'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaSpinner, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useCart } from '@/components/cart/CartProvider';

export default function CheckoutForm({ orderDetails }) {
  const router = useRouter();
  const { cart } = useCart();

  const [errorMessage, setErrorMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleChange = (e) => {
    setBillingDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMessage('');

    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billingDetails: {
            name: billingDetails.name,
            email: billingDetails.email,
            phone: billingDetails.phone,
            address: {
              line1: billingDetails.address,
              city: billingDetails.city,
              postal_code: billingDetails.postalCode,
              country: billingDetails.country,
            },
          },
          orderTotal: orderDetails.total,
          cartItems: cart,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || 'Failed to create order');

      await fetch('/api/cart/clear', { method: 'POST' });
      router.push(`/checkout/success?order_id=${orderData._id}`);
    } catch (error) {
      console.error('Order error:', error);
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const inputClass = 'bg-white border border-gray-200 text-gray-900 rounded-xl py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-400 text-sm';
  const labelClass = 'block text-xs font-medium text-gray-900 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      <h3 className="text-gray-900 font-semibold text-sm">Billing Information</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input name="name" type="text" required value={billingDetails.name} onChange={handleChange}
            placeholder="John Doe" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input name="email" type="email" required value={billingDetails.email} onChange={handleChange}
            placeholder="john@example.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Phone Number</label>
          <input name="phone" type="tel" value={billingDetails.phone} onChange={handleChange}
            placeholder="+1 234 567 8900" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <input name="country" type="text" required value={billingDetails.country} onChange={handleChange}
            placeholder="United States" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Street Address</label>
          <input name="address" type="text" required value={billingDetails.address} onChange={handleChange}
            placeholder="123 Main Street" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>City</label>
          <input name="city" type="text" required value={billingDetails.city} onChange={handleChange}
            placeholder="New York" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Postal Code</label>
          <input name="postalCode" type="text" required value={billingDetails.postalCode} onChange={handleChange}
            placeholder="10001" className={inputClass} />
        </div>
      </div>

      <button
        type="submit"
        disabled={processing}
        className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 text-[#06130d] font-bold py-3 px-6 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-500/25 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
      >
        {processing ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Placing Order...
          </>
        ) : (
          <>
            <FaLock className="mr-2 text-xs" />
            Place Order &mdash; &euro;{orderDetails.total.toFixed(2)}
          </>
        )}
      </button>

      <p className="text-gray-900 text-xs text-center">
        By placing your order you agree to be contacted with payment instructions via email.
      </p>
    </form>
  );
}
