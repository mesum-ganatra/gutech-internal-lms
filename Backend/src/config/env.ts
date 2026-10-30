import 'dotenv/config';
import { z } from 'zod';
const schema=z.object({PORT:z.coerce.number().default(4000),CLIENT_ORIGIN:z.string().default('http://localhost:5173').refine(value=>value.split(',').every(origin=>z.url().safeParse(origin.trim()).success),'CLIENT_ORIGIN must be a comma-separated list of valid origins.'),SUPABASE_URL:z.string().url(),SUPABASE_ANON_KEY:z.string().min(1),SUPABASE_SERVICE_ROLE_KEY:z.string().min(1),PASSWORD_RESET_REDIRECT:z.string().url().default('http://localhost:5173/reset-password')});
export const env=schema.parse(process.env);
