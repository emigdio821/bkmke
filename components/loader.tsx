import { Spinner } from './spinner'

export function Loader({ msg }: { msg?: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="bg-card flex flex-col items-center gap-1 rounded-md border p-4 shadow-xs">
        <Spinner />
        <span className="text-sm">{msg || 'Loading'}</span>
      </div>
    </div>
  )
}
