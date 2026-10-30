-- The backend's service-role client creates and manages LMS profile rows.
grant select, insert, update, delete on table public.profiles to service_role;
grant insert on table public.audit_log to service_role;
