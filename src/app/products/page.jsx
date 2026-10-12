import { Suspense } from 'react';
import ProductList from '@/components/product/ProductList';
import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// Dynamic Metadata for SEO - handles query parameters
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const category = params?.category || '';
  
  // Always use /products as canonical to avoid duplicate content from query params
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://binoidstore.com';
  
  const categoryKeywords = category
    ? `${category.toLowerCase()}, ${category.toLowerCase()} for sale, buy ${category.toLowerCase()}`
    : 'research chemicals, research chemicals for sale, buy research chemicals online, synthetic cannabinoids, buy synthetic cannabinoids, nitazenes';

  return {
    metadataBase: new URL(baseUrl),
    title: category
      ? `Buy ${category} Online | Research Chemicals | BinoidStore`
      : 'Research Chemicals for Sale | 5cl-adba, 5fadb, JWH-018 | BinoidStore',
    description: category
      ? `Buy premium ${category.toLowerCase()} online at BinoidStore. High-purity 5cl-adba, 5cladba, 5fadb, jwh-018, adb-butinaca and more — lab-verified with discreet worldwide shipping.`
      : 'Buy premium research chemicals online. Browse 5cl-adba, 5cladba, 5fadb, jwh-018, adb-butinaca, ab-pinaca, 5F-EDMB-PINACA, ADB-FUBINACA, 4FADB, AMB-FUBINACA, MDMB-4en-PINACA and other lab-grade synthetic cannabinoids and nitazenes.',
    keywords: `${categoryKeywords}, 5cl-adba, 5cladba, 5fadb, jwh-018, adb-butinaca, ab-pinaca, 5F-EDMB-PINACA, ADB-FUBINACA, 4FADB, AMB-FUBINACA, MDMB-4en-PINACA, 6cl-adba, isotonitazene, ketamine, alpha-pvp, laboratory chemicals, high purity, BinoidStore`,
    alternates: {
      canonical: '/products', // Always point to /products to avoid duplicate content from query params
    },
    openGraph: {
      title: category
        ? `Buy ${category} Online | Research Chemicals | BinoidStore`
        : 'Research Chemicals for Sale | 5cl-adba, 5fadb, JWH-018 | BinoidStore',
      description: category
        ? `Browse premium ${category.toLowerCase()} at BinoidStore. Lab-verified compounds with discreet worldwide shipping.`
        : 'Browse premium research chemicals: 5cl-adba, 5cladba, 5fadb, jwh-018, adb-butinaca and more. Lab-verified with discreet worldwide shipping.',
      url: '/products',
      type: 'website',
    },
  };
}

// Helper function to convert MongoDB documents to plain objects
function convertToPlainObject(doc) {
  // Convert _id to string
  const plainObject = { ...doc };
  if (plainObject._id) {
    plainObject._id = plainObject._id.toString();
  }
  
  // Handle nested objects and arrays
  Object.keys(plainObject).forEach(key => {
    if (plainObject[key] && typeof plainObject[key] === 'object') {
      if (Array.isArray(plainObject[key])) {
        plainObject[key] = plainObject[key].map(item => {
          if (item && typeof item === 'object' && item._id) {
            return convertToPlainObject(item);
          }
          return item;
        });
      } else if (plainObject[key]._id) {
        plainObject[key] = convertToPlainObject(plainObject[key]);
      }
    }
  });
  
  return plainObject;
}

// This function fetches products on the server
async function getProducts(searchParams) {
  await dbConnect();
  
  // First await the entire searchParams object
  const params = await searchParams;
  
  // Now safely extract values
  const category = params?.category || null;
  const search = params?.search || null;
  const sort = params?.sort || 'createdAt';
  const order = params?.order || 'desc';
  
  // Build query based on parameters
  let query = {};
  
  if (category) {
    console.log('Filtering by category:', category);
    
    // Handle 'research chemicals' category with multiple approaches to ensure it works
    if (category.toLowerCase() === 'research chemicals') {
      // Try multiple approaches to match research chemicals
      query.$or = [
        // Exact match (case-sensitive)
        { category: 'research chemicals' },
        // Exact match (case-insensitive regex)
        { category: { $regex: /^research chemicals$/i } },
        // Partial match (case-insensitive)
        { category: { $regex: /research chemicals/i } }
      ];
      console.log('Using enhanced research chemicals filter with multiple matching strategies');
    } else {
      // Make category filtering case-insensitive for other categories
      query.category = { $regex: new RegExp('^' + category + '$', 'i') };
    }
  }
  
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  
  // Execute query with sorting
  const sortField = sort;
  const sortOrder = order === 'asc' ? 1 : -1;
  
  const sortOptions = {};
  sortOptions[sortField] = sortOrder;
  
  // Fetch products
  try {
    const products = await Product.find(query)
      .sort(sortOptions)
      .select('-reviews') // Exclude reviews for performance
      .lean();
    
    // Convert MongoDB documents to plain objects
    return products.map(product => convertToPlainObject(product));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Loading component
function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-sky-500" />
      </div>
    </div>
  );
}

const categoryMeta = {
  cannabinoids: {
    label: 'Cannabinoids',
    desc: 'High-purity synthetic cannabinoids including 5cl-adba, 5cladba, 5fadb, jwh-018, adb-butinaca and more. Lab-verified for research use.',
  },
  nitazenes: {
    label: 'Nitazenes',
    desc: 'High-purity nitazene compounds for analytical chemistry and scientific research.',
  },
  'research chemicals': {
    label: 'Research Chemicals',
    desc: 'Curated selection of research-grade compounds: ab-pinaca, ADB-FUBINACA, 4FADB, AMB-FUBINACA, MDMB-4en-PINACA and more.',
  },
  opioids: {
    label: 'Opioids',
    desc: 'High-purity opioid reference compounds for pharmacological research and analytical chemistry.',
  },
  etomidate: {
    label: 'Etomidate',
    desc: 'High-purity etomidate powders and crystals for analytical and pharmacological research. Lab-tested, COA included.',
  },
};

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const products = await getProducts(searchParams);
  const selectedCategory = params?.category || '';

  const catKey = selectedCategory.toLowerCase();
  const catInfo = categoryMeta[catKey] || null;
  const displayLabel = catInfo?.label || selectedCategory || 'All Products';
  const displayDesc = catInfo?.desc ||
    'Browse our full catalog of lab-verified synthetic cannabinoids, nitazenes, opioids and research chemicals — each compound shipped with its Certificate of Analysis.';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 pt-5 pb-7">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
            <a href="/" className="hover:text-indigo-700 transition-colors">Home</a>
            <span>/</span>
            <a href="/products" className={selectedCategory ? 'hover:text-indigo-700 transition-colors' : 'text-gray-900 font-semibold'}>Shop</a>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-semibold">{displayLabel}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="max-w-2xl">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {displayLabel}
              </h1>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mt-2">
                {displayDesc}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { href: '/products', label: 'All' },
                { href: '/products?category=cannabinoids', label: 'Cannabinoids' },
                { href: '/products?category=nitazenes', label: 'Nitazenes' },
                { href: '/products?category=opioids', label: 'Opioids' },
                { href: '/products?category=research%20chemicals', label: 'Research Chemicals' },
                { href: '/products?category=etomidate', label: 'Etomidate' },
              ].map(({ href, label }) => {
                const active = label === 'All' ? !selectedCategory : catKey === label.toLowerCase();
                return (
                  <a
                    key={label}
                    href={href}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold transition-colors border ${
                      active
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-400 hover:text-indigo-700'
                    }`}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="container mx-auto px-4 sm:px-6 py-8 pb-16">
        <Suspense fallback={<ProductsLoading />}>
          <ProductList initialProducts={products} selectedCategory={selectedCategory} />
        </Suspense>
      </div>
    </div>
  );
}
