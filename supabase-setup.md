# Supabase Backend Setup Guide for Elghella Marketplace

## 1. Environment Configuration

Create a `.env.local` file in your project root with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 2. Database Schema Setup

Execute the following SQL commands in your Supabase SQL editor:

### 2.1 Enable Row Level Security and Extensions

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 2.2 Create Categories Table

```sql
-- Categories table for equipment and products
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0
);

-- Insert default categories
INSERT INTO categories (name, name_ar, description, icon, sort_order) VALUES
('Tractors', 'جرارات', 'Agricultural tractors and farming vehicles', 'tractor', 1),
('Harvesters', 'حصادات', 'Harvesting equipment and combines', 'wheat', 2),
('Plows', 'محاريث', 'Plowing and soil preparation equipment', 'shovel', 3),
('Seeders', 'بذارات', 'Seeding and planting equipment', 'seed', 4),
('Irrigation', 'أنظمة الري', 'Irrigation systems and water management', 'droplet', 5),
('Livestock', 'حيوانات المزرعة', 'Farm animals and livestock equipment', 'cow', 6),
('Transport', 'نقل وخدمات', 'Transportation and logistics services', 'truck', 7),
('Tools', 'أدوات يدوية', 'Hand tools and small equipment', 'wrench', 8);
```

### 2.3 Create Profiles Table

```sql
-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    full_name TEXT,
    phone VARCHAR(20),
    location TEXT,
    avatar_url TEXT,
    user_type VARCHAR(20) DEFAULT 'farmer' CHECK (user_type IN ('farmer', 'buyer', 'both')),
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_ratings INTEGER DEFAULT 0,
    bio TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
```

### 2.4 Create Equipment Table

```sql
-- Equipment listings table
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'DZD',
    category_id UUID REFERENCES categories(id),
    condition VARCHAR(20) DEFAULT 'good' CHECK (condition IN ('new', 'excellent', 'good', 'fair', 'poor')),
    year INTEGER,
    brand VARCHAR(100),
    model VARCHAR(100),
    hours_used INTEGER,
    location TEXT NOT NULL,
    coordinates JSONB,
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    contact_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Policies for equipment
CREATE POLICY "Equipment is viewable by everyone" ON equipment
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own equipment" ON equipment
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own equipment" ON equipment
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own equipment" ON equipment
    FOR DELETE USING (auth.uid() = user_id);
```

### 2.5 Create Land Listings Table

```sql
-- Land listings table
CREATE TABLE IF NOT EXISTS land_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'DZD',
    listing_type VARCHAR(10) DEFAULT 'sale' CHECK (listing_type IN ('sale', 'rent')),
    area_size DECIMAL(10,2) NOT NULL,
    area_unit VARCHAR(10) DEFAULT 'hectare' CHECK (area_unit IN ('hectare', 'acre', 'dunum')),
    location TEXT NOT NULL,
    coordinates JSONB,
    soil_type TEXT,
    water_source TEXT,
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    contact_count INTEGER DEFAULT 0,
    features TEXT[] DEFAULT '{}',
    documents TEXT[] DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;

-- Policies for land listings
CREATE POLICY "Land listings are viewable by everyone" ON land_listings
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own land listings" ON land_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own land listings" ON land_listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own land listings" ON land_listings
    FOR DELETE USING (auth.uid() = user_id);
```

### 2.6 Create Favorites Table

```sql
-- Favorites table for saved listings
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL,
    listing_type VARCHAR(20) NOT NULL CHECK (listing_type IN ('equipment', 'land')),
    UNIQUE(user_id, listing_id, listing_type)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policies for favorites
CREATE POLICY "Users can view their own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
    FOR DELETE USING (auth.uid() = user_id);
```

### 2.7 Create Reviews Table

```sql
-- Reviews table for user ratings
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID,
    listing_type VARCHAR(20) CHECK (listing_type IN ('equipment', 'land')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    UNIQUE(reviewer_id, reviewee_id, listing_id)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can insert reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = reviewer_id);
```

### 2.9 Create Indexes for Performance

```sql
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_equipment_user_id ON equipment(user_id);
CREATE INDEX IF NOT EXISTS idx_equipment_category_id ON equipment(category_id);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment(location);
CREATE INDEX IF NOT EXISTS idx_equipment_price ON equipment(price);
CREATE INDEX IF NOT EXISTS idx_equipment_created_at ON equipment(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_equipment_is_available ON equipment(is_available);

CREATE INDEX IF NOT EXISTS idx_land_listings_user_id ON land_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_land_listings_location ON land_listings(location);
CREATE INDEX IF NOT EXISTS idx_land_listings_price ON land_listings(price);
CREATE INDEX IF NOT EXISTS idx_land_listings_created_at ON land_listings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
```

### 2.10 Create Functions and Triggers

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_land_listings_updated_at BEFORE UPDATE ON land_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user rating
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET 
        rating = (
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM reviews
            WHERE reviewee_id = NEW.reviewee_id
        ),
        total_ratings = (
            SELECT COUNT(*)
            FROM reviews
            WHERE reviewee_id = NEW.reviewee_id
        )
    WHERE id = NEW.reviewee_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for rating updates
CREATE TRIGGER update_rating_on_review
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_user_rating();
```

## 3. Storage Setup

### 3.1 Create Storage Buckets

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('equipment-images', 'equipment-images', true),
('land-images', 'land-images', true),
('avatars', 'avatars', true),
('documents', 'documents', false);
```

### 3.2 Storage Policies

```sql
-- Storage policies for equipment images
CREATE POLICY "Equipment images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'equipment-images');

CREATE POLICY "Users can upload equipment images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'equipment-images' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their equipment images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'equipment-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their equipment images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'equipment-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Similar policies for other buckets
CREATE POLICY "Land images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'land-images');

CREATE POLICY "Users can upload land images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'land-images' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Avatars are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
```

## 4. Sample Data (Optional)

```sql
-- Insert sample equipment data
INSERT INTO equipment (user_id, title, description, price, category_id, condition, year, brand, model, location, images) VALUES
(
    (SELECT id FROM profiles LIMIT 1),
    'جرار جون دير 5075E',
    'جرار زراعي حديث بحالة ممتازة، مستعمل لمدة سنتين فقط',
    2500000,
    (SELECT id FROM categories WHERE name = 'Tractors'),
    'excellent',
    2022,
    'John Deere',
    '5075E',
    'البليدة، الجزائر',
    ARRAY['https://example.com/tractor1.jpg', 'https://example.com/tractor2.jpg']
);
```

## 5. Authentication Setup

### 5.1 Email Templates (Optional)

You can customize email templates in Supabase Dashboard > Authentication > Email Templates:

- **Confirm signup**: Welcome to Elghella! / مرحباً بك في الغلة!
- **Reset password**: Reset your password / إعادة تعيين كلمة المرور
- **Magic link**: Sign in to Elghella / تسجيل الدخول إلى الغلة

### 5.2 Authentication Providers

Enable the following in Supabase Dashboard > Authentication > Providers:
- Email (enabled by default)
- Google (optional)
- Facebook (optional)

## 6. Real-time Subscriptions

Enable real-time for tables that need live updates:

```sql
-- Enable real-time for equipment updates
ALTER PUBLICATION supabase_realtime ADD TABLE equipment;
```

## 7. Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **RLS Policies**: All tables have Row Level Security enabled
3. **API Keys**: Use anon key for client-side, service role key for server-side admin operations
4. **File Upload**: Implement file size and type restrictions
5. **Rate Limiting**: Consider implementing rate limiting for API calls

## 8. Next Steps

1. Set up your Supabase project at https://supabase.com
2. Run the SQL commands in your Supabase SQL editor
3. Update your `.env.local` with your project credentials
4. Test the authentication and database operations
5. Set up storage buckets and policies
6. Configure email templates and authentication providers

This setup provides a complete backend for the Elghella agricultural marketplace with user authentication, equipment listings, land listings, favorites, and reviews functionality.