export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://binoidstore.com'),
  title: 'About BinoidStore | Trusted Research Chemicals Supplier',
  description: 'Learn about BinoidStore — a leading supplier of high-purity research chemicals, synthetic cannabinoids (5cl-adba, 5fadb, jwh-018), nitazenes and laboratory-grade compounds with COA and discreet worldwide shipping.',
  keywords: [
    'BinoidStore', 'research chemicals supplier', 'buy research chemicals',
    'synthetic cannabinoids', '5cl-adba', '5fadb', 'jwh-018', 'adb-butinaca',
    'nitazenes', 'laboratory chemicals', 'certificate of analysis',
    'discreet shipping', 'lab verified compounds',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About BinoidStore | Trusted Research Chemicals Supplier',
    description: 'BinoidStore supplies high-purity research chemicals to scientists and laboratories worldwide. Verified compounds, discreet shipping, full certificates of analysis.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutLayout({ children }) {
  return children;
}
