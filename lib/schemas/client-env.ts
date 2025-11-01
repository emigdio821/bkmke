import { object, string } from 'zod'

const envSchema = object({
  NEXT_PUBLIC_SUPABASE_URL: string().min(1, 'This env variable is required').url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string().min(1, 'This env variable is required'),
})

export const envClientSchema = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})
