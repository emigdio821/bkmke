import { startTransition } from 'react'
import type { Bookmark } from '@/types'
import { HeartIcon, HeartOffIcon } from 'lucide-react'
import { areModificationsEnabled } from '@/lib/utils'
import { useToggleFavorite } from '@/hooks/bookmarks/use-toggle-favorite'
import { Button, type ButtonProps } from '@/components/ui/button'

interface ToggleFavBtnProps extends ButtonProps {
  bookmark: Bookmark
}

export function ToggleFavBtn({ bookmark, ...props }: ToggleFavBtnProps) {
  const { handleToggleFavorite, optimisticBk } = useToggleFavorite(bookmark)

  if (!areModificationsEnabled()) return null

  return (
    <Button size="icon" variant="ghost" onClick={() => startTransition(handleToggleFavorite)} {...props}>
      {optimisticBk.is_favorite ? <HeartIcon className="size-4" /> : <HeartOffIcon className="size-4" />}
      <span className="sr-only">Toggle favorite status</span>
    </Button>
  )
}
