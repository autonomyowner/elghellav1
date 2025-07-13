'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, 
  Tractor, Shield, Users, Zap, CheckCircle, Star,
  Phone, MessageCircle, Globe
} from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const { signIn } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
    
    setIsLoading(false)
  }

  const features = [
    {
      icon: <Tractor className="w-8 h-8" />,
      title: "معدات متنوعة",
      description: "آلاف المعدات الزراعية المتاحة"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "معاملات آمنة",
      description: "حماية كاملة لبياناتك ومعاملاتك"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "مجتمع نشط",
      description: "تواصل مع آلاف المزارعين"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "استجابة سريعة",
      description: "دعم فوري ومتابعة مستمرة"
    }
  ]

  const testimonials = [
    {
      name: "أحمد بن محمد",
      location: "البليدة",
      rating: 5,
      text: "منصة رائعة ساعدتني في العثور على أفضل المعدات الزراعية"
    },
    {
      name: "فاطمة العربي",
      location: "سطيف",
      rating: 5,
      text: "خدمة ممتازة وأسعار معقولة، أنصح بها كل المزارعين"
    },
    {
      name: "محمد الصالح",
      location: "قسنطينة",
      rating: 5,
      text: "تجربة مميزة في بيع وشراء المعدات الزراعية"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(29,231,130,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)]"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400/20 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              opacity: 0
            }}
            animate={{
              y: [null, -100, -200],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-green-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
          <div className="flex items-center gap-2">
            <Tractor className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">الغلة</span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          
          {/* Left Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md mx-auto lg:mx-0"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-white mb-4"
              >
                مرحباً بك مرة أخرى
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-green-200"
              >
                سجل دخولك للوصول إلى حسابك
              </motion.p>
            </div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-8 rounded-2xl border border-green-500/30"
            >
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-green-300 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="أدخل بريدك الإلكتروني"
                      className="w-full pr-12 pl-4 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-green-300 mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور"
                      className="w-full pr-12 pl-12 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-green-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    <>
                      تسجيل الدخول
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Forgot Password */}
                <div className="text-center">
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-sm text-green-300 hover:text-green-400 transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              </form>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8 glass p-6 rounded-2xl border border-green-500/30"
            >
              <p className="text-white/80 mb-4">
                ليس لديك حساب؟
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-green-100 border border-white/30 rounded-xl hover:bg-white/30 font-medium transition-all"
              >
                إنشاء حساب جديد
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Features & Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            {/* Features */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                لماذا تختار الغلة؟
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="glass p-6 rounded-xl border border-green-500/30 text-center hover:border-green-400/50 transition-all"
                  >
                    <div className="text-green-400 mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                آراء عملائنا
              </h2>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="glass p-4 rounded-xl border border-green-500/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-white font-medium">{testimonial.name}</h4>
                        <p className="text-green-300 text-sm">{testimonial.location}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-white/80 text-sm">{testimonial.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 glass p-6 rounded-xl border border-green-500/30"
            >
              <h3 className="text-white font-semibold mb-4 text-center">تواصل معنا</h3>
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2 text-green-300">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+213 XXX XXX XXX</span>
                </div>
                <div className="flex items-center gap-2 text-green-300">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">واتساب</span>
                </div>
                <div className="flex items-center gap-2 text-green-300">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">elghella.dz</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
