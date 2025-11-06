export const MAX_NAME_LENGTH = 80
export const MAX_DESC_LENGTH = 120
export const ALL_BOOKMARKS_SELECT = `
  *,
  tag_items!bookmark_id(id, tag:tags(id,name)),
  folder:folders(name)
`
