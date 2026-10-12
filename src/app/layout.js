import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import Shell from "@/components/layout/Shell";
import VisitorTracker from "@/components/tracking/VisitorTracker";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import TelegramButton from "@/components/common/TelegramButton";

// Providers
import AuthProvider from "@/components/auth/AuthProvider";
import CartProvider from "@/components/cart/CartProvider";

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  preload: true,
  variable: '--font-display',
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  variable: '--font-body',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://binoidstore.com';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'BinoidStore | Premium Synthetic Cannabinoids & Research Chemicals',
    template: '%s | BinoidStore',
  },
  description: 'Shop premium synthetic cannabinoids online at BinoidStore. Lab-verified cannabinoids, nitazenes, opioids and laboratory-grade research chemicals with fast, discreet worldwide shipping.',
  keywords: [
    'research chemicals', 'buy research chemicals online',
    'synthetic cannabinoids', 'nitazenes', 'opioids', 'laboratory chemicals',
    '5cl-adba', '5cladba', '5fadb', 'jwh-018', 'adb-butinaca', 'ab-pinaca',
    '5F-EDMB-PINACA', 'ADB-FUBINACA', '4FADB', 'AMB-FUBINACA', 'MDMB-4en-PINACA',
    'BinoidStore',
  ],
  other: { 'theme-color': '#4f46e5' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'BinoidStore',
    title: 'BinoidStore | Premium Synthetic Cannabinoids & Research Chemicals',
    description: 'Premium synthetic cannabinoids, nitazenes, opioids and laboratory compounds. Worldwide discreet shipping.',
    images: [
      {
        url: `${BASE_URL}/images/logo.svg`,
        width: 1200,
        height: 630,
        alt: 'BinoidStore — Premium Cannabinoids & Research Chemicals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BinoidStore | Premium Synthetic Cannabinoids & Research Chemicals',
    description: 'Premium synthetic cannabinoids, nitazenes, opioids and laboratory compounds. Worldwide discreet shipping.',
    images: [`${BASE_URL}/images/logo.svg`],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: '/favicon.svg',
  },
  verification: {
    // google: 'your-google-site-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${bodyFont.className} ${bodyFont.variable} ${displayFont.variable} font-sans min-h-screen flex flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-indigo-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>

        <AuthProvider>
          <CartProvider>
            <VisitorTracker />
            <Toaster position="top-center" />
            <WhatsAppButton />
            <TelegramButton />
            <ConditionalNavbar>
              <Navbar />
            </ConditionalNavbar>
            <Shell>
              <main id="main-content" className="flex-grow">{children}</main>
              <ConditionalNavbar>
                <Footer />
              </ConditionalNavbar>
            </Shell>
          </CartProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
