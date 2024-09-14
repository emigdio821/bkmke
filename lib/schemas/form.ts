import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Required field').email(),
  password: z.string().min(1, 'Required field'),
})

export const editUserSchema = z.object({
  name: z.string(),
  avatar: z.string(),
  password: z.string(),
})
