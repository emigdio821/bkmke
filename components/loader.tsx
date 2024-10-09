import { Spinner } from './spinner'

export function Loader({ msg }: { msg?: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-1 rounded-lg border bg-card p-4 shadow-sm">
        <Spinner />
        <span className="text-sm">{msg || 'Loading'}</span>
      </div>
    </div>
  )
}
