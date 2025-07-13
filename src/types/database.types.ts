export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          phone: string | null
          location: string | null
          avatar_url: string | null
          user_type: 'farmer' | 'buyer' | 'both'
          is_verified: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          phone?: string | null
          location?: string | null
          avatar_url?: string | null
          user_type?: 'farmer' | 'buyer' | 'both'
          is_verified?: boolean
        }
        Update: {
          updated_at?: string
          full_name?: string | null
          phone?: string | null
          location?: string | null
          avatar_url?: string | null
          user_type?: 'farmer' | 'buyer' | 'both'
          is_verified?: boolean
        }
        Relationships: []
      }
      equipment: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string | null
          price: number
          currency: string
          category_id: string
          condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor'
          year: number | null
          brand: string | null
          model: string | null
          hours_used: number | null
          location: string
          images: string[]
          is_available: boolean
          is_featured: boolean
          seller_name: string | null
          seller_phone: string | null
          seller_location: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          description?: string | null
          price: number
          currency?: string
          category_id: string
          condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor'
          year?: number | null
          brand?: string | null
          model?: string | null
          hours_used?: number | null
          location: string
          images?: string[]
          is_available?: boolean
          is_featured?: boolean
          seller_name?: string | null
          seller_phone?: string | null
          seller_location?: string | null
        }
        Update: {
          updated_at?: string
          title?: string
          description?: string | null
          price?: number
          currency?: string
          category_id?: string
          condition?: 'new' | 'excellent' | 'good' | 'fair' | 'poor'
          year?: number | null
          brand?: string | null
          model?: string | null
          hours_used?: number | null
          location?: string
          images?: string[]
          is_available?: boolean
          is_featured?: boolean
          seller_name?: string | null
          seller_phone?: string | null
          seller_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      land_listings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string | null
          price: number
          currency: string
          listing_type: 'sale' | 'rent'
          area_size: number
          area_unit: 'hectare' | 'acre' | 'dunum'
          location: string
          coordinates: Json | null
          soil_type: string | null
          water_source: string | null
          images: string[]
          is_available: boolean
          is_featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          description?: string | null
          price: number
          currency?: string
          listing_type: 'sale' | 'rent'
          area_size: number
          area_unit?: 'hectare' | 'acre' | 'dunum'
          location: string
          coordinates?: Json | null
          soil_type?: string | null
          water_source?: string | null
          images?: string[]
          is_available?: boolean
          is_featured?: boolean
        }
        Update: {
          updated_at?: string
          title?: string
          description?: string | null
          price?: number
          currency?: string
          listing_type?: 'sale' | 'rent'
          area_size?: number
          area_unit?: 'hectare' | 'acre' | 'dunum'
          location?: string
          coordinates?: Json | null
          soil_type?: string | null
          water_source?: string | null
          images?: string[]
          is_available?: boolean
          is_featured?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "land_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          created_at: string
          name: string
          name_ar: string
          description: string | null
          icon: string
          parent_id: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          name_ar: string
          description?: string | null
          icon: string
          parent_id?: string | null
          sort_order?: number
        }
        Update: {
          name?: string
          name_ar?: string
          description?: string | null
          icon?: string
          parent_id?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          name: string | null
          price: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          price?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          price?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers for easier use
export type Tables<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

// Convenience type exports for easier use throughout the app
export type Profile = Tables<'profiles'>
export type Equipment = Tables<'equipment'>
export type LandListing = Tables<'land_listings'>
export type Category = Tables<'categories'>

export type EquipmentInsert = TablesInsert<'equipment'>
export type LandListingInsert = TablesInsert<'land_listings'>
export type ProfileInsert = TablesInsert<'profiles'>
