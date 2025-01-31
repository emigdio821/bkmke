import { Fragment } from 'react'
import type { Folder } from '@/types'
import { IconChevronRight } from '@tabler/icons-react'
import { SelectItem } from '@/components/ui/select'

interface FolderSelectItemsProps {
  folders: Folder[]
  parentFolder?: Folder
}

export function FolderSelectItems({ folders, parentFolder }: FolderSelectItemsProps) {
  return (
    <>
      {folders.map((folder) => (
        <Fragment key={`parent-folder-${folder.id}`}>
          <SelectItem value={folder.id}>
            <span className="flex items-center">
              {parentFolder && (
                <>
                  <span className="text-muted-foreground text-xs">{parentFolder.name}</span>
                  <IconChevronRight className="text-muted-foreground size-3.5" />
                </>
              )}
              {folder.name}
            </span>
          </SelectItem>
          {folder.children.length > 0 && <FolderSelectItems parentFolder={folder} folders={folder.children} />}
        </Fragment>
      ))}
    </>
  )
}
