import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().min(1, 'This env variable is required').url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'This env variable is required'),
})

export const envClientSchema = envSchema.parse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
})
