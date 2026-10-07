'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from './ProductCard';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaTimes, FaSearch, FaThLarge, FaList, FaFlask, FaArrowRight, FaStar } from 'react-icons/fa';

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
      className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_auto_1fr_auto_auto_auto] items-center gap-4 sm:gap-6 py-4 border-b border-gray-200 hover:bg-emerald-50/40 -mx-4 px-4 rounded-xl transition-colors"
    >
      <span className="hidden sm:block font-mono text-xs text-gray-400 w-8">{String(index + 1).padStart(2, '0')}</span>
      <span className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill sizes="64px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <span className="w-full h-full flex items-center justify-center"><FaFlask className="text-gray-300" /></span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block font-display font-bold text-gray-900 text-base sm:text-lg leading-tight truncate group-hover:text-emerald-700 transition-colors">{product.name}</span>
        <span className="block text-[11px] uppercase tracking-[0.18em] text-gray-400 mt-1">{product.category}</span>
        <span className="sm:hidden flex items-center gap-3 mt-1.5">
          <span className="font-mono text-sm text-gray-900">€{price.toFixed(2)}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${inStock ? 'text-emerald-600' : 'text-red-500'}`}>{inStock ? 'In stock' : 'Sold out'}</span>
        </span>
      </span>
      <span className="hidden sm:flex gap-0.5">{[1,2,3,4,5].map(n => <FaStar key={n} className={`text-[9px] ${n <= Math.round(product.rating || 0) ? 'text-amber-400' : 'text-gray-200'}`} />)}</span>
      <span className="hidden sm:block text-right">
        <span className="block font-mono text-base text-gray-900">€{price.toFixed(2)}</span>
        <span className={`block text-[10px] font-bold uppercase tracking-wider mt-0.5 ${inStock ? 'text-emerald-600' : 'text-red-500'}`}>{inStock ? 'In stock' : 'Sold out'}</span>
      </span>
      <span className="w-9 h-9 rounded-full border border-gray-300 group-hover:border-emerald-500 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-gray-500 transition-all group-hover:rotate-[-45deg]">
        <FaArrowRight size={11} />
      </span>
    </Link>
  );
}

export default function ProductList({ initialProducts, selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [view, setView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
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

  return (
    <div ref={productListRef} className="relative">
      {/* Sticky filter bar */}
      <div className="sticky top-14 lg:top-12 z-30 -mx-6 px-6 py-3 bg-white/90 backdrop-blur-xl border-y border-gray-200 mb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Filter by name, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-full pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 placeholder-gray-400 transition-all"
            />
            {searchQuery && (
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900" onClick={() => setSearchQuery('')} aria-label="Clear search">
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mr-1">€</span>
            <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleFilterChange} className="w-14 bg-transparent border-0 p-0 text-sm text-gray-900 focus:ring-0 placeholder-gray-400" />
            <span className="text-gray-300">–</span>
            <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleFilterChange} className="w-14 bg-transparent border-0 p-0 text-sm text-gray-900 focus:ring-0 placeholder-gray-400" />
          </div>

          {/* In stock */}
          <button
            type="button"
            onClick={() => setFilters(f => ({ ...f, inStock: !f.inStock }))}
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold transition-all border ${filters.inStock ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-emerald-400'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${filters.inStock ? 'bg-white' : 'bg-emerald-500'}`} /> In stock
          </button>

          {/* Sort */}
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="bg-gray-50 border border-gray-200 text-gray-700 rounded-full pl-3.5 pr-8 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="price-low-high">Price ↑</option>
            <option value="price-high-low">Price ↓</option>
            <option value="rating">Top rated</option>
          </select>

          {/* View toggle */}
          <div className="ml-auto flex items-center bg-gray-50 border border-gray-200 rounded-full p-1">
            <button type="button" onClick={() => setView('list')} aria-label="List view" className={`w-8 h-7 rounded-full flex items-center justify-center transition-colors ${view === 'list' ? 'bg-[#06130d] text-white' : 'text-gray-500 hover:text-gray-900'}`}><FaList size={11} /></button>
            <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`w-8 h-7 rounded-full flex items-center justify-center transition-colors ${view === 'grid' ? 'bg-[#06130d] text-white' : 'text-gray-500 hover:text-gray-900'}`}><FaThLarge size={11} /></button>
          </div>

          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="text-xs font-bold text-emerald-600 hover:text-lime-600 transition-colors">Reset</button>
          )}
        </div>
      </div>

      {/* Count line */}
      <div className="flex items-baseline justify-between mb-4">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gray-400">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'compound' : 'compounds'}
          {searchQuery && <span className="normal-case tracking-normal"> · &ldquo;{searchQuery}&rdquo;</span>}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400">{view === 'list' ? 'Index view' : 'Card view'}</p>
      </div>

      {filteredProducts.length > 0 ? (
        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="border-t border-gray-200">
              {filteredProducts.map((product, index) => (
                <ProductRow key={product._id || index} product={product} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product, index) => (
                <motion.div key={product._id || index} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.03 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div className="border border-dashed border-gray-300 rounded-[1.75rem] p-14 text-center">
          <p className="font-display text-2xl font-bold text-gray-900 mb-2">Nothing matches.</p>
          <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search term.</p>
          <button onClick={clearFilters} className="bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 text-[#06130d] px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-emerald-500/20">
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
