'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { Equipment, Profile, Category } from '@/types/database.types'

// Profile hook
export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const targetUserId = userId || user?.id

  useEffect(() => {
    async function fetchProfile() {
      if (!targetUserId) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetUserId)
          .single()

        if (error) throw error
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Profile not found')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [targetUserId])

  return { profile, loading, error }
}

// Categories hook
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true })

        if (error) throw error
        setCategories(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

// User Equipment hook
export function useUserEquipment(userId?: string) {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const targetUserId = userId || user?.id

  useEffect(() => {
    async function fetchUserEquipment() {
      if (!targetUserId) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('equipment')
          .select(`
            *,
            categories!equipment_category_id_fkey(name, name_ar, icon)
          `)
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setEquipment(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch equipment')
      } finally {
        setLoading(false)
      }
    }

    fetchUserEquipment()
  }, [targetUserId])

  const deleteEquipment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id)
        .eq('user_id', targetUserId)

      if (error) throw error
      setEquipment(prev => prev.filter(item => item.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete equipment' }
    }
  }

  return { equipment, loading, error, deleteEquipment }
}

// Stats hook
export function useStats() {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    totalUsers: 0,
    categoryStats: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        
        const [equipmentCount, userCount] = await Promise.all([
          supabase.from('equipment').select('id', { count: 'exact' }),
          supabase.from('profiles').select('id', { count: 'exact' })
        ])

        setStats({
          totalEquipment: equipmentCount.count || 0,
          totalUsers: userCount.count || 0,
          categoryStats: []
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}