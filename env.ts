import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_CRYPTO_SECRET_KEY: z.string().min(1),
    NEXT_PUBLIC_BASE_URL: z.string().min(1),
  },
  server: {
    AUTH_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CRYPTO_SECRET_KEY: process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
