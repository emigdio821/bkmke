import type { z } from 'zod'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import type { BookmarkSelect } from './bookmarks'
import type { TagSelect } from './tags'
import { bookmarkTags } from '..'

const bookmarkTagsSelectSchema = createSelectSchema(bookmarkTags)
const bookmarkTagsInsertSchema = createInsertSchema(bookmarkTags)
const bookmarkTagsUpdateSchema = createUpdateSchema(bookmarkTags)

export type BookmarkTagsSelect = z.infer<typeof bookmarkTagsSelectSchema>
export type BookmarkTagsInsert = z.infer<typeof bookmarkTagsInsertSchema>
export type BookmarkTagsUpdate = z.infer<typeof bookmarkTagsUpdateSchema>

export type TagsBookmark = BookmarkTagsSelect & {
  bookmark: BookmarkSelect
  tag: TagSelect
}
