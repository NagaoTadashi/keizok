/*
  # Initial Schema for SNS Marketing Automation App

  ## Overview
  This migration creates the core database schema for an SNS marketing automation application
  that helps EC site operators generate social media content using AI.

  ## New Tables

  ### 1. `profiles`
  Extends Supabase auth.users with additional user profile information
  - `id` (uuid, primary key) - References auth.users(id)
  - `email` (text) - User's email address
  - `full_name` (text) - User's full name
  - `avatar_url` (text, nullable) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `ec_sites`
  Stores EC site configuration for each user
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References profiles(id)
  - `name` (text) - EC site name
  - `url` (text) - EC site URL
  - `platform` (text) - Platform type (e.g., Shopify, WooCommerce, Custom)
  - `api_key` (text, encrypted, nullable) - API key for site integration
  - `api_secret` (text, encrypted, nullable) - API secret for site integration
  - `is_active` (boolean) - Whether the site is actively used
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `generated_content`
  Stores all generated social media content
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References profiles(id)
  - `ec_site_id` (uuid, foreign key, nullable) - References ec_sites(id)
  - `product_name` (text) - Product name
  - `product_description` (text, nullable) - Product description
  - `product_image_url` (text, nullable) - Original product image URL
  - `platform` (text) - Target platform (Instagram, Twitter, Facebook, etc.)
  - `content_type` (text) - Type of content (image, video)
  - `generated_url` (text) - URL of generated content
  - `prompt_used` (text, nullable) - AI prompt used for generation
  - `metadata` (jsonb, nullable) - Additional metadata
  - `created_at` (timestamptz) - Creation timestamp

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled with policies that:
  - Allow users to read only their own data
  - Allow users to insert their own data
  - Allow users to update their own data
  - Allow users to delete their own data

  ### Indexes
  - Indexes on user_id columns for faster queries
  - Index on ec_sites.is_active for filtering active sites
  - Index on generated_content.created_at for sorting by date
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create ec_sites table
CREATE TABLE IF NOT EXISTS ec_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  platform text NOT NULL,
  api_key text,
  api_secret text,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create generated_content table
CREATE TABLE IF NOT EXISTS generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  ec_site_id uuid REFERENCES ec_sites(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_description text,
  product_image_url text,
  platform text NOT NULL,
  content_type text NOT NULL,
  generated_url text NOT NULL,
  prompt_used text,
  metadata jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ec_sites_user_id ON ec_sites(user_id);
CREATE INDEX IF NOT EXISTS idx_ec_sites_is_active ON ec_sites(is_active);
CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_created_at ON generated_content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_content_ec_site_id ON generated_content(ec_site_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- EC Sites policies
CREATE POLICY "Users can view own ec sites"
  ON ec_sites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ec sites"
  ON ec_sites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ec sites"
  ON ec_sites FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ec sites"
  ON ec_sites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Generated Content policies
CREATE POLICY "Users can view own generated content"
  ON generated_content FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generated content"
  ON generated_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generated content"
  ON generated_content FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own generated content"
  ON generated_content FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ec_sites_updated_at BEFORE UPDATE ON ec_sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();