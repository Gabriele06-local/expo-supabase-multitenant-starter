export type AppRole = "owner" | "admin" | "staff" | "customer";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  organization_id: string;
  name: string;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  organization_id: string;
  location_id: string | null;
  role: AppRole;
  created_at: string;
}

export interface Invite {
  id: string;
  organization_id: string;
  location_id: string | null;
  email: string;
  role: AppRole;
  invited_by: string;
  token: string;
  accepted_at: string | null;
  expires_at: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      organizations: { Row: Organization; Insert: Omit<Organization, "id" | "created_at" | "updated_at">; Update: Partial<Omit<Organization, "id">> };
      locations: { Row: Location; Insert: Omit<Location, "id" | "created_at" | "updated_at">; Update: Partial<Omit<Location, "id">> };
      memberships: { Row: Membership; Insert: Omit<Membership, "id" | "created_at">; Update: Partial<Omit<Membership, "id">> };
      invites: { Row: Invite; Insert: Omit<Invite, "id" | "created_at">; Update: Partial<Omit<Invite, "id">> };
    };
    Functions: {
      accept_invite: { Args: { invite_token: string }; Returns: string };
      create_organization: { Args: { org_name: string; org_slug: string }; Returns: string };
      change_membership_role: { Args: { membership_id: string; new_role: AppRole }; Returns: void };
      my_memberships: { Args: Record<string, never>; Returns: Array<{ membership_id: string; organization_id: string; organization_name: string; organization_slug: string; location_id: string | null; location_name: string | null; role: AppRole }> };
    };
  };
}
