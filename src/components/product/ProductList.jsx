'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from './ProductCard';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaTimes, FaSearch, FaThLarge, FaList, FaFlask, FaArrowRight, FaStar, FaFilter } from 'react-icons/fa';

function lowestPrice(p) {
  if (p.priceVariants?.length) return p.priceVariants.reduce((m, v) => (v.price < m ? v.price : m), p.priceVariants[0].price);
  if (p.price && p.price > 0) return p.price;
  return 0;
}

function ProductRow({ product, index }) {
  const price = lowestPrice(product);
  const inStock = product.countInStock > 0;
  return (
    <Link
      href={`/products/${product.slug || product._id}`}
      className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 sm:gap-6 py-4 hover:bg-indigo-50/50 -mx-4 px-4 transition-colors"
    >
      <span className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill sizes="64px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <span className="w-full h-full flex items-center justify-center"><FaFlask className="text-gray-300" /></span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-gray-900 text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-indigo-700 transition-colors">{product.name}</span>
        <span className="block text-[11px] uppercase tracking-wide text-gray-500 mt-1">{product.category}</span>
        <span className="sm:hidden flex items-center gap-3 mt-1.5">
          <span className="font-extrabold text-coral-600">€{price.toFixed(2)}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${inStock ? 'text-green-600' : 'text-red-500'}`}>{inStock ? 'In stock' : 'Sold out'}</span>
        </span>
      </span>
      <span className="hidden sm:flex gap-0.5">{[1,2,3,4,5].map(n => <FaStar key={n} className={`text-[10px] ${n <= Math.round(product.rating || 0) ? 'text-amber-400' : 'text-gray-200'}`} />)}</span>
      <span className="hidden sm:block text-right">
        <span className="block font-extrabold text-lg text-coral-600">€{price.toFixed(2)}</span>
        <span className={`block text-[10px] font-bold uppercase tracking-wider mt-0.5 ${inStock ? 'text-green-600' : 'text-red-500'}`}>{inStock ? 'In stock' : 'Sold out'}</span>
      </span>
      <span className="h-9 px-4 rounded-lg bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors">
        View <FaArrowRight size={10} />
      </span>
    </Link>
  );
}

export default function ProductList({ initialProducts, selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [view, setView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const productListRef = useRef(null);
  // Make sure products are visible by default
  const isInView = useInView(productListRef, { once: true, amount: 0.1, initialInView: true });
  
  // Initialize products from props
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setFilteredProducts(initialProducts);
    }
  }, [initialProducts]);
  
  const [filters, setFilters] = useState({
    category: selectedCategory || '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'newest',
  });
  
  // Update filters when selectedCategory changes
  useEffect(() => {
    if (selectedCategory !== filters.category) {
      setFilters(prev => ({
        ...prev,
        category: selectedCategory || ''
      }));
    }
  }, [selectedCategory]);
  

  // Apply filters whenever they change
  useEffect(() => {
    if (!products || products.length === 0) return;
    
    let result = [...products];
    console.log('Starting filtering with', result.length, 'products');
    console.log('Current filters:', filters);
    
    // Filter by category (case-insensitive)
    if (filters.category && filters.category !== '') {
      console.log('Filtering by category:', filters.category);
      result = result.filter(product => {
        if (!product.category) {
          console.log(`Product ${product.name} has no category, excluding`);
          return false;
        }
        
        const productCategory = product.category.toLowerCase();
        const filterCategory = filters.category.toLowerCase();
        
        // Special handling for research chemicals
        if (filterCategory === 'research chemicals') {
          const matches = productCategory === 'research chemicals';
          console.log(`Research chemicals filter: ${product.name} (${productCategory}) matches? ${matches}`);
          return matches;
        }
        
        // Direct match for all other categories
        const matches = productCategory === filterCategory;
        console.log(`Category filter: ${product.name} (${productCategory}) matches ${filterCategory}? ${matches}`);
        return matches;
      });
    } else {
      console.log('No category filter applied, showing all products');
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product => 
        (product.name && product.name.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.category && product.category.toLowerCase().includes(query))
      );
    }

    // Filter by price range
    if (filters.minPrice !== '') {
      result = result.filter(product => lowestPrice(product) >= Number(filters.minPrice));
    }

    if (filters.maxPrice !== '') {
      result = result.filter(product => lowestPrice(product) <= Number(filters.maxPrice));
    }

    // Filter by stock
    if (filters.inStock) {
      result = result.filter(product => product.countInStock > 0);
    }

    // Sort products
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low-high':
        result.sort((a, b) => lowestPrice(a) - lowestPrice(b));
        break;
      case 'price-high-low':
        result.sort((a, b) => lowestPrice(b) - lowestPrice(a));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [filters, products, searchQuery]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Log the filter change for debugging
    console.log(`Filter changed: ${name} = ${value}`);
    
    // Special handling for category changes
    if (name === 'category') {
      // When selecting All Categories, reset to empty string
      const categoryValue = value === '' ? '' : value;
      
      // Update URL with the new category if possible
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (categoryValue) {
          url.searchParams.set('category', categoryValue);
        } else {
          url.searchParams.delete('category');
        }
        
        // Reload the page to get fresh products from the server
        // This ensures we get all products when All Categories is selected
        window.location.href = url.toString();
        return; // Stop here since we're reloading the page
      }
      
      setFilters({
        ...filters,
        category: categoryValue
      });
    } else {
      // Handle other filter changes normally
      setFilters({
        ...filters,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const clearFilters = () => {
    // Reset filters to default values
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'newest',
    });
    
    // Reset URL parameters and reload page to get all products
    if (typeof window !== 'undefined') {
      // Create a new URL without any search parameters
      const url = new URL(window.location.pathname, window.location.origin);
      window.location.href = url.toString();
    }
  };

  const hasActiveFilters = filters.minPrice !== '' || filters.maxPrice !== '' || filters.inStock || searchQuery.trim() !== '';

  const categoryOptions = [
    { value: '', label: 'All categories' },
    { value: 'cannabinoids', label: 'Cannabinoids' },
    { value: 'nitazenes', label: 'Nitazenes' },
    { value: 'opioids', label: 'Opioids' },
    { value: 'research chemicals', label: 'Research chemicals' },
    { value: 'etomidate', label: 'Etomidate' },
  ];

  const inputClass = 'w-full bg-white border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 placeholder-gray-400 transition-all';

  const FilterPanel = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Search</p>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Name, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputClass} pl-8 pr-8`}
          />
          {searchQuery && (
            <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900" onClick={() => setSearchQuery('')} aria-label="Clear search">
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Category</p>
        <ul className="space-y-1">
          {categoryOptions.map(({ value, label }) => {
            const active = (filters.category || '').toLowerCase() === value;
            return (
              <li key={value}>
                <button
                  type="button"
                  onClick={() => handleFilterChange({ target: { name: 'category', value, type: 'button' } })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {label}
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-coral-300" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Price (&euro;)</p>
        <div className="flex items-center gap-2">
          <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleFilterChange} className={inputClass} />
          <span className="text-gray-300">&ndash;</span>
          <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleFilterChange} className={inputClass} />
        </div>
      </div>

      {/* Availability */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Availability</p>
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-700">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={() => setFilters(f => ({ ...f, inStock: !f.inStock }))}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          In stock only
        </label>
      </div>

      {hasActiveFilters && (
        <button type="button" onClick={clearFilters} className="w-full text-sm font-semibold text-coral-600 hover:text-coral-700 border border-coral-200 hover:bg-coral-50 rounded-lg py-2 transition-colors">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div ref={productListRef} className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-8">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:block">
        <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-[140px]">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
            <FaFilter className="text-indigo-600 text-sm" />
            <h2 className="font-bold text-gray-900 text-sm">Filters</h2>
          </div>
          {FilterPanel}
        </div>
      </aside>

      {/* Main */}
      <div>
        {/* Toolbar */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors"
          >
            <FaFilter size={11} /> Filters {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />}
          </button>

          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
            {searchQuery && <span className="text-gray-500"> for &ldquo;{searchQuery}&rdquo;</span>}
          </p>

          <div className="ml-auto flex items-center gap-2">
            <label className="text-xs text-gray-500 hidden sm:block">Sort by</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg pl-3 pr-8 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-low-high">Price: low to high</option>
              <option value="price-high-low">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>

            <div className="hidden sm:flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5">
              <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`w-8 h-7 rounded-md flex items-center justify-center transition-colors ${view === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}><FaThLarge size={11} /></button>
              <button type="button" onClick={() => setView('list')} aria-label="List view" className={`w-8 h-7 rounded-md flex items-center justify-center transition-colors ${view === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}><FaList size={11} /></button>
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <AnimatePresence mode="wait">
            {view === 'list' ? (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="bg-white border border-gray-200 rounded-xl px-4 divide-y divide-gray-100">
                {filteredProducts.map((product, index) => (
                  <ProductRow key={product._id || index} product={product} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                {filteredProducts.map((product, index) => (
                  <motion.div key={product._id || index} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.3) }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-14 text-center">
            <FaFlask className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="font-display text-xl font-bold text-gray-900 mb-1">No products found</p>
            <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search term.</p>
            <button onClick={clearFilters} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors">
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
                <h2 className="font-bold text-gray-900 flex items-center gap-2"><FaFilter className="text-indigo-600 text-sm" /> Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600" aria-label="Close filters"><FaTimes /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">{FilterPanel}</div>
              <div className="p-4 border-t border-gray-100">
                <button onClick={() => setMobileFiltersOpen(false)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-sm transition-colors">
                  Show {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
