import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

interface PageProps {
  params: {
    id: string
  }
}

export default async function EquipmentDetailPage({ params: { id } }: PageProps) {
  const supabase = createClient()

  const { data: equipment } = await supabase
    .from('equipment')
    .select('*')
    .eq('id', id)
    .single()

  if (!equipment) {
    notFound()
  }

  // Format price as currency
  const formattedPrice = new Intl.NumberFormat('ar-JO', {
    style: 'currency',
    currency: equipment.currency || 'JOD',
    maximumFractionDigits: 0,
  }).format(equipment.price)

  // Condition translation
  const conditionMap: Record<string, string> = {
    'new': 'جديد',
    'excellent': 'ممتاز',
    'good': 'جيد',
    'fair': 'مقبول',
    'poor': 'يحتاج صيانة'
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image gallery */}
        <div className="lg:col-span-2">
          <div className="bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl overflow-hidden">
            {equipment.images && equipment.images.length > 0 ? (
              <div className="aspect-video relative">
                <Image
                  src={equipment.images[0]}
                  alt={equipment.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-video bg-neutral-900 flex items-center justify-center">
                <span className="text-neutral-600 text-6xl">🚜</span>
              </div>
            )}

            {equipment.images && equipment.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-4">
                {equipment.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square relative rounded-md overflow-hidden">
                    <Image
                      src={image}
                      alt={`${equipment.title} - صورة ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">وصف المعدات</h2>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {equipment.description}
            </p>
          </div>
        </div>

        {/* Equipment details */}
        <div className="space-y-6">
          <div className="bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl p-6">
            <h1 className="text-2xl font-bold text-white mb-3">{equipment.title}</h1>
            <div className="text-3xl font-bold text-green-500 mb-6">{formattedPrice}</div>

            <div className="space-y-4 border-t border-gray-700 pt-6">
              <div className="flex justify-between">
                <span className="text-gray-400">الحالة</span>
                <span className="text-white font-medium">
                  {conditionMap[equipment.condition] || equipment.condition}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">الموقع</span>
                <span className="text-white">{equipment.location}</span>
              </div>

              {equipment.brand && (
                <div className="flex justify-between">
                  <span className="text-gray-400">الماركة</span>
                  <span className="text-white">{equipment.brand}</span>
                </div>
              )}

              {equipment.model && (
                <div className="flex justify-between">
                  <span className="text-gray-400">الموديل</span>
                  <span className="text-white">{equipment.model}</span>
                </div>
              )}

              {equipment.year && (
                <div className="flex justify-between">
                  <span className="text-gray-400">سنة الصنع</span>
                  <span className="text-white">{equipment.year}</span>
                </div>
              )}

              {equipment.hours_used && (
                <div className="flex justify-between">
                  <span className="text-gray-400">ساعات الاستخدام</span>
                  <span className="text-white">{equipment.hours_used.toLocaleString()} ساعة</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-400">تاريخ النشر</span>
                <span className="text-white">
                  {new Date(equipment.created_at).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
          </div>

          {/* Seller information */}
          {(equipment.seller_name || equipment.seller_phone || equipment.seller_location) && (
            <div className="bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">معلومات البائع</h2>
              {equipment.seller_name && (
                <div className="mb-2 text-green-300">البائع: {equipment.seller_name}</div>
              )}
              {equipment.seller_phone && (
                <div className="mb-2 text-green-300">الهاتف: {equipment.seller_phone}</div>
              )}
              {equipment.seller_location && (
                <div className="mb-2 text-green-300">موقع البائع: {equipment.seller_location}</div>
              )}
            </div>
          )}

          <div className="flex justify-center">
            <Link
              href="/equipment"
              className="text-green-400 hover:text-green-300 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              العودة إلى قائمة المعدات
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
