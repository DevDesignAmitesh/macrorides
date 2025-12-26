import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  MAPS_CLIENT_ID: z.string().min(1),
  ADMIN_MAIL: z.string().min(1),
  MC_EMAIL: z.string().min(1),
  MC_CUSTOMER_ID: z.string().min(1),
  MC_KEY: z.string().min(1),
  ADMIN_MAIL_PASS: z.string().min(1),
  MAPS_CLIENT_SECRET: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

export function getEnv() {
  return envSchema.parse(process.env);
}
