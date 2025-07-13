// Supabase hooks for the Elghella marketplace
// This file contains all the custom hooks for interacting with Supabase

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { Equipment, Profile, Category } from '@/types/database.types'

export function useEquipment(filters?: {
  category?: string
  location?: string
  priceMin?: number
  priceMax?: number
  condition?: string
  brand?: string
  search?: string
  limit?: number
}) {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEquipment() {
      try {
        setLoading(true)
        let query = supabase
          .from('equipment')
          .select(`
            *,
            profiles!equipment_user_id_fkey(full_name, avatar_url, is_verified),
            categories!equipment_category_id_fkey(name, name_ar, icon)
          `)
          .eq('is_available', true)
          .order('created_at', { ascending: false })

        if (filters?.category) {
          query = query.eq('category_id', filters.category)
        }

        if (filters?.location) {
          query = query.ilike('location', `%${filters.location}%`)
        }

        if (filters?.priceMin) {
          query = query.gte('price', filters.priceMin)
        }

        if (filters?.priceMax) {
          query = query.lte('price', filters.priceMax)
        }

        if (filters?.condition) {
          query = query.eq('condition', filters.condition)
        }

        if (filters?.brand) {
          query = query.ilike('brand', `%${filters.brand}%`)
        }

        if (filters?.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
        }

        if (filters?.limit) {
          query = query.limit(filters.limit)
        }

        const { data, error } = await query

        if (error) throw error
        setEquipment(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchEquipment()
  }, [filters])

  const refetch = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('equipment')
        .select(`
          *,
          profiles!equipment_user_id_fkey(full_name, avatar_url, is_verified),
          categories!equipment_category_id_fkey(name, name_ar, icon)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false })

      if (filters?.category) {
        query = query.eq('category_id', filters.category)
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters?.priceMin) {
        query = query.gte('price', filters.priceMin)
      }

      if (filters?.priceMax) {
        query = query.lte('price', filters.priceMax)
      }

      if (filters?.condition) {
        query = query.eq('condition', filters.condition)
      }

      if (filters?.brand) {
        query = query.ilike('brand', `%${filters.brand}%`)
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) throw error
      setEquipment(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { equipment, loading, error, refetch }
}

export function useEquipmentById(id: string) {
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEquipment() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('equipment')
          .select(`
            *,
            profiles!equipment_user_id_fkey(full_name, avatar_url, phone, location, is_verified),
            categories!equipment_category_id_fkey(name, name_ar, icon)
          `)
          .eq('id', id)
          .single()

        if (error) throw error
        setEquipment(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Equipment not found')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchEquipment()
    }
  }, [id])

  return { equipment, loading, error }
}

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

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!targetUserId) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', targetUserId)
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Update failed' }
    }
  }

  return { profile, loading, error, updateProfile }
}

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

  const createEquipment = async (equipmentData: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>) => {
    if (!targetUserId) return { data: null, error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('equipment')
        .insert([{ ...equipmentData, user_id: targetUserId }])
        .select()
        .single()

      if (error) throw error
      setEquipment(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to create equipment' }
    }
  }

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .update(updates)
        .eq('id', id)
        .eq('user_id', targetUserId)
        .select()
        .single()

      if (error) throw error
      setEquipment(prev => prev.map(item => item.id === id ? data : item))
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update equipment' }
    }
  }

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

  return { 
    equipment, 
    loading, 
    error, 
    createEquipment, 
    updateEquipment, 
    deleteEquipment 
  }
}

export function useSearch(query: string, limit = 10) {
  const [results, setResults] = useState<Equipment[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      setSuggestions([])
      return
    }

    async function search() {
      try {
        setLoading(true)
        
        // Search equipment
        const { data: equipmentData, error: equipmentError } = await supabase
          .from('equipment')
          .select(`
            *,
            profiles!equipment_user_id_fkey(full_name, avatar_url),
            categories!equipment_category_id_fkey(name, name_ar, icon)
          `)
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%`)
          .eq('is_available', true)
          .limit(limit)

        if (equipmentError) throw equipmentError
        setResults(equipmentData || [])

        // Get suggestions
        const { data: suggestionData } = await supabase
          .from('equipment')
          .select('title, brand, model')
          .or(`title.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%`)
          .limit(5)

        if (suggestionData) {
          const suggestionSet = new Set<string>()
          
          suggestionData.forEach((item: any) => {
            if (item.title?.toLowerCase().includes(query.toLowerCase())) {
              suggestionSet.add(item.title)
            }
            if (item.brand?.toLowerCase().includes(query.toLowerCase())) {
              suggestionSet.add(item.brand)
            }
            if (item.model?.toLowerCase().includes(query.toLowerCase())) {
              suggestionSet.add(item.model)
            }
          })

          setSuggestions(Array.from(suggestionSet).slice(0, 5))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(search, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, limit])

  return { results, suggestions, loading, error }
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadEquipmentImage = async (file: File, equipmentId: string, userId: string) => {
    try {
      setUploading(true)
      setError(null)

      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${equipmentId}/${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('equipment-images')
        .upload(fileName, file)

      if (error) throw error

      const { data: publicUrl } = supabase.storage
        .from('equipment-images')
        .getPublicUrl(fileName)

      return { url: publicUrl.publicUrl, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      return { url: null, error: errorMessage }
    } finally {
      setUploading(false)
    }
  }

  const uploadAvatar = async (file: File, userId: string) => {
    try {
      setUploading(true)
      setError(null)

      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/avatar.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (error) throw error

      const { data: publicUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      return { url: publicUrl.publicUrl, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      return { url: null, error: errorMessage }
    } finally {
      setUploading(false)
    }
  }

  return { uploadEquipmentImage, uploadAvatar, uploading, error }
}

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