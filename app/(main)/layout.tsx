import { Suspense } from 'react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/navigation/sidebar'
import { SidebarSkeleton } from '@/components/skeletons'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex justify-center">
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
      <main className="flex h-screen w-full flex-col">
        <Navbar />
        <section className="p-4">{children}</section>
        <Footer />
      </main>
    </div>
  )
}
