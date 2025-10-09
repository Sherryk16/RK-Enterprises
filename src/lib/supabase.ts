import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (first 5 chars):', supabaseAnonKey?.substring(0, 5));

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key not found in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


