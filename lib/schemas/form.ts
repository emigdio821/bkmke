import { z } from 'zod'

const requiredString = z.string().trim().min(1, 'Required field')
const optionalString = z.string().trim()

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
  name: requiredString,
})

export const createFolderSchema = z.object({
  name: requiredString,
})

export const createManualBookmarkSchema = z.object({
  name: requiredString,
  description: optionalString,
  url: optionalString.url(),
  tags: optionalString.array(),
  folderId: optionalString,
})

export const createAutomaticBookmarkSchema = z.object({
  folderId: optionalString,
  url: requiredString.url(),
  tags: optionalString.array(),
})

export const editBookmarkSchema = z.object({
  name: requiredString,
  description: optionalString,
  url: requiredString.url(),
  tags: optionalString.array(),
  folderId: optionalString,

  updateOG: z.boolean(),
  imageUrl: optionalString,
  faviconUrl: optionalString,
})

export const importBookmarksSchema = z.object({
  bookmarks: requiredString,
  tags: optionalString.array(),
  folderId: optionalString,
})
