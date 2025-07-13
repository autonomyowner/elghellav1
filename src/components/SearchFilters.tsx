'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, MapPin, Calendar, DollarSign, 
  Star, Verified, SlidersHorizontal, X, ChevronDown,
  Tractor, Leaf, Droplets, Wheat, Apple, Cow, Wrench, Truck,
  AlertCircle, CheckCircle, Clock, TrendingUp, Package
} from 'lucide-react';

interface FilterOptions {
  categories: Array<{ id: string; name: string; icon: React.ReactNode; count: number }>;
  locations: Array<{ id: string; name: string; count: number }>;
  conditions: Array<{ id: string; name: string; count: number }>;
  priceRanges: Array<{ id: string; name: string; min: number; max: number }>;
  dateRanges: Array<{ id: string; name: string; days: number }>;
  sellers: Array<{ id: string; name: string; rating: number; verified: boolean }>;
}

interface Filters {
  search: string;
  category: string;
  location: string;
  condition: string;
  priceRange: string;
  dateRange: string;
  minPrice: number;
  maxPrice: number;
  sellerRating: number;
  verifiedOnly: boolean;
  featuredOnly: boolean;
  availableOnly: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface SearchFiltersProps {
  onFiltersChange: (filters: Filters) => void;
  onSearch: (query: string) => void;
  totalResults: number;
  isLoading?: boolean;
}

const defaultFilters: Filters = {
  search: '',
  category: '',
  location: '',
  condition: '',
  priceRange: '',
  dateRange: '',
  minPrice: 0,
  maxPrice: 10000000,
  sellerRating: 0,
  verifiedOnly: false,
  featuredOnly: false,
  availableOnly: true,
  sortBy: 'newest',
  sortOrder: 'desc'
};

const filterOptions: FilterOptions = {
  categories: [
    { id: 'equipment', name: 'معدات زراعية', icon: <Tractor className="w-4 h-4" />, count: 2847 },
    { id: 'seeds', name: 'بذور ونباتات', icon: <Leaf className="w-4 h-4" />, count: 1923 },
    { id: 'fertilizers', name: 'أسمدة ومبيدات', icon: <Droplets className="w-4 h-4" />, count: 876 },
    { id: 'crops', name: 'محاصيل وحبوب', icon: <Wheat className="w-4 h-4" />, count: 1456 },
    { id: 'fruits', name: 'خضروات وفواكه', icon: <Apple className="w-4 h-4" />, count: 3241 },
    { id: 'livestock', name: 'حيوانات المزرعة', icon: <Cow className="w-4 h-4" />, count: 1134 },
    { id: 'tools', name: 'أدوات يدوية', icon: <Wrench className="w-4 h-4" />, count: 789 },
    { id: 'transport', name: 'نقل وخدمات', icon: <Truck className="w-4 h-4" />, count: 456 }
  ],
  locations: [
    { id: 'algiers', name: 'الجزائر العاصمة', count: 1245 },
    { id: 'oran', name: 'وهران', count: 892 },
    { id: 'constantine', name: 'قسنطينة', count: 634 },
    { id: 'blida', name: 'البليدة', count: 567 },
    { id: 'setif', name: 'سطيف', count: 489 },
    { id: 'annaba', name: 'عنابة', count: 423 },
    { id: 'batna', name: 'باتنة', count: 378 },
    { id: 'djelfa', name: 'الجلفة', count: 345 },
    { id: 'tizi-ouzou', name: 'تيزي وزو', count: 298 },
    { id: 'sidi-bel-abbes', name: 'سيدي بلعباس', count: 267 }
  ],
  conditions: [
    { id: 'new', name: 'جديد', count: 2134 },
    { id: 'excellent', name: 'ممتاز', count: 1876 },
    { id: 'good', name: 'جيد', count: 1456 },
    { id: 'fair', name: 'مقبول', count: 892 },
    { id: 'poor', name: 'يحتاج إصلاح', count: 234 }
  ],
  priceRanges: [
    { id: 'under-1k', name: 'أقل من 1,000 دج', min: 0, max: 1000 },
    { id: '1k-5k', name: '1,000 - 5,000 دج', min: 1000, max: 5000 },
    { id: '5k-10k', name: '5,000 - 10,000 دج', min: 5000, max: 10000 },
    { id: '10k-50k', name: '10,000 - 50,000 دج', min: 10000, max: 50000 },
    { id: '50k-100k', name: '50,000 - 100,000 دج', min: 50000, max: 100000 },
    { id: '100k-500k', name: '100,000 - 500,000 دج', min: 100000, max: 500000 },
    { id: '500k-1m', name: '500,000 - 1,000,000 دج', min: 500000, max: 1000000 },
    { id: 'over-1m', name: 'أكثر من 1,000,000 دج', min: 1000000, max: 10000000 }
  ],
  dateRanges: [
    { id: 'today', name: 'اليوم', days: 1 },
    { id: 'week', name: 'آخر أسبوع', days: 7 },
    { id: 'month', name: 'آخر شهر', days: 30 },
    { id: '3months', name: 'آخر 3 أشهر', days: 90 },
    { id: '6months', name: 'آخر 6 أشهر', days: 180 },
    { id: 'year', name: 'آخر سنة', days: 365 }
  ],
  sellers: [
    { id: 'seller1', name: 'أحمد بن علي', rating: 4.8, verified: true },
    { id: 'seller2', name: 'مريم الزهراء', rating: 4.9, verified: true },
    { id: 'seller3', name: 'محمد الطاهر', rating: 4.7, verified: true },
    { id: 'seller4', name: 'فاطمة بنت عيسى', rating: 4.6, verified: false },
    { id: 'seller5', name: 'عبد الرحمن المزارع', rating: 4.5, verified: true }
  ]
};

const sortOptions = [
  { id: 'newest', name: 'الأحدث', icon: <Clock className="w-4 h-4" /> },
  { id: 'oldest', name: 'الأقدم', icon: <Clock className="w-4 h-4" /> },
  { id: 'price-low', name: 'السعر: من الأقل للأعلى', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'price-high', name: 'السعر: من الأعلى للأقل', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'popular', name: 'الأكثر شعبية', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'rating', name: 'التقييم', icon: <Star className="w-4 h-4" /> },
  { id: 'alphabetical', name: 'أبجدي', icon: <Package className="w-4 h-4" /> }
];

export default function SearchFilters({ 
  onFiltersChange, 
  onSearch, 
  totalResults, 
  isLoading = false 
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Search suggestions
  const searchSuggestions = [
    'جرار زراعي',
    'حصادة قمح',
    'بذور طماطم',
    'أسمدة عضوية',
    'أبقار حلوب',
    'معدات ري',
    'شتلات زيتون',
    'مبيدات طبيعية',
    'آلات حراثة',
    'دواجن'
  ];

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (value.length > 1) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.includes(value)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setSuggestions([]);
    const newFilters = { ...filters, search: query };
    setFilters(newFilters);
    onSearch(query);
    onFiltersChange(newFilters);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery('');
    setSuggestions([]);
    onFiltersChange(defaultFilters);
    onSearch('');
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.location) count++;
    if (filters.condition) count++;
    if (filters.priceRange) count++;
    if (filters.dateRange) count++;
    if (filters.verifiedOnly) count++;
    if (filters.featuredOnly) count++;
    if (filters.sellerRating > 0) count++;
    return count;
  };

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          <input
            type="text"
            placeholder="ابحث عن منتجات زراعية..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}
            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 text-lg"
          />
          <button
            onClick={() => handleSearchSubmit(searchQuery)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            بحث
          </button>
        </div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 z-50"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchSubmit(suggestion)}
                  className="w-full text-right px-4 py-3 hover:bg-white/20 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{suggestion}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            showAdvanced 
              ? 'bg-emerald-600 border-emerald-600 text-white' 
              : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>فلترة متقدمة</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>

        {/* Quick category filters */}
        {filterOptions.categories.slice(0, 4).map(category => (
          <button
            key={category.id}
            onClick={() => handleFilterChange('category', 
              filters.category === category.id ? '' : category.id
            )}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              filters.category === category.id
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
            }`}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}

        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>مسح الكل</span>
          </button>
        )}
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          {isLoading ? 'جاري البحث...' : `${totalResults.toLocaleString()} نتيجة`}
        </span>
        <div className="flex items-center gap-4">
          <span>ترتيب حسب:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white focus:ring-2 focus:ring-emerald-500"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id} className="bg-gray-800">
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  الفئات
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {filterOptions.categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleFilterChange('category', 
                        filters.category === category.id ? '' : category.id
                      )}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                        filters.category === category.id
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {category.icon}
                      <div className="text-right">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs opacity-75">({category.count})</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  الموقع
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {filterOptions.locations.map(location => (
                    <button
                      key={location.id}
                      onClick={() => handleFilterChange('location', 
                        filters.location === location.id ? '' : location.id
                      )}
                      className={`p-2 rounded-lg border transition-colors text-sm ${
                        filters.location === location.id
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {location.name} ({location.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  نطاق السعر
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {filterOptions.priceRanges.map(range => (
                    <button
                      key={range.id}
                      onClick={() => handleFilterChange('priceRange', 
                        filters.priceRange === range.id ? '' : range.id
                      )}
                      className={`p-2 rounded-lg border transition-colors text-sm ${
                        filters.priceRange === range.id
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {range.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  الحالة
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.conditions.map(condition => (
                    <button
                      key={condition.id}
                      onClick={() => handleFilterChange('condition', 
                        filters.condition === condition.id ? '' : condition.id
                      )}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        filters.condition === condition.id
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {condition.name} ({condition.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  تاريخ النشر
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.dateRanges.map(range => (
                    <button
                      key={range.id}
                      onClick={() => handleFilterChange('dateRange', 
                        filters.dateRange === range.id ? '' : range.id
                      )}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        filters.dateRange === range.id
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {range.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Options */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  خيارات إضافية
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 bg-white/10 border-white/20 rounded focus:ring-emerald-500"
                    />
                    <Verified className="w-4 h-4 text-emerald-400" />
                    <span>بائعين موثوقين فقط</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.featuredOnly}
                      onChange={(e) => handleFilterChange('featuredOnly', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 bg-white/10 border-white/20 rounded focus:ring-emerald-500"
                    />
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>المنتجات المميزة فقط</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.availableOnly}
                      onChange={(e) => handleFilterChange('availableOnly', e.target.checked)}
                      className="w-4 h-4 text-emerald-600 bg-white/10 border-white/20 rounded focus:ring-emerald-500"
                    />
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>المتاح فقط</span>
                  </label>
                </div>
              </div>

              {/* Seller Rating */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  تقييم البائع
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">الحد الأدنى:</span>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.sellerRating}
                    onChange={(e) => handleFilterChange('sellerRating', parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{filters.sellerRating}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
