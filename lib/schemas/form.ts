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

export const createManualBookmarkSchema = z.object({
  name: requiredString,
  description: z.string(),
  url: z.string().url(),
  tags: z.string().array(),
  folderId: z.string(),
})

export const createAutomaticBookmarkSchema = z.object({
  folderId: z.string(),
  url: requiredString.url(),
  tags: z.string().array(),
})

export const editBookmarkSchema = z.object({
  name: requiredString,
  description: z.string(),
  url: requiredString.url(),
  tags: z.string().array(),
  folderId: z.string(),
})

export const importBookmarksSchema = z.object({
  bookmarks: requiredString.transform((value) => {
    return value
      .split('\n')
      .filter((url) => url.trim() !== '')
      .map((url) => url.trim())
  }),
  tags: z.string().array(),
  folderId: z.string(),
})
