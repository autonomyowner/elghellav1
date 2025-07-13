'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Equipment } from '@/types/database.types'

interface EquipmentCardProps {
  equipment: Equipment
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
  const {
    id,
    title,
    price,
    location,
    images,
    condition,
    brand,
    model,
    year,
    currency = 'DZD',
    is_available,
    seller_name,
    seller_phone,
    seller_location
  } = equipment

  // Format price as currency
  const formattedPrice = new Intl.NumberFormat('ar-DZ', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price)

  // Condition translation
  const conditionMap: Record<string, string> = {
    'new': 'جديد',
    'excellent': 'ممتاز',
    'good': 'جيد',
    'fair': 'مقبول',
    'poor': 'يحتاج صيانة'
  }

  return (
    <Link href={`/equipment/${id}`}>
      <div className="group flex flex-col h-full overflow-hidden rounded-xl border border-green-500/30 transition-all hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/20 bg-black/50 backdrop-blur-md">
        <div className="relative aspect-video overflow-hidden">
          {images && images.length > 0 ? (
            <Image
              src={images[0]}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
              <span className="text-neutral-600 text-4xl">🚜</span>
            </div>
          )}
          
          {/* Condition Badge */}
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md">
            {conditionMap[condition] || condition}
          </div>
          
          {/* Availability Badge */}
          {!is_available && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
              غير متاح
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow p-4">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{title}</h3>

          {/* Seller Info */}
          {(seller_name || seller_phone || seller_location) && (
            <div className="mb-2 text-xs text-green-300">
              {seller_name && <div>البائع: {seller_name}</div>}
              {seller_phone && <div>الهاتف: {seller_phone}</div>}
              {seller_location && <div>موقع البائع: {seller_location}</div>}
            </div>
          )}

          <div className="flex flex-col mt-auto pt-2">
            {/* Brand, Model, Year */}
            {(brand || model || year) && (
              <div className="flex items-center text-sm text-neutral-400 mb-2">
                <span>{[brand, model, year].filter(Boolean).join(' • ')}</span>
              </div>
            )}

            {/* Location */}
            <div className="flex items-center text-sm text-neutral-400 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{location}</span>
            </div>

            {/* Price and Action */}
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-green-500">{formattedPrice}</span>
              <div className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-md group-hover:bg-green-500/30 transition-colors">
                عرض التفاصيل
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
