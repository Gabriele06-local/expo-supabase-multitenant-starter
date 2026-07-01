-- Seed: demo data for development
-- Requires auth.users to already exist (create them via Supabase Auth UI or API first)

-- Demo organization
insert into public.organizations (id, name, slug)
values
  ('d0000000-0000-0000-0000-000000000001', 'Acme Corp', 'acme-corp'),
  ('d0000000-0000-0000-0000-000000000002', 'Globex Inc', 'globex-inc');

-- Demo locations
insert into public.locations (id, organization_id, name, address)
values
  ('d0000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000001', 'Main Office', '123 Main St, City'),
  ('d0000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000001', 'Branch North', '456 North Ave, City'),
  ('d0000000-0000-0000-0000-000000000021', 'd0000000-0000-0000-0000-000000000002', 'HQ', '789 Oak Rd, Town');

-- Note: memberships must reference real auth.users ids.
-- Run this after creating test users in Supabase Auth.
-- Example (replace with actual user IDs after creation):
--
-- insert into public.memberships (user_id, organization_id, location_id, role)
-- values
--   ('<owner-user-id>', 'd0000000-0000-0000-0000-000000000001', null, 'owner'),
--   ('<admin-user-id>', 'd0000000-0000-0000-0000-000000000001', null, 'admin'),
--   ('<staff-user-id>', 'd0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000011', 'staff'),
--   ('<customer-user-id>', 'd0000000-0000-0000-0000-000000000001', null, 'customer');

-- Demo invites
insert into public.invites (organization_id, location_id, email, role, invited_by, token)
values
  ('d0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000011', 'staff@example.com', 'staff', 'd0000000-0000-0000-0000-000000000001', 'demo-invite-token-staff'),
  ('d0000000-0000-0000-0000-000000000001', null, 'admin@example.com', 'admin', 'd0000000-0000-0000-0000-000000000001', 'demo-invite-token-admin');
