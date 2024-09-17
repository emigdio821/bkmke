import { Suspense } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/navigation/sidebar'
import { SidebarSkeleton } from '@/components/skeletons'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex">
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
      <main className="flex h-full w-full flex-col">
        <Navbar />
        <section className="p-4">{children}</section>
      </main>
    </div>
  )
}
