'use client';

import React, { useState, useCallback, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Star, Heart, MessageCircle, Share2, 
  User, Verified, Calendar, Package, Eye,
  ChevronRight, Clock, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    image: string;
    images?: string[];
    category: string;
    location: string;
    condition: string;
    brand?: string;
    year?: number;
    seller: {
      name: string;
      rating: number;
      verified: boolean;
      location: string;
      responseTime?: string;
    };
    createdAt: string;
    views: number;
    saved: number;
    featured: boolean;
  };
  onSave?: (id: string) => void;
  onShare?: (id: string) => void;
  onContact?: (id: string) => void;
  isSaved?: boolean;
  viewMode?: 'grid' | 'list';
  priority?: boolean;
}

const OptimizedProductCard = memo(({
  product,
  onSave,
  onShare,
  onContact,
  isSaved = false,
  viewMode = 'grid',
  priority = false
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Memoized price formatting
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(product.price);
  }, [product.price]);

  // Memoized date formatting
  const formattedDate = useMemo(() => {
    const date = new Date(product.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'اليوم';
    if (diffDays === 2) return 'أمس';
    if (diffDays <= 7) return `${diffDays} أيام`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} أسابيع`;
    return `${Math.ceil(diffDays / 30)} شهور`;
  }, [product.createdAt]);

  // Optimized event handlers
  const handleSave = useCallback(() => {
    onSave?.(product.id);
  }, [onSave, product.id]);

  const handleShare = useCallback(() => {
    onShare?.(product.id);
  }, [onShare, product.id]);

  const handleContact = useCallback(() => {
    onContact?.(product.id);
  }, [onContact, product.id]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Condition color mapping
  const conditionColors = {
    'new': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'excellent': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'good': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'fair': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'poor': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const conditionText = {
    'new': 'جديد',
    'excellent': 'ممتاز',
    'good': 'جيد',
    'fair': 'مقبول',
    'poor': 'يحتاج إصلاح'
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image Section */}
          <div className="relative w-full sm:w-64 h-48 sm:h-auto overflow-hidden">
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            {!imageError ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className={cn(
                  "object-cover transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
                priority={priority}
                sizes="(max-width: 640px) 100vw, 256px"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {product.featured && (
                <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-medium">
                  مميز
                </span>
              )}
              <span className={cn(
                "px-2 py-1 text-xs rounded-full font-medium",
                conditionColors[product.condition as keyof typeof conditionColors]
              )}>
                {conditionText[product.condition as keyof typeof conditionText]}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="absolute top-2 left-2 flex gap-1">
              <button
                onClick={handleSave}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isSaved 
                    ? "bg-red-500 text-white" 
                    : "bg-black/50 text-white hover:bg-black/70"
                )}
              >
                <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                {product.title}
              </h3>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400 ml-4">
                {formattedPrice}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">{product.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">{formattedDate}</span>
              </div>
              {product.brand && (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{product.brand}</span>
                </div>
              )}
              {product.year && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{product.year}</span>
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.seller.name}
                    </span>
                    {product.seller.verified && (
                      <Verified className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>{product.seller.rating}</span>
                    {product.seller.responseTime && (
                      <>
                        <span>•</span>
                        <span>{product.seller.responseTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleContact}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تواصل</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{product.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{product.saved}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.featured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-medium">
              مميز
            </span>
          )}
          <span className={cn(
            "px-2 py-1 text-xs rounded-full font-medium",
            conditionColors[product.condition as keyof typeof conditionColors]
          )}>
            {conditionText[product.condition as keyof typeof conditionText]}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 left-2 flex gap-1">
          <button
            onClick={handleSave}
            className={cn(
              "p-2 rounded-full transition-colors",
              isSaved 
                ? "bg-red-500 text-white" 
                : "bg-black/50 text-white hover:bg-black/70"
            )}
          >
            <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
            {product.title}
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-green-600 dark:text-green-400">
            {formattedPrice}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{product.location}</span>
          </div>
        </div>

        {/* Product Details */}
        {(product.brand || product.year) && (
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
            {product.brand && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                {product.brand}
              </span>
            )}
            {product.year && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                {product.year}
              </span>
            )}
          </div>
        )}

        {/* Seller Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {product.seller.name}
                </span>
                {product.seller.verified && (
                  <Verified className="w-3 h-3 text-green-500" />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{product.seller.rating}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleContact}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-1"
          >
            <MessageCircle className="w-3 h-3" />
            <span>تواصل</span>
          </button>
        </div>

        {/* Stats and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{product.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{product.saved}</span>
            </div>
          </div>
          <span>{formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export default OptimizedProductCard;