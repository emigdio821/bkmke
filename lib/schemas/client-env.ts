import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, 'This env variable is required').url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'This env variable is required'),
})

export const envClientSchema = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})
