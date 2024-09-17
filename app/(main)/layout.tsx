import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/navigation/sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex">
      <Sidebar />
      <main className="flex h-full w-full flex-col">
        <Navbar />
        <section className="p-4">{children}</section>
      </main>
    </div>
  )
}
