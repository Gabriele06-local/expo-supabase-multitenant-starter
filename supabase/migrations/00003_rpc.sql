-- 00003: RPC functions for privileged operations

-- Accept an invite by token
create or replace function public.accept_invite(invite_token text)
returns uuid
language plpgsql
security definer
as $$
declare
  v_invite public.invites;
  v_membership_id uuid;
begin
  -- Lock and fetch the invite
  select * into v_invite
  from public.invites
  where token = invite_token
    and accepted_at is null
    and expires_at > now()
  for update;

  if not found then
    raise exception 'Invite not found or expired' using errcode = 'INV01';
  end if;

  -- Verify the caller's email matches
  if v_invite.email <> (select email from auth.users where id = auth.uid()) then
    raise exception 'This invite is for a different email address' using errcode = 'INV02';
  end if;

  -- Create the membership
  insert into public.memberships (user_id, organization_id, location_id, role)
  values (auth.uid(), v_invite.organization_id, v_invite.location_id, v_invite.role)
  returning id into v_membership_id;

  -- Mark invite as accepted
  update public.invites
  set accepted_at = now()
  where id = v_invite.id;

  return v_membership_id;
end;
$$;

-- Create an organization with the caller as owner
create or replace function public.create_organization(org_name text, org_slug text)
returns uuid
language plpgsql
security definer
as $$
declare
  v_org_id uuid;
begin
  insert into public.organizations (name, slug)
  values (org_name, org_slug)
  returning id into v_org_id;

  insert into public.memberships (user_id, organization_id, role)
  values (auth.uid(), v_org_id, 'owner');

  return v_org_id;
end;
$$;

-- Change a user's role within an organization
create or replace function public.change_membership_role(
  membership_id uuid,
  new_role public.app_role
)
returns void
language plpgsql
security definer
as $$
declare
  v_org_id uuid;
  caller_role public.app_role;
begin
  -- Get the membership's organization
  select organization_id into v_org_id
  from public.memberships
  where id = membership_id;

  -- Check caller's role in that organization
  select role into caller_role
  from public.memberships
  where user_id = auth.uid()
    and organization_id = v_org_id
    and location_id is null;

  if caller_role is null or caller_role > 'admin' then
    raise exception 'Only org owners and admins can change roles' using errcode = 'PERM01';
  end if;

  -- Cannot promote someone to owner
  if new_role = 'owner' then
    raise exception 'Cannot promote to owner. Transfer ownership instead.' using errcode = 'PERM02';
  end if;

  -- Cannot change the owner's role
  if exists (
    select 1 from public.memberships
    where id = membership_id and role = 'owner'
  ) then
    raise exception 'Cannot change the owner role' using errcode = 'PERM03';
  end if;

  update public.memberships
  set role = new_role
  where id = membership_id;
end;
$$;

-- Get all memberships for the current user (to power role-based navigation)
create or replace function public.my_memberships()
returns table (
  membership_id uuid,
  organization_id uuid,
  organization_name text,
  organization_slug text,
  location_id uuid,
  location_name text,
  role public.app_role
)
language sql
stable
as $$
  select
    m.id,
    o.id,
    o.name,
    o.slug,
    l.id,
    l.name,
    m.role
  from public.memberships m
  join public.organizations o on o.id = m.organization_id
  left join public.locations l on l.id = m.location_id
  where m.user_id = auth.uid();
$$;
