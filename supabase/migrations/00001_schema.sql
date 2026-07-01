-- 00001: Base multi-tenant schema

-- User role enum
create type public.app_role as enum ('owner', 'admin', 'staff', 'customer');

-- Organizations (top-level tenant)
create table public.organizations (
  id uuid not null default gen_random_uuid(),
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_pkey primary key (id),
  constraint organizations_slug_key unique (slug)
);

-- Locations (branches within an organization)
create table public.locations (
  id uuid not null default gen_random_uuid(),
  organization_id uuid not null,
  name text not null,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locations_pkey primary key (id),
  constraint locations_organization_id_fkey foreign key (organization_id)
    references public.organizations (id) on delete cascade
);

-- Memberships (user ↔ org/location ↔ role)
create table public.memberships (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  organization_id uuid not null,
  location_id uuid,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  constraint memberships_pkey primary key (id),
  constraint memberships_user_id_fkey foreign key (user_id)
    references auth.users (id) on delete cascade,
  constraint memberships_organization_id_fkey foreign key (organization_id)
    references public.organizations (id) on delete cascade,
  constraint memberships_location_id_fkey foreign key (location_id)
    references public.locations (id) on delete cascade,
  -- A user can have only one membership per org+location combination
  constraint memberships_user_org_location_unique unique nulls not distinct (user_id, organization_id, location_id)
);

-- Invites (for onboarding new users)
create table public.invites (
  id uuid not null default gen_random_uuid(),
  organization_id uuid not null,
  location_id uuid,
  email text not null,
  role public.app_role not null default 'staff',
  invited_by uuid not null,
  token text not null,
  accepted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  constraint invites_pkey primary key (id),
  constraint invites_token_key unique (token),
  constraint invites_organization_id_fkey foreign key (organization_id)
    references public.organizations (id) on delete cascade,
  constraint invites_location_id_fkey foreign key (location_id)
    references public.locations (id) on delete cascade,
  constraint invites_invited_by_fkey foreign key (invited_by)
    references auth.users (id) on delete cascade
);

-- Indexes
create index memberships_user_id_idx on public.memberships (user_id);
create index memberships_organization_id_idx on public.memberships (organization_id);
create index memberships_location_id_idx on public.memberships (location_id);
create index invites_email_idx on public.invites (email);
create index locations_organization_id_idx on public.locations (organization_id);
