import type { ServiceClient } from "./supabase.ts";

export interface OrganizationMembership {
  organization_id: string;
  role: string | null;
}

export const getMembership = async (
  client: ServiceClient,
  userId: string,
): Promise<OrganizationMembership> => {
  const { data, error } = await client
    .from("user_profiles")
    .select("organization_id, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch membership: ${error.message}`);
  }

  if (!data?.organization_id) {
    throw new Error("User has no organization assigned");
  }

  return data as OrganizationMembership;
};
