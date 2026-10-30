import type { Response,NextFunction,RequestHandler,Request } from 'express-serve-static-core';
import { z } from 'zod';
export class HttpError extends Error {constructor(public status:number,public code:string,message:string,public details?:unknown){super(message)}}
export const ok=(res:Response,data:unknown,status=200,meta?:unknown)=>res.status(status).json({data,...(meta?{meta}:{})});
export const fail=(res:Response,status:number,code:string,message:string,details?:unknown)=>res.status(status).json({error:{code,message,...(details?{details}:{})}});
export const asyncRoute=(fn:(req:Request,res:Response,next:NextFunction)=>Promise<unknown>):RequestHandler=>(req,res,next)=>{void fn(req,res,next).catch(next)};
export const body=(schema:z.ZodType)=>asyncRoute(async(req,res,next)=>{const parsed=schema.safeParse(req.body);if(!parsed.success)throw new HttpError(422,'VALIDATION_ERROR','Please check the submitted fields.',parsed.error.flatten());req.body=parsed.data;next()});
export const pagination=(req:Request)=>{const page=Math.max(1,Number(req.query.page)||1);const pageSize=Math.min(100,Math.max(1,Number(req.query.pageSize)||20));return{page,pageSize,from:(page-1)*pageSize,to:page*pageSize-1}};
