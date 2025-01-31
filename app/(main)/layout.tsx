import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/navigation/sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex justify-center">
      <div className="hidden w-3/12 md:block">
        <Sidebar />
      </div>
      <main className="flex h-full w-full flex-col md:w-9/12">
        <Navbar />
        <section className="p-4">{children}</section>
      </main>
    </div>
  )
}
