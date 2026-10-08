'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaTelegramPlane,
  FaWhatsapp,
  FaPaperPlane,
  FaUser,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCommentDots,
  FaCheckCircle,
} from 'react-icons/fa';

const TELEGRAM_USERNAME = 'Zhong5cla';
const WHATSAPP_NUMBER = '19852913802';

function buildMessage({ name, contact, phone, address, notes }, cart, orderDetails) {
  const itemLines = cart
    .map((item) => {
      const price = Number(item.price ?? item.variant?.price ?? 0);
      const lineTotal = (price * item.quantity).toFixed(2);
      const variant = item.variant?.grams ? ` (${item.variant.grams}g)` : '';
      return `- ${item.name}${variant} x${item.quantity} @ \u20ac${price.toFixed(2)} = \u20ac${lineTotal}`;
    })
    .join('\n');

  return [
    'New Order Request',
    '',
    `Name: ${name}`,
    `Contact: ${contact}`,
    `Phone: ${phone}`,
    `Shipping Address: ${address}`,
    notes ? `Message: ${notes}` : null,
    '',
    'Order Items:',
    itemLines,
    '',
    `Subtotal: \u20ac${orderDetails.subtotal.toFixed(2)}`,
    `Shipping: \u20ac${orderDetails.shipping.toFixed(2)}`,
    `Tax: \u20ac${orderDetails.tax.toFixed(2)}`,
    `Total: \u20ac${orderDetails.total.toFixed(2)}`,
  ]
    .filter((line) => line !== null)
    .join('\n');
}

export default function OrderContactForm({ cart, orderDetails }) {
  const [confirmed, setConfirmed] = useState(false);
  const [sent, setSent] = useState(false);
  const [method, setMethod] = useState('telegram');
  const [sentVia, setSentVia] = useState('telegram');
  const [form, setForm] = useState({
    name: '',
    contact: '',
    phone: '',
    address: '',
    notes: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValid =
    form.name.trim() &&
    form.contact.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    confirmed;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    const message = buildMessage(form, cart, orderDetails);
    const text = encodeURIComponent(message);
    const url =
      method === 'whatsapp'
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
        : `https://t.me/${TELEGRAM_USERNAME}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success(`Opening ${method === 'whatsapp' ? 'WhatsApp' : 'Telegram'} — send the pre-filled message to complete your order.`);
    setSentVia(method);
    setSent(true);
  };

  const inputClass = 'bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-2.5 pl-9 pr-3 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-400 text-sm';
  const labelClass = 'block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5';
  const iconClass = 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs';

  if (sent) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-emerald-500 text-2xl" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Request Ready</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
          {sentVia === 'whatsapp' ? 'WhatsApp' : 'Telegram'} has been opened with your order details — just hit send. We&apos;ll reply to{' '}
          <span className="font-semibold text-gray-900">{form.contact}</span> within 24 hours
          with our Bitcoin (BTC) or USDT wallet address and payment instructions. We accept BTC/USDT only.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FaUser className="text-sky-500 text-sm" />
        <h2 className="text-lg font-bold text-gray-900">Your Details</h2>
      </div>

      {/* Bitcoin-only payment notice */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
        <span className="text-amber-500 font-black text-base mt-0.5 shrink-0 leading-none">₿</span>
        <p className="text-xs text-gray-600 leading-relaxed">
          <span className="font-bold text-gray-900">We accept Bitcoin (BTC) or USDT only.</span>{' '}
          After submitting your order we&apos;ll send our wallet address and the exact
          amount via your chosen contact method.
        </p>
      </div>

      {/* Method — pick WhatsApp or Telegram */}
      <p className={labelClass}>Continue with</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { key: 'telegram', label: 'Telegram', desc: 'Continue privately in Telegram', Icon: FaTelegramPlane, activeColor: 'border-sky-500 bg-sky-50/60 ring-sky-500/20', iconColor: 'text-sky-500' },
          { key: 'whatsapp', label: 'WhatsApp', desc: 'Continue privately in WhatsApp', Icon: FaWhatsapp, activeColor: 'border-emerald-500 bg-emerald-50/60 ring-emerald-500/20', iconColor: 'text-emerald-500' },
        ].map(({ key, label, desc, Icon, activeColor, iconColor }) => {
          const active = method === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setMethod(key)}
              aria-pressed={active}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                active ? `${activeColor} ring-1` : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Icon className={active ? iconColor : 'text-gray-400'} />
              <div>
                <p className="text-sm font-bold text-gray-900 leading-none">{label}</p>
                <p className="text-[11px] text-gray-500 mt-1">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <div className="relative">
            <FaUser className={iconClass} />
            <input name="name" type="text" required value={form.name} onChange={handleChange}
              placeholder="John Doe" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>{method === 'whatsapp' ? 'WhatsApp Number' : 'Telegram Username'}</label>
          <div className="relative">
            {method === 'whatsapp' ? <FaWhatsapp className={iconClass} /> : <FaTelegramPlane className={iconClass} />}
            <input
              name="contact"
              type="text"
              required
              value={form.contact}
              onChange={handleChange}
              placeholder={method === 'whatsapp' ? '+1 234 567 8900' : '@yourusername'}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Phone Number *</label>
          <div className="relative">
            <FaPhoneAlt className={iconClass} />
            <input name="phone" type="tel" required value={form.phone} onChange={handleChange}
              placeholder="+1 234 567 8900" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Shipping Address</label>
          <div className="relative">
            <FaMapMarkerAlt className={iconClass} />
            <input name="address" type="text" required value={form.address} onChange={handleChange}
              placeholder="123 Main St, Berlin, Germany" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Message (optional)</label>
          <div className="relative">
            <FaCommentDots className="absolute left-3 top-3 text-gray-400 text-xs" />
            <textarea name="notes" rows={3} value={form.notes} onChange={handleChange}
              placeholder="Any special requests or questions..."
              className="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-2.5 pl-9 pr-3 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-400 text-sm resize-none" />
          </div>
        </div>

        {/* Confirmation */}
        <label className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-lg p-3.5 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
          />
          <span className="text-[11px] text-gray-600 leading-relaxed">
            I am a serious buyer. I understand this is a real order request and I am ready to receive
            payment instructions via {method === 'whatsapp' ? 'WhatsApp' : 'Telegram'}.
          </span>
        </label>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 disabled:opacity-50 disabled:cursor-not-allowed text-[#06130d] font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all text-sm shadow-lg shadow-emerald-500/25"
        >
          <>
            <FaPaperPlane className="text-xs" />
            Send Order via {method === 'whatsapp' ? 'WhatsApp' : 'Telegram'} &mdash; &euro;{orderDetails.total.toFixed(2)}
          </>
        </button>

        <p className="text-[11px] text-gray-400 text-center">
          You&apos;ll fill your details and the order will be sent directly to us via {method === 'whatsapp' ? 'WhatsApp' : 'Telegram'}.
        </p>
      </form>
    </div>
  );
}
