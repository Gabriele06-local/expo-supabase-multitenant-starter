-- Seed: realistic demo data for development
-- Creates test auth users, organizations, locations, memberships, and invites.
-- Run with: supabase db reset --linked

-- ============================================================
-- 1. Create test users in auth.users (bypasses RLS — service role)
-- ============================================================
insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
values
  (
    'd1000000-0000-0000-0000-000000000001',
    'owner@acme.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Alice Owner"}',
    now(),
    now(),
    '', '', '', ''
  ),
  (
    'd1000000-0000-0000-0000-000000000002',
    'admin@acme.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Bob Admin"}',
    now(),
    now(),
    '', '', '', ''
  ),
  (
    'd1000000-0000-0000-0000-000000000003',
    'staff@acme.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Charlie Staff"}',
    now(),
    now(),
    '', '', '', ''
  ),
  (
    'd1000000-0000-0000-0000-000000000004',
    'customer@acme.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Diana Customer"}',
    now(),
    now(),
    '', '', '', ''
  ),
  (
    'd1000000-0000-0000-0000-000000000005',
    'owner@globex.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Eve Owner Globex"}',
    now(),
    now(),
    '', '', '', ''
  );

-- ============================================================
-- 2. Organizations
-- ============================================================
insert into public.organizations (id, name, slug)
values
  ('d0000000-0000-0000-0000-000000000001', 'Acme Corp', 'acme-corp'),
  ('d0000000-0000-0000-0000-000000000002', 'Globex Inc', 'globex-inc');

-- ============================================================
-- 3. Locations
-- ============================================================
insert into public.locations (id, organization_id, name, address)
values
  ('d0000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000001', 'Main Office', '123 Main Street, New York, NY 10001'),
  ('d0000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000001', 'Branch North', '456 Broadway, New York, NY 10013'),
  ('d0000000-0000-0000-0000-000000000013', 'd0000000-0000-0000-0000-000000000001', 'Warehouse', '789 Industrial Blvd, Newark, NJ 07101'),
  ('d0000000-0000-0000-0000-000000000021', 'd0000000-0000-0000-0000-000000000002', 'HQ', '100 Tech Park, San Francisco, CA 94105');

-- ============================================================
-- 4. Memberships
-- ============================================================
insert into public.memberships (user_id, organization_id, location_id, role)
values
  -- Acme Corp: Alice is owner, Bob is admin, Charlie is staff at Branch North, Diana is customer
  ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', null, 'owner'),
  ('d1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', null, 'admin'),
  ('d1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000012', 'staff'),
  ('d1000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', null, 'customer'),

  -- Globex Inc: Eve is owner
  ('d1000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000002', null, 'owner');

-- ============================================================
-- 5. Invites (pending)
-- ============================================================
insert into public.invites (organization_id, location_id, email, role, invited_by, token, expires_at)
values
  ('d0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000011', 'newstaff@acme.com', 'staff', 'd1000000-0000-0000-0000-000000000001', 'demo-invite-staff-001', now() + interval '7 days'),
  ('d0000000-0000-0000-0000-000000000001', null, 'newadmin@acme.com', 'admin', 'd1000000-0000-0000-0000-000000000001', 'demo-invite-admin-001', now() + interval '7 days'),
  ('d0000000-0000-0000-0000-000000000002', null, 'newstaff@globex.com', 'staff', 'd1000000-0000-0000-0000-000000000005', 'demo-invite-globex-001', now() + interval '7 days');
