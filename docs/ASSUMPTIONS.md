# Build assumptions

- The provided workspace has empty `Frontend` and `Backend` directories, so the project uses those directories rather than renaming them to the spec's suggested `apps/web` and `apps/api` paths.
- Implement the spec in dependency order: shared schema and security foundation first, then the feature API/UI surfaces. Apply database migrations only after connecting the intended Supabase project.
- Demo account authentication records cannot be safely seeded through SQL because Supabase Auth users must be created through the Auth Admin API. Create the initial administrator out of band, then create the remaining users from admin user management. `seed.sql` supplies sample courses only.
- The auth API returns the access token in JSON for the in-memory browser session and stores the refresh token in an httpOnly cookie. This follows the spec's preferred refresh-token cookie approach.
- The browser uses Supabase directly only for Realtime subscriptions; ordinary reads, writes, and file operations use the API.
- Profile role controls all access. Newly created accounts require a password change; public registration is intentionally absent.
