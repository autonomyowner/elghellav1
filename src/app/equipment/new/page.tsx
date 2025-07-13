'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { EquipmentInsert } from '@/types/database.types'

export default function EquipmentForm() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'good' as const,
    location: '',
    brand: '',
    model: '',
    year: '',
    hours_used: '',
  })
  
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 5) {
      setError('يمكنك تحميل حتى 5 صور فقط')
      return
    }
    setFiles(selectedFiles)
    setError(null)
  }

  const uploadImages = async (): Promise<string[]> => {
    if (!files || files.length === 0) return []

    const imageUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`الصورة ${file.name} كبيرة جداً. الحد الأقصى 5 ميجابايت`)
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error(`${file.name} ليس ملف صورة صالح`)
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `equipment/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('equipment-images')
        .upload(filePath, file)

      if (uploadError) {
        throw new Error(`فشل في تحميل الصورة: ${uploadError.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from('equipment-images')
        .getPublicUrl(filePath)

      imageUrls.push(publicUrlData.publicUrl)
    }

    return imageUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('يجب تسجيل الدخول لإضافة معدات')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Upload images first
      const imageUrls = await uploadImages()

      // Prepare equipment data
      const equipmentData: EquipmentInsert = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        condition: formData.condition,
        location: formData.location,
        brand: formData.brand || null,
        model: formData.model || null,
        year: formData.year ? parseInt(formData.year) : null,
        hours_used: formData.hours_used ? parseInt(formData.hours_used) : null,
        images: imageUrls,
        category_id: 'default', // You'll need to implement category selection
        currency: 'DZD',
        is_available: true,
        is_featured: false,
        seller_name: profile?.full_name || null,
        seller_phone: profile?.phone || null,
        seller_location: profile?.location || null,
      }

      const { error: insertError } = await supabase
        .from('equipment')
        .insert([equipmentData])

      if (insertError) {
        throw new Error(insertError.message)
      }

      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error creating equipment:', error)
      setError((error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">يجب تسجيل الدخول أولاً</h1>
        <button
          onClick={() => router.push('/auth/login')}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md hover:from-green-500 hover:to-green-400 transition"
        >
          تسجيل الدخول
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8">إضافة معدات زراعية جديدة</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-md text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
                عنوان الإعلان *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="مثال: جرار زراعي جون دير 5000 - حالة ممتازة"
              />
            </div>

            {/* Price and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-200 mb-2">
                  السعر (دينار جزائري) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-200 mb-2">
                  حالة المعدات *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="new">جديد</option>
                  <option value="excellent">ممتاز</option>
                  <option value="good">جيد</option>
                  <option value="fair">مقبول</option>
                  <option value="poor">يحتاج صيانة</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-200 mb-2">
                الموقع *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="المدينة، المحافظة"
              />
            </div>

            {/* Brand, Model, Year */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-200 mb-2">
                  الماركة
                </label>
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="جون دير، ماسي فيرغسون..."
                />
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-200 mb-2">
                  الموديل
                </label>
                <input
                  id="model"
                  name="model"
                  type="text"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="5000، M135..."
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-200 mb-2">
                  سنة الصنع
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="2020"
                />
              </div>
            </div>

            {/* Hours Used */}
            <div>
              <label htmlFor="hours_used" className="block text-sm font-medium text-gray-200 mb-2">
                عدد ساعات الاستخدام
              </label>
              <input
                id="hours_used"
                name="hours_used"
                type="number"
                value={formData.hours_used}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="500"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
                وصف المعدات *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="اكتب وصفاً تفصيلياً للمعدات، الميزات، المواصفات، وأي معلومات مهمة أخرى..."
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                صور المعدات * (حتى 5 صور)
              </label>
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                  required
                />
                <div className="text-4xl text-gray-500 mb-2">📷</div>
                <p className="text-gray-400 mb-1">اضغط لاختيار الصور أو اسحبها هنا</p>
                <p className="text-sm text-gray-500">
                  الحد الأقصى: 5 صور، كل صورة حتى 5 ميجابايت
                </p>
                {files && files.length > 0 && (
                  <p className="mt-2 text-green-400">
                    تم اختيار {files.length} صورة
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 text-white rounded-md transition-all duration-300 flex items-center gap-2 font-medium"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري النشر...
                  </>
                ) : (
                  <>
                    <span>نشر الإعلان</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
