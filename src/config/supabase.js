import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Evita requisições a URLs inválidas ou expiradas que causam ERR_NAME_NOT_RESOLVED e travam o carregamento
const isSupabaseValid = supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('adhkvvqvrbsxciletsll') && 
  supabaseUrl.startsWith('https://');

export const supabase = isSupabaseValid 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;