import { z } from 'zod'
import { MAX_INPUT_LENGTH } from '@/lib/constants'

const requiredString = z.string().trim().min(1, 'Required field')
const optionalString = z.string().trim()
const requiredWithMaxChars = optionalString.max(MAX_INPUT_LENGTH)
const optionalWithMaxChars = optionalString.max(MAX_INPUT_LENGTH)

export const loginSchema = z.object({
  email: requiredString.email(),
  password: requiredString,
})

export const editUserSchema = z.object({
  name: optionalString,
  avatar: optionalString,
  password: optionalString,
})

export const createTagSchema = z.object({
  name: requiredWithMaxChars,
})

export const createFolderSchema = z.object({
  name: requiredWithMaxChars,
  description: optionalWithMaxChars,
})

export const createManualBookmarkSchema = z.object({
  name: requiredWithMaxChars,
  description: optionalWithMaxChars,
  url: optionalString.url(),
  tags: optionalString.array(),
  folderId: optionalString,
  isFavorite: z.boolean(),
})

export const createAutomaticBookmarkSchema = z.object({
  folderId: optionalString,
  url: requiredString.url(),
  tags: optionalString.array(),
  isFavorite: z.boolean(),
})

export const editBookmarkSchema = z.object({
  name: requiredWithMaxChars,
  description: optionalWithMaxChars,
  url: requiredString.url(),
  tags: optionalString.array(),
  folderId: optionalString,
  isFavorite: z.boolean(),
  updateOG: z.boolean(),
  imageUrl: optionalString,
  faviconUrl: optionalString,
})

export const importBookmarksSchema = z.object({
  bookmarks: requiredString,
  tags: optionalString.array(),
  folderId: optionalString,
})
