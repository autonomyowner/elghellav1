'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { ProfileInsert } from '@/types/database.types'
import { 
  Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, User, Phone, MapPin,
  Tractor, Shield, Users, Zap, CheckCircle, Star, UserCheck, 
  MessageCircle, Globe, Award, TrendingUp, Clock
} from 'lucide-react'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    location: '',
    userType: 'farmer' as 'farmer' | 'buyer' | 'both'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('يرجى ملء جميع الحقول المطلوبة')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صحيح')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('يرجى إدخال كلمة المرور وتأكيدها')
      return false
    }
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور غير متطابقة')
      return false
    }
    return true
  }

  const handleNextStep = () => {
    setError('')
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            location: formData.location,
            user_type: formData.userType,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // Create profile
        const profileData: ProfileInsert = {
          id: data.user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          location: formData.location,
          user_type: formData.userType,
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData])

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        setMessage('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني للتأكيد.')
        
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const userTypes = [
    {
      id: 'farmer',
      name: 'مزارع',
      description: 'أبيع المنتجات الزراعية والمعدات',
      icon: <Tractor className="w-8 h-8" />,
      color: 'green'
    },
    {
      id: 'buyer',
      name: 'مشتري',
      description: 'أشتري المنتجات والمعدات الزراعية',
      icon: <Users className="w-8 h-8" />,
      color: 'blue'
    },
    {
      id: 'both',
      name: 'مزارع وتاجر',
      description: 'أبيع وأشتري المنتجات والمعدات الزراعية',
      icon: <Award className="w-8 h-8" />,
      color: 'orange'
    }
  ]

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "حماية كاملة",
      description: "بياناتك آمنة معنا"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "استجابة سريعة",
      description: "دعم فوري ومتابعة"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "نمو مضمون",
      description: "زيادة أرباحك ومبيعاتك"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "متاح 24/7",
      description: "خدمة على مدار الساعة"
    }
  ]

  const stats = [
    { number: "10,000+", label: "مزارع مسجل" },
    { number: "50,000+", label: "معدة متاحة" },
    { number: "48", label: "ولاية مغطاة" },
    { number: "95%", label: "رضا العملاء" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(29,231,130,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)]"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              opacity: 0
            }}
            animate={{
              y: [null, -150, -300],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
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
        <div className="grid lg:grid-cols-2 gap-12 items-start min-h-[calc(100vh-200px)]">
          
          {/* Left Side - Signup Form */}
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
                انضم إلى الغلة
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-green-200"
              >
                أنشئ حسابك وابدأ رحلتك الزراعية
              </motion.p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    currentStep >= step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/20 text-white/60'
                  }`}>
                    {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 mx-2 transition-all ${
                      currentStep > step ? 'bg-green-500' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Success Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-200 text-center"
              >
                <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                {message}
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Signup Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-8 rounded-2xl border border-green-500/30"
            >
              <form onSubmit={handleSignup} className="space-y-6">
                
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">المعلومات الأساسية</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-2">
                        الاسم الكامل *
                      </label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                          className="w-full pr-12 pl-4 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-2">
                        البريد الإلكتروني *
                      </label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                          className="w-full pr-12 pl-4 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                          required
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-2">
                        رقم الهاتف *
                      </label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="07xxxxxxxx"
                          className="w-full pr-12 pl-4 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                          required
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-2">
                        الموقع
                      </label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="المدينة، الولاية"
                          className="w-full pr-12 pl-4 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleNextStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold text-lg transition-all flex items-center justify-center gap-2"
                    >
                      التالي
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2: Password */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">كلمة المرور</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-2">
                        كلمة المرور *
                      </label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="كلمة مرور قوية"
                          className="w-full pr-12 pl-12 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                          required
                          minLength={6}
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

                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-2">
                        تأكيد كلمة المرور *
                      </label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="أعد كتابة كلمة المرور"
                          className="w-full pr-12 pl-12 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-green-400 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 bg-white/20 text-white rounded-xl hover:bg-white/30 font-bold text-lg transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        السابق
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={handleNextStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold text-lg transition-all flex items-center justify-center gap-2"
                      >
                        التالي
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: User Type */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">نوع الحساب</h3>
                    
                    <div className="space-y-3">
                      {userTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, userType: type.id as any }))}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-right ${
                            formData.userType === type.id
                              ? 'border-green-400 bg-green-500/20'
                              : 'border-white/20 bg-black/30 hover:border-green-400/50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              formData.userType === type.id ? 'bg-green-500' : 'bg-white/20'
                            }`}>
                              {type.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{type.name}</h4>
                              <p className="text-white/70 text-sm">{type.description}</p>
                            </div>
                            {formData.userType === type.id && (
                              <CheckCircle className="w-6 h-6 text-green-400" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 bg-white/20 text-white rounded-xl hover:bg-white/30 font-bold text-lg transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        السابق
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            جاري إنشاء الحساب...
                          </>
                        ) : (
                          <>
                            إنشاء الحساب
                            <UserCheck className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8 glass p-6 rounded-2xl border border-green-500/30"
            >
              <p className="text-white/80 mb-4">
                لديك حساب بالفعل؟
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-green-100 border border-white/30 rounded-xl hover:bg-white/30 font-medium transition-all"
              >
                تسجيل الدخول
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Benefits & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block space-y-8"
          >
            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                مزايا الانضمام لنا
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="glass p-6 rounded-xl border border-green-500/30 text-center hover:border-green-400/50 transition-all"
                  >
                    <div className="text-green-400 mb-4 flex justify-center">
                      {benefit.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-white/70 text-sm">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="glass p-8 rounded-xl border border-green-500/30">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                أرقام تتحدث عن نفسها
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-green-400 mb-2">{stat.number}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass p-6 rounded-xl border border-green-500/30"
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