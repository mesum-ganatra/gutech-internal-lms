-- Ensure the backend service-role API can create LMS profiles for Auth users.
-- This is intentionally idempotent so it also repairs projects where earlier
-- privilege migrations were only partially applied.
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.profiles to service_role;
grant insert on table public.audit_log to service_role;
