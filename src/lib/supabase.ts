import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL y una key publica (NEXT_PUBLIC_SUPABASE_ANON_KEY o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY).",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
