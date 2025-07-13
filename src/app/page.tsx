"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  LucideUsers, LucideTractor, LucideGift, LucideGlobe, LucideTruck, 
  LucideLeaf, LucideBarChart, LucideFileText, Menu, X, Loader2, 
  ChevronRight, Star, Search, MapPin, Shield, Award, TrendingUp,
  Users, Package, Zap, Clock, Phone, Mail, ArrowRight, Play,
  CheckCircle, Heart, MessageCircle, Filter, SortAsc
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Enhanced services for Algerian agriculture
const services = [
  { 
    icon: <LucideTractor size={32} />, 
    label: "معدات زراعية حديثة", 
    description: "أحدث الآلات والمعدات الزراعية المتطورة",
    color: "emerald"
  },
  { 
    icon: <LucideLeaf size={32} />, 
    label: "منتجات طازجة وعضوية", 
    description: "خضروات وفواكه طازجة مباشرة من المزارع",
    color: "green"
  },
  { 
    icon: <LucideGlobe size={32} />, 
    label: "تصدير عالمي", 
    description: "خدمات تصدير المنتجات الزراعية للأسواق العالمية",
    color: "blue"
  },
  { 
    icon: <LucideTruck size={32} />, 
    label: "توصيل سريع", 
    description: "شبكة توصيل متطورة تغطي جميع الولايات",
    color: "orange"
  },
  { 
    icon: <LucideUsers size={32} />, 
    label: "دعم المزارعين", 
    description: "استشارات ودعم فني للمزارعين الجزائريين",
    color: "purple"
  },
  { 
    icon: <LucideBarChart size={32} />, 
    label: "تحليل السوق", 
    description: "دراسات وتحليلات السوق الزراعي الجزائري",
    color: "indigo"
  },
  { 
    icon: <LucideGift size={32} />, 
    label: "عروض خاصة", 
    description: "عروض وخصومات حصرية للمزارعين",
    color: "pink"
  },
  { 
    icon: <LucideFileText size={32} />, 
    label: "استشارات زراعية", 
    description: "خدمات استشارية متخصصة في الزراعة",
    color: "yellow"
  },
];

// Statistics for credibility
const stats = [
  { number: "10,000+", label: "مزارع مسجل", icon: <Users size={24} /> },
  { number: "50,000+", label: "منتج متاح", icon: <Package size={24} /> },
  { number: "48 ولاية", label: "تغطية كاملة", icon: <MapPin size={24} /> },
  { number: "99.9%", label: "معدل الرضا", icon: <Star size={24} /> },
];

// Featured categories
const categories = [
  { name: "معدات زراعية", name_ar: "معدات زراعية", icon: "🚜", count: "2,500+" },
  { name: "بذور ونباتات", name_ar: "بذور ونباتات", icon: "🌱", count: "1,800+" },
  { name: "أسمدة ومبيدات", name_ar: "أسمدة ومبيدات", icon: "🧪", count: "900+" },
  { name: "أراضي زراعية", name_ar: "أراضي زراعية", icon: "🌾", count: "650+" },
  { name: "منتجات طازجة", name_ar: "منتجات طازجة", icon: "🥕", count: "3,200+" },
  { name: "حيوانات المزرعة", name_ar: "حيوانات المزرعة", icon: "🐄", count: "1,100+" },
];

// Navigation links
const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/listings", label: "المنتجات" },
  { href: "/categories", label: "الفئات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "اتصل بنا" },
];

// Floating particles component
const FloatingParticles = () => {
  const [positions, setPositions] = useState<{x: number, y: number}[]>([]);
  useEffect(() => {
    // Generate stable random positions on client only
    const arr = Array.from({ length: 15 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setPositions(arr);
  }, []);
  if (positions.length === 0) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
          style={{ left: pos.x, top: pos.y }}
          animate={{
            y: [0, -100, -200],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Loading Button
const LoadingButton = ({ 
  children, 
  onClick, 
  loading = false, 
  className = "", 
  variant = "primary",
  ...props 
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  [key: string]: any;
}) => {
  const baseClasses = "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 focus:ring-emerald-500 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white focus:ring-emerald-500"
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(baseClasses, variants[variant], className)}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
};

// Search component
const HeroSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن منتجات زراعية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/90 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/90 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 appearance-none"
            >
              <option value="">جميع الولايات</option>
              <option value="algiers">الجزائر العاصمة</option>
              <option value="oran">وهران</option>
              <option value="constantine">قسنطينة</option>
              <option value="blida">البليدة</option>
              <option value="setif">سطيف</option>
              <option value="annaba">عنابة</option>
            </select>
          </div>
          <LoadingButton className="w-full">
            <Search className="w-4 h-4 mr-2" />
            بحث
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 10]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoginLoading(false);
      setIsLoginOpen(false);
    }, 2000);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsLoginOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white overflow-hidden">
      <FloatingParticles />
      
      {/* Enhanced Header */}
      <motion.header 
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{ 
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`,
        }}
      >
        <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                  <LucideLeaf className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                    الغلة الجزائرية
                  </h1>
                  <p className="text-xs text-gray-300">السوق الزراعي الأول</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
                <LoadingButton 
                  variant="outline" 
                  onClick={() => setIsLoginOpen(true)}
                  className="px-4 py-2 text-sm"
                >
                  تسجيل الدخول
                </LoadingButton>
                <LoadingButton className="px-4 py-2 text-sm">
                  <Link href="/listings/new">
                    أضف منتجك
                  </Link>
                </LoadingButton>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 md:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                  <LoadingButton 
                    variant="outline" 
                    onClick={() => setIsLoginOpen(true)}
                    className="w-full"
                  >
                    تسجيل الدخول
                  </LoadingButton>
                  <LoadingButton className="w-full">
                    <Link href="/listings/new">
                      أضف منتجك
                    </Link>
                  </LoadingButton>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                السوق الزراعي الأول في{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  الجزائر
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                منصة شاملة تربط المزارعين والمشترين والموردين في سوق زراعي متطور وآمن
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <HeroSearch />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <LoadingButton className="px-8 py-4 text-lg">
                <Link href="/listings" className="flex items-center">
                  تصفح المنتجات
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Link>
              </LoadingButton>
              <LoadingButton variant="outline" className="px-8 py-4 text-lg">
                <Play className="w-5 h-5 ml-2" />
                شاهد الفيديو التعريفي
              </LoadingButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              الفئات الرئيسية
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              اكتشف مجموعة واسعة من المنتجات والخدمات الزراعية
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer group border border-white/10"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-semibold mb-2 text-white">{category.name_ar}</h3>
                <p className="text-emerald-400 text-sm">{category.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              خدماتنا المتميزة
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              نقدم حلولاً شاملة لجميع احتياجاتك الزراعية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer group border border-white/10"
              >
                <div className={`w-16 h-16 bg-${service.color}-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="font-semibold mb-2 text-white">{service.label}</h3>
                <p className="text-gray-300 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 backdrop-blur-md rounded-2xl p-8 md:p-12 text-center border border-emerald-500/30"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              انضم إلى أكبر سوق زراعي في الجزائر
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              ابدأ رحلتك في التجارة الزراعية الرقمية واكتشف فرص جديدة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LoadingButton className="px-8 py-4 text-lg">
                <Link href="/auth/signup">
                  سجل كمزارع
                </Link>
              </LoadingButton>
              <LoadingButton variant="outline" className="px-8 py-4 text-lg">
                <Link href="/auth/signup">
                  سجل كمشتري
                </Link>
              </LoadingButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                  <LucideLeaf className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold">الغلة الجزائرية</h3>
              </div>
              <p className="text-gray-300 text-sm">
                السوق الزراعي الرقمي الأول في الجزائر
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/about" className="hover:text-emerald-400">من نحن</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-400">اتصل بنا</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-400">سياسة الخصوصية</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-400">شروط الاستخدام</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">الفئات</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/categories/equipment" className="hover:text-emerald-400">معدات زراعية</Link></li>
                <li><Link href="/categories/seeds" className="hover:text-emerald-400">بذور ونباتات</Link></li>
                <li><Link href="/categories/land" className="hover:text-emerald-400">أراضي زراعية</Link></li>
                <li><Link href="/categories/products" className="hover:text-emerald-400">منتجات طازجة</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">تواصل معنا</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Phone className="w-4 h-4" />
                  <span>+213 123 456 789</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Mail className="w-4 h-4" />
                  <span>info@elghella.dz</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <MapPin className="w-4 h-4" />
                  <span>الجزائر العاصمة، الجزائر</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-300 text-sm">
            <p>&copy; 2024 الغلة الجزائرية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsLoginOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">تسجيل الدخول</h2>
                <button
                  onClick={() => setIsLoginOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">كلمة المرور</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="أدخل كلمة المرور"
                  />
                </div>
                <LoadingButton
                  type="submit"
                  loading={loginLoading}
                  className="w-full py-3"
                >
                  تسجيل الدخول
                </LoadingButton>
              </form>
              <div className="mt-6 text-center">
                <p className="text-gray-300">
                  ليس لديك حساب؟{" "}
                  <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300">
                    سجل الآن
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
