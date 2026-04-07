import { createClient } from "@supabase/supabase-js";

function readEnv() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
  return { url, anonKey };
}

const { url, anonKey } = readEnv();

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.placeholder";

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

export const supabase = createClient(
  url || PLACEHOLDER_URL,
  anonKey || PLACEHOLDER_ANON_KEY,
);
