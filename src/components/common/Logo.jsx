'use client';

import { useId } from 'react';

/**
 * CannabinoidSite logo — a "C" letterform built from bonded atoms,
 * nested inside a benzene hexagon with a cannabis leaf at its heart,
 * wrapped in an orbiting electron ring.
 */
export default function Logo({ size = 36, showWordmark = true, dark = false, className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const gradId = `csg-${uid}`;
  const leafId = `csleaf-${uid}`;
  const glowId = `csglow-${uid}`;

  return (
    <span className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      {/* Mark */}
      <span
        className="relative inline-block transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="55%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#84cc16" />
            </linearGradient>
            <linearGradient id={leafId} x1="32" y1="12" x2="32" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <radialGradient id={glowId} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#84cc16" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Soft glow behind mark */}
          <circle cx="32" cy="32" r="30" fill={`url(#${glowId})`} />

          {/* Outer hexagon — benzene ring */}
          <path
            d="M32 5 L55.4 18.5 V45.5 L32 59 L8.6 45.5 V18.5 Z"
            stroke={`url(#${gradId})`}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Orbit ring — spins via .logo-orbit */}
          <g className="logo-orbit" style={{ transformOrigin: '32px 32px' }}>
            <ellipse
              cx="32" cy="32" rx="29" ry="11"
              transform="rotate(-24 32 32)"
              stroke={`url(#${gradId})`}
              strokeOpacity="0.4"
              strokeWidth="1.4"
              strokeDasharray="3 5"
            />
            <circle cx="58.5" cy="25.5" r="2.4" fill="#a3e635" />
          </g>

          {/* "C" — bold arc opening right, formed by a molecular bond */}
          <path
            d="M45 19 A16 16 0 1 0 45 45"
            stroke={`url(#${gradId})`}
            strokeWidth="4.6"
            strokeLinecap="round"
          />
          {/* Bond tips */}
          <circle cx="45" cy="19" r="3.2" fill="#a3e635" />
          <circle cx="45" cy="45" r="3.2" fill="#a3e635" />

          {/* Leaf — three leaflets nested inside the C */}
          <g fill={`url(#${leafId})`}>
            <path d="M32 22 C34.5 27.5 34.8 33 32 39.5 C29.2 33 29.5 27.5 32 22 Z" />
            <path d="M32 25 C34 29 34.2 34 32 39.5 C29.8 34 30 29 32 25 Z" transform="rotate(42 32 39.5)" />
            <path d="M32 25 C34 29 34.2 34 32 39.5 C29.8 34 30 29 32 25 Z" transform="rotate(-42 32 39.5)" />
          </g>
          {/* Stem */}
          <path d="M32 39.5 V44" stroke={`url(#${gradId})`} strokeWidth="2" strokeLinecap="round" />

          {/* Atom node on top ring vertex */}
          <circle cx="32" cy="5" r="2.8" fill="#a3e635" />
        </svg>
      </span>

      {/* Wordmark */}
      {showWordmark && (
        <span className="flex flex-col leading-none select-none">
          <span
            className={`font-black text-[15px] tracking-tight whitespace-nowrap ${
              dark ? 'text-white' : 'text-gray-900'
            }`}
          >
            CANNABINOID
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500">
              SITE
            </span>
          </span>
          <span
            className={`text-[9px] tracking-[0.22em] uppercase font-medium mt-1 hidden sm:block ${
              dark ? 'text-white/50' : 'text-gray-500'
            }`}
          >
            cannabinoidsite.com
          </span>
        </span>
      )}
    </span>
  );
}
