import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se as chaves não existirem, o site continua funcionando sem a seção de opiniões
export const supabase = url && key ? createClient(url, key) : null;