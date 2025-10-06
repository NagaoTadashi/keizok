import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ECSite = {
  id: string;
  user_id: string;
  name: string;
  url: string;
  platform: string;
  api_key: string | null;
  api_secret: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type GeneratedContent = {
  id: string;
  user_id: string;
  ec_site_id: string | null;
  product_name: string;
  product_description: string | null;
  product_image_url: string | null;
  platform: string;
  content_type: string;
  generated_url: string;
  prompt_used: string | null;
  metadata: any;
  created_at: string;
};
