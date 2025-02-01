import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/navigation/sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="grid-cols-[288px_1fr] gap-4 lg:grid">
      <div />
      <Navbar />
      <Sidebar />
      <div className="flex gap-4 p-4 lg:pl-0">
        <section className="mx-auto w-full lg:max-w-4xl">{children}</section>
      </div>
    </div>
  )
}
