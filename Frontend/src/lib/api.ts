const base = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';
let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => { accessToken = token; };
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers); if (!(init.body instanceof FormData)) headers.set('Content-Type','application/json');
  if (accessToken) headers.set('Authorization',`Bearer ${accessToken}`);
  const response = await fetch(`${base}${path}`,{...init,headers,credentials:'include'});
  const payload = await response.json().catch(()=>({}));
  if (!response.ok) {
    const message = payload?.error?.message ?? 'Something went wrong. Please try again.';
    const diagnosticCode = payload?.error?.details?.supabaseCode;
    throw new Error(diagnosticCode ? `${message} (error code: ${diagnosticCode})` : message);
  }
  return payload as T;
}
