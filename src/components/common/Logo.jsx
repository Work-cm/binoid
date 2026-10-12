'use client';

import { useId } from 'react';

/**
 * BinoidStore logo — a rounded indigo tile with a bold "B" letterform
 * and a coral accent dot, followed by the Binoid|Store wordmark.
 */
export default function Logo({ size = 36, showWordmark = true, dark = false, className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const gradId = `bsg-${uid}`;

  return (
    <span className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      {/* Mark */}
      <span
        className="relative inline-block transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
          </defs>

          {/* Tile */}
          <rect x="2" y="2" width="60" height="60" rx="16" fill={`url(#${gradId})`} />

          {/* "B" letterform */}
          <path
            d="M20 15 H36 C43.5 15 48 19 48 25.5 C48 29.5 46 32.2 42.8 33.4 C47 34.6 49.6 37.8 49.6 42.4 C49.6 49.2 44.8 53 36.8 53 H20 Z M28 22.2 V30.6 H35 C38.4 30.6 40.2 29.1 40.2 26.4 C40.2 23.7 38.4 22.2 35 22.2 Z M28 37.2 V45.8 H36 C39.8 45.8 41.6 44.2 41.6 41.5 C41.6 38.8 39.8 37.2 36 37.2 Z"
            fill="#ffffff"
          />

          {/* Coral accent dot */}
          <circle cx="50" cy="15" r="6" fill="#ff6b4a" />
        </svg>
      </span>

      {/* Wordmark */}
      {showWordmark && (
        <span className="flex flex-col leading-none select-none">
          <span
            className={`font-display font-extrabold text-[17px] tracking-tight whitespace-nowrap ${
              dark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Binoid<span className="text-coral-500">Store</span>
          </span>
          <span
            className={`text-[9px] tracking-[0.2em] uppercase font-semibold mt-1 hidden sm:block ${
              dark ? 'text-white/50' : 'text-gray-400'
            }`}
          >
            binoidstore.com
          </span>
        </span>
      )}
    </span>
  );
}
