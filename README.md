# GUTECH Student and Faculty Portal

A full-stack learning portal built with React, TypeScript, Node.js/Express, and Supabase Auth, Postgres, and Storage. The API enforces roles and course membership; row-level security also protects records in the database.

## Current features

- Email and password sign-in, recovery, secure refresh cookie, and required first-login password change.
- Admin user management for students, teachers, and administrators, including account activation and password reset.
- Course creation, faculty assignment, student enrollment, and archiving.
- Role-scoped course lists, assignment creation and submission, and teacher grading with feedback.
- MCQ quiz creation, timed attempts, automatic scoring, and teacher results.
- Campus or course announcements, read status, classroom chat, student marks, complaint submission, and admin complaint responses.
- Private course resources with file type and size validation in Supabase Storage.
- Health endpoint at `/health`, which checks Supabase profile table access before reporting ready.

## Requirements

- Node.js 20.19 or newer and npm.
- A Supabase project.
- For production hosting: a GitHub repository, a Render API service, and a Vercel web project.

## Local setup

1. Install dependencies from the repository root:

   ```sh
   npm ci
   ```

2. Copy `Frontend/.env.example` to `Frontend/.env.local` and set:

   ```dotenv
   VITE_API_URL=http://localhost:4000/api
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
   ```

3. Copy `Backend/.env.example` to `Backend/.env` and set:

   ```dotenv
   PORT=4000
   CLIENT_ORIGIN=http://localhost:5173
   SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SECRET_KEY
   PASSWORD_RESET_REDIRECT=http://localhost:5173/reset-password
   ```

   Keep the service-role key in the backend environment only. Never commit either `.env` file or put the service-role key in a `VITE_` variable.

4. Apply the database migrations to the intended Supabase project:

   ```sh
   cd Backend
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   cd ..
   ```

   The migrations create the schema, RLS policies, storage buckets, and required grants. `db push` applies pending migrations; it does not reset the hosted database.

5. Create the first admin. In Supabase, create an Auth user, copy its UUID, then run this in the SQL editor with the user's real email and name:

   ```sql
   insert into public.profiles (id, email, full_name, role, must_change_password)
   values ('AUTH_USER_UUID', 'admin@your-domain.edu', 'Portal Administrator', 'admin', false);
   ```

6. Start both applications from the repository root:

   ```sh
   npm run dev
   ```

   Open `http://localhost:5173`. The API health check is `http://localhost:4000/health`.

## Build and verification

```sh
npm run build
npm test
```

## Production deployment

Deploy both workspaces as separate Vercel projects from this GitHub repository:

### Vercel API project

- Import the `Backend` directory as a Vercel project and use its detected Express framework.
- Configure `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from the backend environment. Keep the service-role key in this project only.
- Set `CLIENT_ORIGIN` to the frontend origin and `PASSWORD_RESET_REDIRECT` to the frontend origin plus `/reset-password`. Set `NODE_ENV=production`.
- The API health check is `/health`; application routes are under `/api`.

### Vercel web project

- Import the `Frontend` directory as a second Vercel project and use its detected Vite framework.
- Set `VITE_API_URL` to `https://YOUR-API-PROJECT.vercel.app/api`.
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the same Supabase project as the API.

After both deployments have URLs, update the API project's `CLIENT_ORIGIN` and `PASSWORD_RESET_REDIRECT`, then redeploy the API. Add the production frontend URL and reset URL under Supabase Auth URL configuration. Keep all service-role credentials out of the frontend project.

## API notes

- API routes are under `/api`; `/health` is public and read-only.
- User creation is an admin API operation because Supabase Auth sign-up is disabled.
- Normal API requests use the signed-in user's JWT, so Postgres RLS remains active. Admin and cross-user operations use the server-only service-role client.
- The health endpoint returns HTTP 503 until the `profiles`, `courses`, `assignments`, and `quizzes` tables are reachable with the configured service role. A failing readiness check usually means the Supabase migrations or grants are pending, or the backend credentials point to the wrong project.

## Walkthrough video (3–5 minutes)

Use seeded demo accounts with non-sensitive sample data. Avoid showing real student records, email addresses, credentials, or secret values in the recording.

1. **Admin (45–60 seconds):** Sign in, show the dashboard, create a student and teacher, create a course, assign the teacher, and enroll the student.
2. **Teacher (45–60 seconds):** Sign in as the teacher, publish an assignment and quiz, post an announcement, and open course chat.
3. **Student (45–60 seconds):** Sign in as the student, submit the assignment, take the quiz, check marks, and submit a complaint.
4. **Teacher/admin (30–45 seconds):** Grade the submission, review quiz results, and respond to the complaint.
5. **Close (30–45 seconds):** Show the deployed student and API health URLs, then briefly explain the React client, Express API, Supabase schema/RLS, and deployment split.

Record the demo only after production environment variables, the first administrator, Supabase Auth redirect URLs, and the deployment health check are configured. The walkthrough uses separate role accounts, so prepare a demo student and teacher before recording.

## Repository contents and privacy

The repository contains the application source, Supabase migrations, deployment configuration, and setup documentation. Local `.env` files, build output, dependencies, the internal build-spec PDF, and the temporary live-audit script are excluded from Git. Keep the Supabase service-role key in the backend host's secret environment variables only; it must never be exposed to the browser or committed.
