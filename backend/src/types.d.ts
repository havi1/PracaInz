// types.d.ts
import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: {
      email: string;
      isAdmin: boolean;
    };
  }
}