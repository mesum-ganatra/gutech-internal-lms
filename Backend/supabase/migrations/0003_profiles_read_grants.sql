-- PostgreSQL table grants are checked before RLS policies.
-- Allow signed-in users to query profiles; the existing RLS policy limits
-- authenticated reads to self, admins, and users in shared courses.
-- The backend service role also needs SELECT for its scoped profile lookup.
grant usage on schema public to authenticated, service_role;
grant select on table public.profiles to authenticated, service_role;
