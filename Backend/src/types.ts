import type { Request } from 'express';
export type Role='admin'|'teacher'|'student';
export type AuthUser={id:string;role:Role;email:string;fullName:string;isActive:boolean;mustChangePassword:boolean;token:string};
declare global { namespace Express { interface Request { user?:AuthUser; accessToken?:string } } }
export type AuthedRequest=Request & {user:AuthUser;accessToken:string};
