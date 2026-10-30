import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
export const adminClient=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}});
export const userClient=(token?:string)=>createClient(env.SUPABASE_URL,env.SUPABASE_ANON_KEY,{auth:{autoRefreshToken:false,persistSession:false},global:token?{headers:{Authorization:`Bearer ${token}`}}:undefined});
