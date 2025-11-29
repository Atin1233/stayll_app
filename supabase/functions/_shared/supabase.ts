import { createClient, type SupabaseClient, type User } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("STAYLL_SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")
  ?? Deno.env.get("STAYLL_SERVICE_ROLE_KEY")
  ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  ?? Deno.env.get("SUPABASE_SERVICE_ROLE");
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("STAYLL_SUPABASE_ANON_KEY");

if (!SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

if (!SERVICE_ROLE_KEY) {
  throw new Error("Missing service role key environment variable (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE)");
}

if (!ANON_KEY) {
  throw new Error("Missing SUPABASE_ANON_KEY environment variable");
}

export type ServiceClient = SupabaseClient;
export type AuthedClient = SupabaseClient;

export const createServiceClient = (): ServiceClient =>
  createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

export const createAuthedClient = (authHeader: string | null): AuthedClient => {
  if (!authHeader) {
    throw new Error("Missing Authorization header");
  }

  return createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });
};

export const getUserFromToken = async (authHeader: string | null): Promise<{
  user: User;
  client: AuthedClient;
}> => {
  const client = createAuthedClient(authHeader);
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    throw new Error("Unable to authenticate user");
  }

  return { user: data.user, client };
};
