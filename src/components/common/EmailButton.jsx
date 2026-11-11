import { FaEnvelope } from 'react-icons/fa';

export default function EmailButton() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@binoidstore.com';

  return (
    <div className="fixed right-4 sm:right-6 bottom-5 sm:bottom-6 z-50">
      <div className="group relative">
        <a
          href={`mailto:${email}?subject=Order%20request`}
          className="block bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3.5 shadow-xl transition-all duration-300 hover:shadow-indigo-500/40"
          aria-label={`Email us at ${email}`}
        >
          <FaEnvelope className="text-2xl" aria-hidden="true" />
        </a>

        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-ink text-white px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Email us — {email}
        </span>
      </div>
    </div>
  );
}
