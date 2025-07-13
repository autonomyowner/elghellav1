'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Grid, List, MapPin, Star, Heart, 
  MessageCircle, Phone, Eye, ChevronDown, ChevronRight,
  SlidersHorizontal, X, Calendar, DollarSign, Package,
  User, Verified, TrendingUp, Clock, ArrowUpDown,
  Map, Bookmark, Share2, AlertCircle, Camera,
  TouchpadIcon, Smartphone, Tablet, Monitor,
  Move, Hand, ZoomIn, ZoomOut
} from 'lucide-react';

interface MobileOptimizedInterfaceProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onPinchZoom?: (scale: number) => void;
  enableSwipeGestures?: boolean;
  enablePinchZoom?: boolean;
}

interface TouchGesture {
  type: 'swipe' | 'pinch' | 'tap' | 'longPress';
  direction?: 'left' | 'right' | 'up' | 'down';
  scale?: number;
  duration?: number;
}

export default function MobileOptimizedInterface({
  children,
  onSwipeLeft,
  onSwipeRight,
  onPinchZoom,
  enableSwipeGestures = true,
  enablePinchZoom = false
}: MobileOptimizedInterfaceProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isGestureActive, setIsGestureActive] = useState(false);
  const [gestureType, setGestureType] = useState<TouchGesture['type'] | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout>();

  // Detect device type and orientation
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setOrientation(height > width ? 'portrait' : 'landscape');
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    window.addEventListener('orientationchange', checkDeviceType);

    return () => {
      window.removeEventListener('resize', checkDeviceType);
      window.removeEventListener('orientationchange', checkDeviceType);
    };
  }, []);

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipeGestures) return;
    
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    setIsGestureActive(true);

    // Long press detection
    touchTimeoutRef.current = setTimeout(() => {
      setGestureType('longPress');
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipeGestures || !isGestureActive) return;
    
    // Clear long press timeout on move
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!enableSwipeGestures || !isGestureActive) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // Clear timeouts
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }

    // Determine gesture type
    if (absDeltaX > 50 || absDeltaY > 50) {
      // Swipe gesture
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          setGestureType('swipe');
          onSwipeRight?.();
        } else {
          setGestureType('swipe');
          onSwipeLeft?.();
        }
      }
    } else {
      // Tap gesture
      setGestureType('tap');
    }

    setIsGestureActive(false);
    
    // Reset gesture type after animation
    setTimeout(() => setGestureType(null), 300);
  };

  // Pinch zoom handler
  const handlePinch = (event: any, info: any) => {
    if (!enablePinchZoom) return;
    
    const newScale = Math.max(0.5, Math.min(3, scale + info.delta.y * 0.01));
    setScale(newScale);
    onPinchZoom?.(newScale);
  };

  // Mobile-specific styles
  const mobileStyles = {
    container: isMobile ? 'px-4 py-2' : 'px-6 py-4',
    text: isMobile ? 'text-sm' : 'text-base',
    button: isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-base',
    spacing: isMobile ? 'space-y-3' : 'space-y-4',
    grid: isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3',
    touch: 'touch-manipulation select-none'
  };

  return (
    <div className="relative">
      {/* Device Type Indicator (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50 bg-black/80 text-white px-2 py-1 rounded text-xs">
          {isMobile ? (
            <div className="flex items-center gap-1">
              <Smartphone className="w-3 h-3" />
              <span>Mobile</span>
            </div>
          ) : isTablet ? (
            <div className="flex items-center gap-1">
              <Tablet className="w-3 h-3" />
              <span>Tablet</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Monitor className="w-3 h-3" />
              <span>Desktop</span>
            </div>
          )}
          <span className="mx-1">•</span>
          <span>{orientation}</span>
        </div>
      )}

      {/* Gesture Feedback */}
      <AnimatePresence>
        {gestureType && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-black/50 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              {gestureType === 'swipe' && <Move className="w-5 h-5" />}
              {gestureType === 'pinch' && <ZoomIn className="w-5 h-5" />}
              {gestureType === 'tap' && <TouchpadIcon className="w-5 h-5" />}
              {gestureType === 'longPress' && <Clock className="w-5 h-5" />}
              <span className="capitalize">{gestureType}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <motion.div
        ref={containerRef}
        className={`${mobileStyles.container} ${mobileStyles.touch}`}
        style={{ transform: `scale(${scale})` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPan={enablePinchZoom ? handlePinch : undefined}
      >
        {children}
      </motion.div>

      {/* Mobile Navigation Helper */}
      {isMobile && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-black/80 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
            <Move className="w-3 h-3" />
            <span>اسحب يميناً ويساراً للتنقل</span>
          </div>
        </div>
      )}

      {/* Touch Optimization Styles */}
      <style jsx global>{`
        /* Touch-friendly button sizes */
        .touch-button {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Prevent text selection on touch */
        .touch-manipulation {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Smooth scrolling on mobile */
        .mobile-scroll {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        
        /* Hide scrollbars on mobile */
        @media (max-width: 768px) {
          .mobile-scroll::-webkit-scrollbar {
            display: none;
          }
          .mobile-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
        
        /* Tap highlight removal */
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Mobile-specific input styles */
        @media (max-width: 768px) {
          input, textarea, select {
            font-size: 16px; /* Prevent zoom on iOS */
          }
        }
      `}</style>
    </div>
  );
}

// Mobile-optimized product card component
export function MobileProductCard({ 
  product, 
  onSave, 
  onShare, 
  onContact 
}: { 
  product: any; 
  onSave: () => void; 
  onShare: () => void; 
  onContact: () => void; 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div
      layout
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden touch-manipulation"
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        
        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={onSave}
            className="touch-button w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={onShare}
            className="touch-button w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        
        {/* Condition Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
            {product.condition}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">
            {product.price}
          </span>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {product.location}
            </span>
          </div>
        </div>
        
        {/* Seller Info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{product.seller}</span>
              {product.verified && <Verified className="w-4 h-4 text-green-500" />}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {product.rating}
              </span>
            </div>
          </div>
        </div>
        
        {/* Expandable Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  {product.brand}
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  {product.year}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium touch-button"
          >
            {isExpanded ? 'أقل' : 'المزيد'}
          </button>
          <button
            onClick={onContact}
            className="flex-1 py-2 px-3 bg-green-500 text-white rounded-lg text-sm font-medium touch-button flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تواصل</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}