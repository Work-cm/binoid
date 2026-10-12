import { FaTelegramPlane } from 'react-icons/fa';

export default function TelegramButton() {
  const telegramUrl = 'https://t.me/chemsolution12maf';

  return (
    <div className="fixed left-4 sm:left-6 bottom-5 sm:bottom-6 z-50 flex flex-col gap-3 items-start">
      <div className="group relative">
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3.5 shadow-xl transition-all duration-300 hover:shadow-blue-500/40 relative"
          aria-label="Chat with us on Telegram"
        >
          <FaTelegramPlane className="text-2xl" aria-hidden="true" />
        </a>

        {/* Tooltip - only appears on this button's hover */}
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-ink text-white px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us on Telegram
        </span>
      </div>
    </div>
  );
}
