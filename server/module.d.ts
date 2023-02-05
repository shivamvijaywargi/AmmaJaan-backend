import { IDecodedJwtPayload } from './src/types';

declare module 'express' {
  export interface Request {
    user?: IDecodedJwtPayload;
  }
  export interface ProcessEnv {
    NODE_ENV: string;

    PORT: number;

    MONGO_URI: string;

    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRY: string;

    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRY: string;

    SMTP_HOST: string;
    SMTP_MAIL: string;
    SMTP_PASS: string;
    SMTP_FROM_EMAIL: string;
  }
}
