import { startTransition } from 'react'
import type { Bookmark } from '@/types'
import { IconHeart, IconHeartOff } from '@tabler/icons-react'
import { DEMO_ROLE } from '@/lib/constants'
import { useProfile } from '@/hooks/use-profile'
import { useToggleFavorite } from '@/hooks/use-toggle-favorite'
import { Button, type ButtonProps } from '@/components/ui/button'

interface ToggleFavBtnProps extends ButtonProps {
  bookmark: Bookmark
}

export function ToggleFavBtn({ bookmark, ...props }: ToggleFavBtnProps) {
  const { data: profile } = useProfile()
  const appMetadata = profile?.app_metadata
  const { handleToggleFavorite, optimisticBk } = useToggleFavorite(bookmark)

  return (
    <Button
      size="icon"
      variant="ghost"
      className="hover:bg-muted-foreground/10"
      disabled={appMetadata?.userrole === DEMO_ROLE}
      onClick={() => startTransition(handleToggleFavorite)}
      {...props}
    >
      {optimisticBk.is_favorite ? <IconHeartOff size={16} /> : <IconHeart size={16} />}
      <span className="sr-only">Toggle favorite status</span>
    </Button>
  )
}
