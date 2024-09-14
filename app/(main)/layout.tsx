import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/navigation/sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Sidebar />
      <main className="sm:ml-64 lg:ml-72">
        <Navbar />
        <section className="p-4 sm:p-6">{children}</section>
      </main>
      <Footer />
    </>
  )
}
