'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile, useUserEquipment, useCategories, useStats } from '@/hooks/useSupabase'
import { 
  User, Settings, Plus, Package, BarChart3, MessageCircle, 
  Heart, Star, Tractor, ArrowLeft, Edit3, Trash2, Eye,
  MapPin, Calendar, DollarSign, Phone, Mail, Globe
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { profile } = useProfile()
  const { equipment, deleteEquipment } = useUserEquipment()
  const { stats } = useStats()

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  const handleDeleteEquipment = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const { error } = await deleteEquipment(id)
      if (error) {
        console.error('Error deleting equipment:', error)
      }
    }
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-red-500 hover:text-red-600 transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile?.full_name || 'المستخدم'}</h2>
              <p className="text-gray-600">{profile?.user_type === 'farmer' ? 'مزارع' : profile?.user_type === 'buyer' ? 'مشتري' : 'مزارع وتاجر'}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <Package className="w-8 h-8 text-emerald-600" />
              <div>
                <h3 className="text-lg font-semibold">المنتجات</h3>
                <p className="text-2xl font-bold">{equipment?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <Star className="w-8 h-8 text-emerald-600" />
              <div>
                <h3 className="text-lg font-semibold">التقييمات</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <MessageCircle className="w-8 h-8 text-emerald-600" />
              <div>
                <h3 className="text-lg font-semibold">الرسائل</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">المنتجات المعروضة</h2>
            <Link
              href="/equipment/new"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة منتج
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment?.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteEquipment(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/equipment/${item.id}/edit`}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  {item.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
