import { boolean, email, object, string, url } from 'zod'
import { MAX_DESC_LENGTH, MAX_NAME_LENGTH } from '@/lib/constants'

const requiredString = string().trim().min(1, 'Required field')
const optionalString = string().trim()
const requiredNameWithMaxChars = requiredString.max(MAX_NAME_LENGTH)
const optionalDescWithMaxChars = optionalString.max(MAX_DESC_LENGTH)

export const loginSchema = object({
  email: email().trim().min(1, 'Email is required'),
  password: requiredString,
})

export const editUserSchema = object({
  firstName: optionalString,
  lastName: optionalString,
  avatarUrl: optionalString,
  password: optionalString,
})

export const createTagSchema = object({
  name: requiredNameWithMaxChars,
})

export const createFolderSchema = object({
  name: requiredNameWithMaxChars,
  description: optionalDescWithMaxChars,
})

export const createManualBookmarkSchema = object({
  name: requiredNameWithMaxChars,
  description: optionalDescWithMaxChars,
  url: url(),
  tags: optionalString.array(),
  folderId: optionalString,
  isFavorite: boolean(),
})

export const createAutomaticBookmarkSchema = object({
  folderId: optionalString,
  url: url(),
  tags: optionalString.array(),
  isFavorite: boolean(),
})

export const editBookmarkSchema = object({
  name: requiredNameWithMaxChars,
  description: optionalDescWithMaxChars,
  url: url(),
  tags: optionalString.array(),
  folderId: optionalString,
  isFavorite: boolean(),
  updateOG: boolean(),
  imageUrl: optionalString,
  faviconUrl: optionalString,
})

export const importBookmarksSchema = object({
  bookmarks: requiredString,
  tags: optionalString.array(),
  folderId: optionalString,
})
