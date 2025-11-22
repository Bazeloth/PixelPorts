import { ClientEnvSchema } from "./schema";

// Only validate public vars; these are inlined at build time in Next.js
const parsed = ClientEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  NEXT_PUBLIC_MIXPANEL_API_HOST: process.env.NEXT_PUBLIC_MIXPANEL_API_HOST,
});

if (!parsed.success) {
  const messages = parsed.error.issues
    .map((i) => `- ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(`Invalid client environment variables:\n${messages}`);
}

export const clientEnv = parsed.data;
