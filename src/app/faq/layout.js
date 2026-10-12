export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://binoidstore.com'),
  title: 'FAQ | Buy Research Chemicals Online | BinoidStore',
  description: 'Get answers about buying research chemicals online, shipping, payments, product purity, COAs and more at BinoidStore.',
  keywords: [
    'buy research chemicals online FAQ', 'research chemicals FAQ',
    'synthetic cannabinoids', '5cl-adba', '5fadb', 'jwh-018',
    'shipping research chemicals', 'payment methods', 'certificate of analysis',
    'BinoidStore support',
  ],
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'FAQ | Buy Research Chemicals Online | BinoidStore',
    description: 'Get answers about ordering, shipping, payments and product quality for research chemicals at BinoidStore.',
    url: '/faq',
    type: 'website',
  },
};

export default function FAQLayout({ children }) {
  return children;
}
