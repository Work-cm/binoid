'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const whatsappNumber = '17693319618'; // +1 769 331 9618
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  // Homepage only
  if (pathname !== '/') return null;

  return (
    <div className="fixed left-4 sm:left-6 bottom-[88px] sm:bottom-[92px] z-50 flex flex-col gap-3 items-start">
      {/* WhatsApp Button */}
      <div className="group relative">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-green-500 hover:bg-green-600 text-white rounded-full p-3.5 shadow-xl transition-all duration-300 hover:shadow-green-500/40 relative"
          aria-label="Chat with us on WhatsApp"
        >
          <FaWhatsapp className="text-2xl" aria-hidden="true" />
        </a>
        
        {/* Tooltip - only appears on this button's hover */}
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-ink text-white px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us on WhatsApp
        </span>
      </div>
    </div>
  );
}
