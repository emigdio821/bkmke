import type { ButtonProps } from '@/components/ui/button'
import type { Bookmark } from '@/types'
import { HeartIcon, HeartOffIcon } from 'lucide-react'
import { startTransition } from 'react'
import { Button } from '@/components/ui/button'
import { useToggleFavorite } from '@/hooks/bookmarks/use-toggle-favorite'
import { useModEnabled } from '@/hooks/use-mod-enabled'

interface ToggleFavBtnProps extends ButtonProps {
  bookmark: Bookmark
}

export function ToggleFavBtn({ bookmark, ...props }: ToggleFavBtnProps) {
  const modEnabled = useModEnabled()
  const { handleToggleFavorite, optimisticBk } = useToggleFavorite(bookmark)

  if (!modEnabled) return null

  return (
    <Button size="icon-sm" variant="ghost" onClick={() => startTransition(handleToggleFavorite)} {...props}>
      {!optimisticBk.is_favorite ? <HeartIcon className="size-4" /> : <HeartOffIcon className="size-4" />}
      <span className="sr-only">Toggle favorite status</span>
    </Button>
  )
}
