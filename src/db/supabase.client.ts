import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Używamy service_role key dla operacji backend - omija RLS
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);

export type SupabaseClient = typeof supabaseClient;

// Tymczasowy user ID do testowania API bez pełnej autoryzacji
// User utworzony w lokalnym Supabase Studio: http://127.0.0.1:54323/project/default/auth/users
// TODO: Zastąpić prawdziwym user_id z Supabase Auth po wdrożeniu autoryzacji
export const DEFAULT_USER_ID = "d6c511fe-222e-4a2a-bc99-56e3a0ece3a7";
