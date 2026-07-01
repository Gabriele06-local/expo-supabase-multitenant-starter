import { supabase } from "supabase";
import type { AppRole } from "shared-types";

export interface MyMembership {
  membership_id: string;
  organization_id: string;
  organization_name: string;
  organization_slug: string;
  location_id: string | null;
  location_name: string | null;
  role: AppRole;
}

export async function getMyMemberships(): Promise<MyMembership[]> {
  const { data, error } = await supabase.rpc("my_memberships");
  if (error) {
    console.error("Failed to load memberships", error);
    return [];
  }
  return data as unknown as MyMembership[];
}
