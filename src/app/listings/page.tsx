'use client';

import React, { useState, useEffect } from 'react';
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

// Enhanced filter options for Algerian marketplace
const filterOptions = {
  categories: [
    { id: 'equipment', name: 'معدات زراعية', count: 2847 },
    { id: 'seeds', name: 'بذور ونباتات', count: 1923 },
    { id: 'fertilizers', name: 'أسمدة ومبيدات', count: 876 },
    { id: 'crops', name: 'محاصيل وحبوب', count: 1456 },
    { id: 'fruits', name: 'خضروات وفواكه', count: 3241 },
    { id: 'livestock', name: 'حيوانات المزرعة', count: 1134 },
    { id: 'tools', name: 'أدوات يدوية', count: 789 },
    { id: 'transport', name: 'نقل وخدمات', count: 456 }
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
    { id: 'under-10k', name: 'أقل من 10,000 دج', min: 0, max: 10000 },
    { id: '10k-50k', name: '10,000 - 50,000 دج', min: 10000, max: 50000 },
    { id: '50k-100k', name: '50,000 - 100,000 دج', min: 50000, max: 100000 },
    { id: '100k-500k', name: '100,000 - 500,000 دج', min: 100000, max: 500000 },
    { id: 'over-500k', name: 'أكثر من 500,000 دج', min: 500000, max: Infinity }
  ],
  sortOptions: [
    { id: 'newest', name: 'الأحدث', icon: <Clock className="w-4 h-4" /> },
    { id: 'price-low', name: 'السعر: من الأقل للأعلى', icon: <ArrowUpDown className="w-4 h-4" /> },
    { id: 'price-high', name: 'السعر: من الأعلى للأقل', icon: <ArrowUpDown className="w-4 h-4" /> },
    { id: 'popular', name: 'الأكثر شعبية', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'rating', name: 'التقييم', icon: <Star className="w-4 h-4" /> },
    { id: 'distance', name: 'المسافة', icon: <MapPin className="w-4 h-4" /> }
  ]
};

// Sample products for demonstration
const sampleProducts = [
  {
    id: '1',
    title: 'جرار زراعي فيات 110 حصان',
    description: 'جرار زراعي فيات 110 حصان، حالة ممتازة، مستعمل لمدة 3 سنوات فقط',
    price: 2500000,
    currency: 'DZD',
    condition: 'excellent',
    location: 'البليدة',
    images: ['/assets/pexels-timmossholder-974314.jpg'],
    category: 'معدات زراعية',
    seller: {
      name: 'أحمد بن علي',
      rating: 4.8,
      verified: true,
      location: 'البليدة'
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
    images: ['/assets/pexels-cottonbro-4921204.jpg'],
    category: 'بذور ونباتات',
    seller: {
      name: 'مريم الزهراء',
      rating: 4.9,
      verified: true,
      location: 'الجزائر العاصمة'
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
    images: ['/assets/cows1.jpg'],
    category: 'حيوانات المزرعة',
    seller: {
      name: 'محمد الطاهر',
      rating: 4.7,
      verified: true,
      location: 'سطيف'
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
    priceRange: '',
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
  const filteredProducts = React.useMemo(() => {
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
    if (filters.search) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'rating':
        filtered.sort((a, b) => b.seller.rating - a.seller.rating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [products, filters, sortBy]);

  // Pagination
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      condition: '',
      priceRange: '',
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
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                className="w-80 flex-shrink-0"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">تصفية النتائج</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={clearFilters}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        مسح الكل
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-1 hover:bg-white/10 rounded transition-colors lg:hidden"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Category Filter */}
                    <div>
                      <h3 className="font-semibold mb-3">الفئة</h3>
                      <div className="space-y-2">
                        {filterOptions.categories.map(category => (
                          <label key={category.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="category"
                              value={category.id}
                              checked={filters.category === category.id}
                              onChange={(e) => handleFilterChange('category', e.target.value)}
                              className="w-4 h-4 text-emerald-600 bg-white/10 border-white/20 focus:ring-emerald-500"
                            />
                            <span className="flex-1">{category.name}</span>
                            <span className="text-sm text-gray-400">({category.count})</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <h3 className="font-semibold mb-3">الموقع</h3>
                      <div className="space-y-2">
                        {filterOptions.locations.map(location => (
                          <label key={location.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="location"
                              value={location.name}
                              checked={filters.location === location.name}
                              onChange={(e) => handleFilterChange('location', e.target.value)}
                              className="w-4 h-4 text-emerald-600 bg-white/10 border-white/20 focus:ring-emerald-500"
                            />
                            <span className="flex-1">{location.name}</span>
                            <span className="text-sm text-gray-400">({location.count})</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Condition Filter */}
                    <div>
                      <h3 className="font-semibold mb-3">الحالة</h3>
                      <div className="space-y-2">
                        {filterOptions.conditions.map(condition => (
                          <label key={condition.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="condition"
                              value={condition.id}
                              checked={filters.condition === condition.id}
                              onChange={(e) => handleFilterChange('condition', e.target.value)}
                              className="w-4 h-4 text-emerald-600 bg-white/10 border-white/20 focus:ring-emerald-500"
                            />
                            <span className="flex-1">{condition.name}</span>
                            <span className="text-sm text-gray-400">({condition.count})</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <h3 className="font-semibold mb-3">نطاق السعر</h3>
                      <div className="space-y-2">
                        {filterOptions.priceRanges.map(range => (
                          <label key={range.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="priceRange"
                              value={range.id}
                              checked={filters.priceRange === range.id}
                              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                              className="w-4 h-4 text-emerald-600 bg-white/10 border-white/20 focus:ring-emerald-500"
                            />
                            <span>{range.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Results Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="text-gray-300">
                عرض {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} من {filteredProducts.length} منتج
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">ترتيب حسب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {filterOptions.sortOptions.map(option => (
                    <option key={option.id} value={option.id} className="bg-gray-800">
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loading />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
                <p className="text-gray-400 mb-6">جرب تغيير المرشحات أو البحث عن شيء آخر</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  مسح جميع المرشحات
                </button>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group"
                      >
                        <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-emerald-500/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
                          {/* Product Image */}
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {product.featured && (
                              <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                مميز
                              </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                              <button
                                onClick={() => toggleSaved(product.id)}
                                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                                  savedItems.includes(product.id)
                                    ? 'bg-red-500 text-white'
                                    : 'bg-black/20 text-white hover:bg-black/40'
                                }`}
                              >
                                <Heart className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-colors">
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                                {product.title}
                              </h3>
                              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                                {product.condition === 'new' ? 'جديد' : 
                                 product.condition === 'excellent' ? 'ممتاز' : 
                                 product.condition === 'good' ? 'جيد' : 'مقبول'}
                              </span>
                            </div>

                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                              {product.description}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                              <MapPin className="w-4 h-4" />
                              <span>{product.location}</span>
                              <span className="text-gray-500">•</span>
                              <Eye className="w-4 h-4" />
                              <span>{product.views}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-2xl font-bold text-emerald-400">
                                {product.price.toLocaleString()} دج
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm">{product.seller.rating}</span>
                                </div>
                                {product.seller.verified && (
                                  <Verified className="w-4 h-4 text-emerald-400" />
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <MessageCircle className="w-4 h-4" />
                                راسل البائع
                              </button>
                              <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                                <Phone className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group"
                      >
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-emerald-500/50 transition-all duration-300 group-hover:bg-white/20">
                          <div className="flex gap-6">
                            {/* Product Image */}
                            <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors mb-2">
                                    {product.title}
                                  </h3>
                                  <p className="text-gray-300 text-sm line-clamp-2">
                                    {product.description}
                                  </p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <button
                                    onClick={() => toggleSaved(product.id)}
                                    className={`p-2 rounded-full transition-colors ${
                                      savedItems.includes(product.id)
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                    }`}
                                  >
                                    <Heart className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 rounded-full bg-white/10 text-gray-400 hover:bg-white/20 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{product.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{product.views} مشاهدة</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(product.createdAt).toLocaleDateString('ar-DZ')}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold text-emerald-400">
                                  {product.price.toLocaleString()} دج
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span>{product.seller.rating}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-400">{product.seller.name}</span>
                                    {product.seller.verified && (
                                      <Verified className="w-4 h-4 text-emerald-400" />
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                                      <MessageCircle className="w-4 h-4" />
                                      راسل البائع
                                    </button>
                                    <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                                      <Phone className="w-4 h-4" />
                                      اتصل
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        السابق
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
