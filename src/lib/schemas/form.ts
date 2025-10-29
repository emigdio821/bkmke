import { z } from 'zod'
import { MAX_DESC_LENGTH, MAX_NAME_LENGTH } from '@/lib/constants'

const requiredString = z.string().trim().min(1, 'Required field')
const optionalString = z.string().trim()
const requiredNameWithMaxChars = requiredString.max(MAX_NAME_LENGTH)
const optionalDescWithMaxChars = optionalString.max(MAX_DESC_LENGTH)

export const loginSchema = z.object({
  email: requiredString.email(),
  password: requiredString,
})

export const editUserSchema = z.object({
  firstName: optionalString,
  lastName: optionalString,
  avatarUrl: optionalString,
  password: optionalString,
})

export const createTagSchema = z.object({
  name: requiredNameWithMaxChars,
})

export const createFolderSchema = z.object({
  name: requiredNameWithMaxChars,
  description: optionalDescWithMaxChars,
})

export const createManualBookmarkSchema = z.object({
  name: requiredNameWithMaxChars,
  description: optionalDescWithMaxChars,
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
  name: requiredNameWithMaxChars,
  description: optionalDescWithMaxChars,
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
