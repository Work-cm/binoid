import Script from 'next/script';
import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';
import HomeClient from '@/components/home/HomeClient';
import { getOrganizationSchema, getWebsiteSchema } from '@/components/seo/SEOKeywords';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://cannabinoidsite.com';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Buy Synthetic Cannabinoids Online | 5cl-adba, 5fadb, JWH-018 | CannabinoidSite',
  description: 'Buy premium synthetic cannabinoids online at CannabinoidSite. High-purity 5cl-adba, 5fadb, jwh-018, adb-butinaca plus nitazenes, opioids and lab-grade research chemicals with discreet worldwide shipping.',
  keywords: [
    'buy research chemicals online',
    'research chemicals for sale',
    'synthetic cannabinoids',
    'buy synthetic cannabinoids',
    '5cl-adba', '5cladba', '5-cl-adba', '5fadb', '5-fadb',
    'jwh-018', 'adb-butinaca', 'ab-pinaca',
    '5F-EDMB-PINACA', 'ADB-FUBINACA', '4FADB', 'AMB-FUBINACA', 'MDMB-4en-PINACA',
    '6cl-adba', '6-cl-adba',
    'nitazenes', 'benzos',
    'isotonitazene', 'metonitazene', 'protonitazene', 'butonitazene',
    'ketamine', 'alpha-pvp', 'alpha-pihp', '3-cmc', '4-cmc', '3-mmc', '4-mmc',
    'laboratory chemicals', 'premium research chemicals', 'lab verified chemicals',
    'CannabinoidSite',
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'CannabinoidSite',
    title: 'Buy Synthetic Cannabinoids Online | 5cl-adba, 5fadb, JWH-018 | CannabinoidSite',
    description: 'Premium synthetic cannabinoids, nitazenes and laboratory compounds. Worldwide discreet shipping. Shop CannabinoidSite today.',
    images: [
      {
        url: `${BASE_URL}/images/logo.svg`,
        width: 1200,
        height: 630,
        alt: 'CannabinoidSite — Premium Cannabinoids & Research Chemicals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Synthetic Cannabinoids Online | CannabinoidSite',
    description: 'Premium synthetic cannabinoids, nitazenes and laboratory compounds. Worldwide discreet shipping.',
    images: [`${BASE_URL}/images/logo.svg`],
  },
};

async function getFeaturedProducts() {
  await dbConnect();
  try {
    // Cannabinoid products first, then fill remaining slots with other featured items
    const [cannabinoids, others] = await Promise.all([
      Product.find({ featured: true, category: 'cannabinoids' }).limit(12).select('-reviews').lean(),
      Product.find({ featured: true, category: { $ne: 'cannabinoids' } }).limit(12).select('-reviews').lean(),
    ]);
    const products = [...cannabinoids, ...others].slice(0, 12);
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <>
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomeClient featuredProducts={featuredProducts} />
    </>
  );
}
