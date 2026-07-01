-- 00002: Row Level Security policies

-- Helper: get the caller's user id
create or replace function public.auth_user_id()
returns uuid
language sql stable
as $$
  select coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''), '00000000-0000-0000-0000-000000000000')::uuid;
$$;

-- Helper: check if a user has a given role (or higher) for an organization
create or replace function public.has_org_role(_user_id uuid, _org_id uuid, _min_role public.app_role)
returns boolean
language sql stable
as $$
  select exists (
    select 1
    from public.memberships m
    where m.user_id = _user_id
      and m.organization_id = _org_id
      and m.location_id is null
      and m.role <= _min_role
  );
$$;

-- Helper: check if a user has a given role (or higher) for a location
create or replace function public.has_location_role(_user_id uuid, _loc_id uuid, _min_role public.app_role)
returns boolean
language sql stable
as $$
  select exists (
    select 1
    from public.memberships m
    where m.user_id = _user_id
      and m.location_id = _loc_id
      and m.role <= _min_role
  );
$$;

-- Helper: check if a user belongs to an organization at any level
create or replace function public.belongs_to_org(_user_id uuid, _org_id uuid)
returns boolean
language sql stable
as $$
  select exists (
    select 1
    from public.memberships m
    where m.user_id = _user_id
      and m.organization_id = _org_id
  );
$$;

-- Enable RLS on all tables
alter table public.organizations enable row level security;
alter table public.locations enable row level security;
alter table public.memberships enable row level security;
alter table public.invites enable row level security;

-- ── ORGANIZATIONS ──

create policy "Organizations are visible to members"
  on public.organizations for select
  using (
    public.belongs_to_org(public.auth_user_id(), id)
  );

create policy "Organizations can be created by any authenticated user"
  on public.organizations for insert
  with check (true);

create policy "Organizations can be updated by owners"
  on public.organizations for update
  using (
    public.has_org_role(public.auth_user_id(), id, 'owner')
  );

create policy "Organizations can be deleted by owners"
  on public.organizations for delete
  using (
    public.has_org_role(public.auth_user_id(), id, 'owner')
  );

-- ── LOCATIONS ──

create policy "Locations are visible to organization members"
  on public.locations for select
  using (
    public.belongs_to_org(public.auth_user_id(), organization_id)
  );

create policy "Locations can be created by org owners and admins"
  on public.locations for insert
  with check (
    public.has_org_role(public.auth_user_id(), organization_id, 'admin')
  );

create policy "Locations can be updated by org owners, admins, or location admins"
  on public.locations for update
  using (
    public.has_org_role(public.auth_user_id(), organization_id, 'admin')
    or public.has_location_role(public.auth_user_id(), id, 'admin')
  );

create policy "Locations can be deleted by org owners"
  on public.locations for delete
  using (
    public.has_org_role(public.auth_user_id(), organization_id, 'owner')
  );

-- ── MEMBERSHIPS ──

create policy "Memberships are visible to org members"
  on public.memberships for select
  using (
    public.belongs_to_org(public.auth_user_id(), organization_id)
  );

-- Users can create their own customer memberships at signup
create policy "Users can join as customer"
  on public.memberships for insert
  with check (
    user_id = public.auth_user_id()
    and role = 'customer'
  );

-- Org owners/admins can manage memberships
create policy "Memberships can be managed by org owners and admins"
  on public.memberships for insert
  with check (
    public.has_org_role(public.auth_user_id(), organization_id, 'admin')
    and role <> 'owner'
  );

create policy "Memberships can be updated by org owners and admins"
  on public.memberships for update
  using (
    public.has_org_role(public.auth_user_id(), organization_id, 'admin')
  );

create policy "Memberships can be deleted by org owners and admins"
  on public.memberships for delete
  using (
    public.has_org_role(public.auth_user_id(), organization_id, 'admin')
  );

-- Users can also leave (delete their own membership)
create policy "Users can leave their own membership"
  on public.memberships for delete
  using (
    user_id = public.auth_user_id()
  );

-- ── INVITES ──

create policy "Invites are visible to org owners and admins"
  on public.invites for select
  using (
    public.has_org_role(public.auth_user_id(), organization_id, 'admin')
  );

create policy "Invites can be created by org owners and admins"
  on public.invites for insert
  with check (
    public.has_org_role(public.auth_user_id(), organization_id, 'admin')
  );

-- The invited user can accept by token (update accepted_at)
create policy "Invites can be accepted by the invited user"
  on public.invites for update
  using (
    email = (select email from auth.users where id = public.auth_user_id())
  );

create policy "Invites can be deleted by org owners and admins"
  on public.invites for delete
  using (
    public.has_org_role(public.auth_user_id(), organization_id, 'admin')
  );
