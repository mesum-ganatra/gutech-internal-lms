# GUTECH LMS API

Deploy this workspace as the `gutech-lms-backend` Vercel project with `Backend` as its root directory and the detected Express framework.

Configure these production environment variables in Vercel:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (backend only; never add it to the frontend)
- `CLIENT_ORIGIN` (the deployed frontend origin)
- `PASSWORD_RESET_REDIRECT` (the deployed frontend origin plus `/reset-password`)
- `NODE_ENV=production`

The public readiness endpoint is `/health`; API routes are under `/api`.
