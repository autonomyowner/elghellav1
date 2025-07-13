'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Grid, List, ChevronRight, 
  Tractor, Leaf, Droplets, Wheat, Apple, 
  Cow, Wrench, Truck, MapPin, Star, 
  TrendingUp, Package, Users, Clock
} from 'lucide-react';
import Link from 'next/link';

// Enhanced categories with proper Arabic names and descriptions
const categories = [
  {
    id: 'equipment',
    name: 'معدات زراعية',
    description: 'جرارات، حصادات، آلات الري والمعدات الزراعية الحديثة',
    icon: <Tractor className="w-8 h-8" />,
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-600',
    itemCount: 2847,
    trending: true,
    subcategories: [
      { name: 'جرارات', count: 458 },
      { name: 'حصادات', count: 234 },
      { name: 'آلات الري', count: 567 },
      { name: 'مولدات', count: 189 },
      { name: 'معدات أخرى', count: 1399 }
    ]
  },
  {
    id: 'seeds',
    name: 'بذور ونباتات',
    description: 'بذور عالية الجودة، شتلات، نباتات زينة وأشجار مثمرة',
    icon: <Leaf className="w-8 h-8" />,
    color: 'green',
    gradient: 'from-green-500 to-lime-600',
    itemCount: 1923,
    trending: false,
    subcategories: [
      { name: 'بذور خضروات', count: 445 },
      { name: 'بذور حبوب', count: 298 },
      { name: 'شتلات أشجار', count: 387 },
      { name: 'نباتات زينة', count: 234 },
      { name: 'أعشاب طبية', count: 559 }
    ]
  },
  {
    id: 'fertilizers',
    name: 'أسمدة ومبيدات',
    description: 'أسمدة عضوية وكيماوية، مبيدات حشرية وفطرية آمنة',
    icon: <Droplets className="w-8 h-8" />,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    itemCount: 876,
    trending: true,
    subcategories: [
      { name: 'أسمدة عضوية', count: 234 },
      { name: 'أسمدة كيماوية', count: 189 },
      { name: 'مبيدات حشرية', count: 156 },
      { name: 'مبيدات فطرية', count: 123 },
      { name: 'منشطات نمو', count: 174 }
    ]
  },
  {
    id: 'crops',
    name: 'محاصيل وحبوب',
    description: 'قمح، شعير، ذرة، أرز وجميع أنواع الحبوب والمحاصيل',
    icon: <Wheat className="w-8 h-8" />,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    itemCount: 1456,
    trending: false,
    subcategories: [
      { name: 'قمح', count: 345 },
      { name: 'شعير', count: 267 },
      { name: 'ذرة', count: 298 },
      { name: 'أرز', count: 189 },
      { name: 'محاصيل أخرى', count: 357 }
    ]
  },
  {
    id: 'fruits',
    name: 'خضروات وفواكه',
    description: 'منتجات طازجة، خضروات موسمية وفواكه عالية الجودة',
    icon: <Apple className="w-8 h-8" />,
    color: 'red',
    gradient: 'from-red-500 to-pink-600',
    itemCount: 3241,
    trending: true,
    subcategories: [
      { name: 'خضروات ورقية', count: 567 },
      { name: 'طماطم وخيار', count: 445 },
      { name: 'فواكه حمضية', count: 398 },
      { name: 'فواكه موسمية', count: 623 },
      { name: 'خضروات جذرية', count: 1208 }
    ]
  },
  {
    id: 'livestock',
    name: 'حيوانات المزرعة',
    description: 'أبقار، أغنام، ماعز، دواجن وجميع حيوانات المزرعة',
    icon: <Cow className="w-8 h-8" />,
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
    itemCount: 1134,
    trending: false,
    subcategories: [
      { name: 'أبقار', count: 234 },
      { name: 'أغنام وماعز', count: 345 },
      { name: 'دواجن', count: 298 },
      { name: 'خيول', count: 67 },
      { name: 'حيوانات أخرى', count: 190 }
    ]
  },
  {
    id: 'tools',
    name: 'أدوات يدوية',
    description: 'أدوات زراعية يدوية، معدات صغيرة وأدوات الصيانة',
    icon: <Wrench className="w-8 h-8" />,
    color: 'gray',
    gradient: 'from-gray-500 to-slate-600',
    itemCount: 789,
    trending: false,
    subcategories: [
      { name: 'أدوات حفر', count: 156 },
      { name: 'أدوات تقليم', count: 134 },
      { name: 'أدوات قياس', count: 89 },
      { name: 'معدات صيانة', count: 234 },
      { name: 'أدوات أخرى', count: 176 }
    ]
  },
  {
    id: 'transport',
    name: 'نقل وخدمات',
    description: 'خدمات النقل، التوصيل، التخزين والخدمات اللوجستية',
    icon: <Truck className="w-8 h-8" />,
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    itemCount: 456,
    trending: true,
    subcategories: [
      { name: 'نقل المحاصيل', count: 123 },
      { name: 'نقل المعدات', count: 89 },
      { name: 'خدمات تخزين', count: 134 },
      { name: 'خدمات تبريد', count: 67 },
      { name: 'خدمات أخرى', count: 43 }
    ]
  }
];

// Popular searches
const popularSearches = [
  'جرارات مستعملة',
  'بذور طماطم',
  'أسمدة عضوية',
  'أبقار حلوب',
  'معدات ري',
  'شتلات زيتون',
  'حصادات قمح',
  'مبيدات طبيعية'
];

// Featured categories for quick access
const featuredCategories = [
  { name: 'الأكثر طلباً', icon: <TrendingUp className="w-5 h-5" />, color: 'emerald' },
  { name: 'وصل حديثاً', icon: <Package className="w-5 h-5" />, color: 'blue' },
  { name: 'الأكثر تقييماً', icon: <Star className="w-5 h-5" />, color: 'yellow' },
  { name: 'بائعين موثوقين', icon: <Users className="w-5 h-5" />, color: 'purple' }
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">فئات المنتجات</h1>
              <p className="text-gray-300">اكتشف جميع الفئات الزراعية المتاحة</p>
            </div>

            {/* Search and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث في الفئات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-3 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">فئات مميزة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-gradient-to-r from-${category.color}-500/20 to-${category.color}-600/20 backdrop-blur-md rounded-xl p-4 border border-${category.color}-500/30 hover:border-${category.color}-500/50 transition-all duration-300 cursor-pointer group`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${category.color}-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <span className="font-medium">{category.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">عمليات البحث الشائعة</h2>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-all duration-300 border border-white/20 hover:border-emerald-500/50"
                onClick={() => setSearchQuery(search)}
              >
                {search}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Categories Grid/List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">جميع الفئات</h2>
            <div className="text-gray-300">
              {filteredCategories.length} فئة متاحة
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/categories/${category.id}`}>
                    <div className={`bg-gradient-to-br ${category.gradient}/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-${category.color}-500/50 transition-all duration-300 cursor-pointer group-hover:transform group-hover:scale-105`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient}/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          {category.icon}
                        </div>
                        {category.trending && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded-full text-xs text-emerald-400">
                            <TrendingUp className="w-3 h-3" />
                            رائج
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Package className="w-4 h-4" />
                          <span className="text-sm">{category.itemCount.toLocaleString()} منتج</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                      </div>

                      {/* Subcategories Preview */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 3).map((sub, subIndex) => (
                            <span
                              key={subIndex}
                              className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                            >
                              {sub.name}
                            </span>
                          ))}
                          {category.subcategories.length > 3 && (
                            <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                              +{category.subcategories.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/categories/${category.id}`}>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group-hover:bg-white/20">
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient}/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                          {category.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                              {category.name}
                            </h3>
                            {category.trending && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded-full text-xs text-emerald-400">
                                <TrendingUp className="w-3 h-3" />
                                رائج
                              </div>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm mb-3">
                            {category.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              <span>{category.itemCount.toLocaleString()} منتج</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{Math.floor(category.itemCount / 10)} بائع</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-400 mb-1">الفئات الفرعية</div>
                            <div className="flex flex-wrap gap-1 justify-end">
                              {category.subcategories.slice(0, 2).map((sub, subIndex) => (
                                <span
                                  key={subIndex}
                                  className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                                >
                                  {sub.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 backdrop-blur-md rounded-2xl p-8 text-center border border-emerald-500/30"
        >
          <h2 className="text-3xl font-bold mb-4">لم تجد ما تبحث عنه؟</h2>
          <p className="text-gray-300 text-lg mb-6">
            تواصل معنا وسنساعدك في العثور على المنتج المناسب
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors">
              تواصل معنا
            </Link>
            <Link href="/listings/new" className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors border border-white/20">
              أضف منتجك
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
