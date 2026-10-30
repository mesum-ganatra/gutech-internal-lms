import {afterEach,describe,expect,it,vi} from 'vitest';
import {api,setAccessToken} from './api';

afterEach(()=>{vi.unstubAllGlobals();setAccessToken(null)});
describe('API client',()=>{
  it('sends the access token and credentials with API requests',async()=>{const fetchMock=vi.fn().mockResolvedValue(new Response(JSON.stringify({data:{ok:true}}),{status:200,headers:{'Content-Type':'application/json'}}));vi.stubGlobal('fetch',fetchMock);setAccessToken('session-token');await api('/auth/me');expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({credentials:'include'});expect((fetchMock.mock.calls[0]?.[1] as RequestInit).headers).toBeInstanceOf(Headers);expect(((fetchMock.mock.calls[0]?.[1] as RequestInit).headers as Headers).get('Authorization')).toBe('Bearer session-token')});
  it('surfaces a safe API error message',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({error:{message:'Access denied'}}),{status:403,headers:{'Content-Type':'application/json'}})));await expect(api('/admin/users')).rejects.toThrow('Access denied')});
});
