'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Grid, List, MapPin, Star, Heart, 
  MessageCircle, Phone, Eye, ChevronDown, ChevronRight,
  SlidersHorizontal, X, Calendar, DollarSign, Package,
  User, Verified, TrendingUp, Clock, ArrowUpDown,
  Map, Bookmark, Share2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useEquipment } from '@/hooks/useData';
import ProductCard from '@/components/ProductCard';
import Loading from '@/components/Loading';
import { Equipment } from '@/types/database.types';
import { CameraButton } from '@/components/CameraIntegration';
import OptimizedProductCard from '@/components/OptimizedProductCard';

// Enhanced filter options for Algerian marketplace
const filterOptions = {
  categories: [
    { id: 'tractors', name: 'جرارات', count: 1247 },
    { id: 'harvesters', name: 'حصادات', count: 892 },
    { id: 'plows', name: 'محاريث', count: 634 },
    { id: 'seeders', name: 'بذارات', count: 567 },
    { id: 'irrigation', name: 'أنظمة الري', count: 489 },
    { id: 'livestock', name: 'حيوانات المزرعة', count: 423 },
    { id: 'transport', name: 'نقل وخدمات', count: 378 },
    { id: 'tools', name: 'أدوات يدوية', count: 345 }
  ],
  brands: [
    { id: 'john-deere', name: 'John Deere', count: 892 },
    { id: 'case-ih', name: 'Case IH', count: 634 },
    { id: 'massey-ferguson', name: 'Massey Ferguson', count: 567 },
    { id: 'new-holland', name: 'New Holland', count: 489 },
    { id: 'kubota', name: 'Kubota', count: 423 },
    { id: 'fendt', name: 'Fendt', count: 378 },
    { id: 'claas', name: 'Claas', count: 345 },
    { id: 'other', name: 'أخرى', count: 1456 }
  ],
  locations: [
    { id: 'algiers', name: 'الجزائر العاصمة', count: 1245 },
    { id: 'oran', name: 'وهران', count: 892 },
    { id: 'constantine', name: 'قسنطينة', count: 634 },
    { id: 'blida', name: 'البليدة', count: 567 },
    { id: 'setif', name: 'سطيف', count: 489 },
    { id: 'annaba', name: 'عنابة', count: 423 },
    { id: 'batna', name: 'باتنة', count: 378 },
    { id: 'djelfa', name: 'الجلفة', count: 345 }
  ],
  conditions: [
    { id: 'new', name: 'جديد', count: 2134 },
    { id: 'excellent', name: 'ممتاز', count: 1876 },
    { id: 'good', name: 'جيد', count: 1456 },
    { id: 'fair', name: 'مقبول', count: 892 },
    { id: 'poor', name: 'يحتاج إصلاح', count: 234 }
  ],
  priceRanges: [
    { id: 'under-50k', name: 'أقل من 50,000 دج', min: 0, max: 50000 },
    { id: '50k-100k', name: '50,000 - 100,000 دج', min: 50000, max: 100000 },
    { id: '100k-500k', name: '100,000 - 500,000 دج', min: 100000, max: 500000 },
    { id: '500k-1m', name: '500,000 - 1,000,000 دج', min: 500000, max: 1000000 },
    { id: '1m-5m', name: '1,000,000 - 5,000,000 دج', min: 1000000, max: 5000000 },
    { id: '5m-10m', name: '5,000,000 - 10,000,000 دج', min: 5000000, max: 10000000 },
    { id: 'over-10m', name: 'أكثر من 10,000,000 دج', min: 10000000, max: 100000000 }
  ]
};

// Sample data with enhanced Algerian context
const sampleProducts = [
  {
    id: '1',
    title: 'جرار زراعي فيات 110 حصان',
    description: 'جرار زراعي فيات 110 حصان، حالة ممتازة، مستعمل لمدة 3 سنوات فقط',
    price: 2500000,
    currency: 'DZD',
    condition: 'excellent',
    location: 'البليدة',
    brand: 'new-holland',
    year: 2021,
    image: '/api/placeholder/400/300',
    images: ['/api/placeholder/400/300'],
    category: 'tractors',
    seller: {
      name: 'أحمد بن علي',
      rating: 4.8,
      verified: true,
      location: 'البليدة',
      responseTime: 'خلال ساعة'
    },
    createdAt: '2024-01-15',
    views: 234,
    saved: 45,
    featured: true
  },
  {
    id: '2',
    title: 'بذور طماطم عضوية عالية الجودة',
    description: 'بذور طماطم عضوية مستوردة من إيطاليا، إنتاجية عالية ومقاومة للأمراض',
    price: 1500,
    currency: 'DZD',
    condition: 'new',
    location: 'الجزائر العاصمة',
    brand: 'other',
    year: 2024,
    image: '/api/placeholder/400/300',
    images: ['/api/placeholder/400/300'],
    category: 'seeders',
    seller: {
      name: 'مريم الزهراء',
      rating: 4.9,
      verified: true,
      location: 'الجزائر العاصمة',
      responseTime: 'خلال 30 دقيقة'
    },
    createdAt: '2024-01-18',
    views: 189,
    saved: 67,
    featured: false
  },
  {
    id: '3',
    title: 'أبقار حلوب هولشتاين',
    description: 'أبقار حلوب هولشتاين عالية الإنتاج، صحية ومطعمة بالكامل',
    price: 180000,
    currency: 'DZD',
    condition: 'excellent',
    location: 'سطيف',
    brand: 'other',
    year: 2023,
    image: '/api/placeholder/400/300',
    images: ['/api/placeholder/400/300'],
    category: 'livestock',
    seller: {
      name: 'محمد الطاهر',
      rating: 4.7,
      verified: true,
      location: 'سطيف',
      responseTime: 'خلال ساعتين'
    },
    createdAt: '2024-01-20',
    views: 156,
    saved: 23,
    featured: true
  }
];

export default function ListingsPage() {
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    condition: '',
    brand: '',
    year: '',
    priceRange: '',
    locationRadius: 50,
    search: ''
  });
  
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Mock data for now - replace with actual API call
  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(sampleProducts.length);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters.location) {
      filtered = filtered.filter(p => p.location === filters.location);
    }
    if (filters.condition) {
      filtered = filtered.filter(p => p.condition === filters.condition);
    }
    if (filters.brand) {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }
    if (filters.year) {
      filtered = filtered.filter(p => p.year === parseInt(filters.year));
    }
    if (filters.search) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.brand.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.seller.rating - a.seller.rating);
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [products, filters, sortBy]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      condition: '',
      brand: '',
      year: '',
      priceRange: '',
      locationRadius: 50,
      search: ''
    });
    setCurrentPage(1);
  };

  const toggleSaved = (productId: string) => {
    setSavedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">المنتجات الزراعية</h1>
              <p className="text-gray-300">
                {filteredProducts.length.toLocaleString()} منتج متاح من أصل {totalItems.toLocaleString()}
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 lg:flex-1 lg:max-w-2xl lg:mr-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن منتجات زراعية..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 rounded-lg transition-colors ${
                    showFilters ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setShowMap(!showMap)}
                  className={`p-3 rounded-lg transition-colors ${
                    showMap ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Map className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="newest">الأحدث</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="rating">التقييم</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black/20 backdrop-blur-md border-b border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">الفئة</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">جميع الفئات</option>
                    {filterOptions.categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">الماركة</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">جميع الماركات</option>
                    {filterOptions.brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name} ({brand.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">الموقع</label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">جميع المواقع</option>
                    {filterOptions.locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} ({location.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">الحالة</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">جميع الحالات</option>
                    {filterOptions.conditions.map((condition) => (
                      <option key={condition.id} value={condition.id}>
                        {condition.name} ({condition.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  مسح جميع المرشحات
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loading />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
            <p className="text-gray-400 mb-4">لم يتم العثور على منتجات تطابق معايير البحث</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              مسح جميع المرشحات
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {paginatedProducts.map((product, index) => (
                <OptimizedProductCard
                  key={product.id}
                  product={product}
                  onSave={() => toggleSaved(product.id)}
                  onShare={() => {/* Share functionality */}}
                  onContact={() => {/* Contact functionality */}}
                  isSaved={savedItems.includes(product.id)}
                  viewMode={viewMode}
                  priority={index < 6}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  السابق
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
