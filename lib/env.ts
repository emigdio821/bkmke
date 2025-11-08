import { object, string, url } from 'zod'

const envSchema = object({
  SUPABASE_URL: url().min(1, 'This env variable is required'),
  SUPABASE_ANON_KEY: string().min(1, 'This env variable is required'),
})

export const serverEnv = envSchema.parse(process.env)
