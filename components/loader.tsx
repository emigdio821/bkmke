import { Spinner } from './spinner'

export function Loader({ msg }: { msg?: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="bg-subtle flex flex-col items-center gap-1 rounded-md border border-dashed p-4">
        <Spinner />
        <span className="text-muted-foreground text-sm">{msg || 'Loading'}</span>
      </div>
    </div>
  )
}
