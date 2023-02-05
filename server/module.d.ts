import { IDecodedJwtPayload } from './src/types';

declare module 'express' {
  export interface Request {
    user?: IDecodedJwtPayload;
  }
}
