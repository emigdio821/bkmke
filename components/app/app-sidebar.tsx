import { getLoggedInUserProfile } from '@/lib/server-actions/profile'
import { getAppSidebarItemCount } from '@/lib/server-actions/sidebar'
import { ProfileInitializer } from '../profile-initializer'
import { SidebarInset, SidebarProvider } from '../ui/sidebar'
import { AppHeader } from './app-header'
import { AppSidebarClient } from './app-sidebar.client'

export async function AppSidebar({ children }: { children: React.ReactNode }) {
  const itemCount = await getAppSidebarItemCount()
  const loggedInUserProfileData = await getLoggedInUserProfile()

  return (
    <>
      <ProfileInitializer profileData={loggedInUserProfileData} />
      <SidebarProvider>
        <AppSidebarClient itemCount={itemCount} />
        <SidebarInset>
          <AppHeader />
          <div className="flex w-full flex-1 flex-col gap-4 p-4 xl:mx-auto xl:max-w-5xl">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
