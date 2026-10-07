import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const whatsappNumber = '15125922145'; // +1 512 592 2145
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="fixed left-6 bottom-6 z-50 flex flex-col gap-4 items-start">
      {/* WhatsApp Button */}
      <div className="group relative">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:shadow-green-500/50 relative"
          aria-label="Chat with us on WhatsApp"
        >
          <FaWhatsapp className="text-3xl" aria-hidden="true" />
          
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75 pointer-events-none"></span>
        </a>
        
        {/* Tooltip - only appears on this button's hover */}
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#06130d] text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us on WhatsApp
        </span>
      </div>
    </div>
  );
}
