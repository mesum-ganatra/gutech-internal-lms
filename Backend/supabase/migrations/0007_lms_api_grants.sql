-- PostgreSQL table grants are checked before RLS. These grants make the
-- intended API operations available while row-level security still controls
-- which authenticated users may read or change each row.
grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant all privileges on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to authenticated;
grant all privileges on all sequences in schema public to service_role;
