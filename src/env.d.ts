// Using zod to parse env variables once, so it gives intellisense thorughout the app
import { z } from 'zod';

const envVariables = z.object({
  NODE_ENV: z.string(),

  PORT: z.string().or(z.number()),

  MONGO_URI: z.string(),

  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRY: z.string(),

  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRY: z.string(),

  SMTP_HOST: z.string(),
  SMTP_MAIL: z.string(),
  SMTP_PASS: z.string(),
  SMTP_FROM_EMAIL: z.string(),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),

  CLIENT_URL: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
