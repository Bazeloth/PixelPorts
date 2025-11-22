import { ServerEnvSchema } from "./schema";

// Load .env files only in development/test. In production (Vercel), envs come from the platform.
if (process.env.NODE_ENV !== "production") {
  // Lazy require avoids bundling dotenv on edge runtimes
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config();
}

const parsed = ServerEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid or missing server environment variables:\n");
  for (const issue of parsed.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }
  // Fail fast to surface misconfiguration early (especially in production)
  // Note: Do not import this file from Edge runtime code.
  process.exit(1);
}

export const env = parsed.data;