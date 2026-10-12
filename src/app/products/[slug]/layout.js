import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://binoidstore.com';

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    await dbConnect();
    const product = await Product.findOne({ slug }).select('name description category priceVariants images casNumber').lean();

    if (!product) {
      return {
        title: 'Product Not Found | BinoidStore',
        description: 'The product you are looking for could not be found.',
      };
    }

    const startingPrice = product.priceVariants?.[0]?.price;
    const priceText = startingPrice ? ` Starting from \u20AC${startingPrice}.` : '';
    const casText = product.casNumber ? ` CAS ${product.casNumber}.` : '';
    const shortDesc = (product.description
      ? product.description.slice(0, 155).replace(/\n/g, ' ').trim() + '\u2026'
      : `Buy ${product.name} \u2014 high-purity ${product.category} research compound.${priceText}`) + casText;

    const image = product.images?.[0] || `${BASE_URL}/images/logo.svg`;
    const categoryKeywords = [product.category, product.category + ' for sale', 'buy ' + product.category].filter(Boolean);

    return {
      metadataBase: new URL(BASE_URL),
      title: `Buy ${product.name} Online | Research Chemicals | BinoidStore`,
      description: shortDesc,
      keywords: [
        product.name,
        product.name.toLowerCase() + ' for sale',
        'buy ' + product.name.toLowerCase(),
        ...(product.casNumber ? [product.casNumber, 'CAS ' + product.casNumber, 'buy ' + product.casNumber] : []),
        ...categoryKeywords,
        'research chemicals',
        'synthetic cannabinoids',
              'nitazenes',
        'BinoidStore',
        'high purity',
        'certificate of analysis',
        'lab verified',
      ],
      alternates: {
        canonical: `/products/${slug}`,
      },
      openGraph: {
        title: `${product.name} | BinoidStore`,
        description: shortDesc,
        url: `/products/${slug}`,
        type: 'website',
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | BinoidStore`,
        description: shortDesc,
        images: [image],
      },
    };
  } catch {
    return {
      title: 'BinoidStore | Research Chemicals',
      description: 'Premium research chemicals — high purity, certificate of analysis, discreet shipping.',
    };
  }
}

export default function ProductLayout({ children }) {
  return children;
}
