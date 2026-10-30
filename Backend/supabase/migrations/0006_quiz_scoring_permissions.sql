-- Quiz answer keys stay hidden from learner roles. The API reads answer keys
-- and writes calculated scores through its server-only service-role client.
grant select on table public.quiz_answers to service_role;
grant select, update on table public.quiz_attempts to service_role;
