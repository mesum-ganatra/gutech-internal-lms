import {describe,expect,it} from 'vitest';
import {loginSchema,passwordSchema,quizSchema,paginationSchema,userPatchSchema} from '../schemas.js';

describe('request schemas',()=>{
  it('accepts valid login and rejects blank passwords',()=>{expect(loginSchema.safeParse({email:'student@gutech.edu',password:'valid-pass'}).success).toBe(true);expect(loginSchema.safeParse({email:'student@gutech.edu',password:''}).success).toBe(false)});
  it('enforces the password strength policy',()=>{expect(passwordSchema.safeParse({newPassword:'learning123'}).success).toBe(true);expect(passwordSchema.safeParse({newPassword:'short'}).success).toBe(false)});
  it('caps list pagination at 100 rows',()=>{expect(paginationSchema.safeParse({page:1,pageSize:100}).success).toBe(true);expect(paginationSchema.safeParse({page:1,pageSize:101}).success).toBe(false)});
  it('requires a non-empty user patch',()=>{expect(userPatchSchema.safeParse({isActive:false}).success).toBe(true);expect(userPatchSchema.safeParse({}).success).toBe(false)});
  it('rejects quiz questions with missing correct options',()=>{const value={title:'Quiz',timeLimitMinutes:10,opensAt:'2026-10-26T09:00:00.000Z',closesAt:'2026-10-26T10:00:00.000Z',questions:[{type:'mcq_single',prompt:'Question?',options:[{id:'a',text:'A'},{id:'b',text:'B'}],marks:1,correctOptionIds:[]}]};expect(quizSchema.safeParse(value).success).toBe(false)});
});
