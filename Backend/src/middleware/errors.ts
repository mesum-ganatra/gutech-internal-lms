import type {ErrorRequestHandler} from 'express';
import { ZodError } from 'zod';
import { HttpError,fail } from '../utils/http.js';
export const errors:ErrorRequestHandler=(error,req,res,_next)=>{if(error instanceof HttpError)return fail(res,error.status,error.code,error.message,error.details);if(error instanceof ZodError)return fail(res,422,'VALIDATION_ERROR','Please check the submitted fields.',error.flatten());if(error?.code==='LIMIT_FILE_SIZE')return fail(res,422,'FILE_TOO_LARGE','This file exceeds the size limit.');req.log?.error({err:error,requestId:req.id},'Request failed');return fail(res,500,'INTERNAL_ERROR','An unexpected error occurred.')};
