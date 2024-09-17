import { z } from 'zod'

const requiredString = z.string().min(1, 'Required field')

export const loginSchema = z.object({
  email: requiredString.email(),
  password: requiredString,
})

export const editUserSchema = z.object({
  name: z.string(),
  avatar: z.string(),
  password: z.string(),
})

export const createTagSchema = z.object({
  name: requiredString,
})

export const createFolderSchema = z.object({
  name: requiredString,
})

export const createBookmarkSchema = z.object({
  name: requiredString,
  description: z.string(),
  url: z.string().url(),
  tags: z.string().array(),
})
