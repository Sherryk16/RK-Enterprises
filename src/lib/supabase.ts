import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Live Supabase URL (from env):', supabaseUrl); // DEBUG LOG
console.log('Live Supabase Anon Key (from env, first 5 chars):', supabaseAnonKey?.substring(0, 5)); // DEBUG LOG

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key not found in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


