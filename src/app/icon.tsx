export const contentType = 'image/svg+xml';
export const size = { width: 32, height: 32 };

export default function Icon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#059669"/><stop offset="55%" stop-color="#10b981"/><stop offset="100%" stop-color="#84cc16"/>
    </linearGradient>
    <linearGradient id="leaf" x1="32" y1="22" x2="32" y2="44" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#a3e635"/><stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#84cc16" stop-opacity="0.5"/><stop offset="100%" stop-color="#84cc16" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="32" cy="32" r="30" fill="url(#glow)"/>
  <path d="M32 5 L55.4 18.5 V45.5 L32 59 L8.6 45.5 V18.5 Z" fill="none" stroke="url(#g)" stroke-width="3" stroke-linejoin="round"/>
  <ellipse cx="32" cy="32" rx="29" ry="11" transform="rotate(-24 32 32)" fill="none" stroke="url(#g)" stroke-opacity="0.4" stroke-width="1.4" stroke-dasharray="3 5"/>
  <path d="M45 19 A16 16 0 1 0 45 45" fill="none" stroke="url(#g)" stroke-width="4.6" stroke-linecap="round"/>
  <circle cx="45" cy="19" r="3.2" fill="#a3e635"/>
  <circle cx="45" cy="45" r="3.2" fill="#a3e635"/>
  <g fill="url(#leaf)">
    <path d="M32 22 C34.5 27.5 34.8 33 32 39.5 C29.2 33 29.5 27.5 32 22 Z"/>
    <path d="M32 25 C34 29 34.2 34 32 39.5 C29.8 34 30 29 32 25 Z" transform="rotate(42 32 39.5)"/>
    <path d="M32 25 C34 29 34.2 34 32 39.5 C29.8 34 30 29 32 25 Z" transform="rotate(-42 32 39.5)"/>
  </g>
  <path d="M32 39.5 V44" stroke="url(#g)" stroke-width="2" stroke-linecap="round"/>
  <circle cx="32" cy="5" r="2.8" fill="#a3e635"/>
</svg>`;
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
}
