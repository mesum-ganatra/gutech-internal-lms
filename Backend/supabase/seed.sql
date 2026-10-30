-- Account creation must go through Supabase Auth Admin API so credentials are never stored in SQL.
-- Create one admin, two teachers and five students through the protected admin API after the first admin is bootstrapped.
insert into public.courses(code,title,description) values
('CS101','Foundations of Computing','Core computing concepts and problem solving.'),
('SE202','Software Engineering','Design, build and maintain reliable software.'),
('DS303','Data Science','Explore data analysis and statistical learning.')
on conflict(code) do nothing;
