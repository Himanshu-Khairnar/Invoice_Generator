import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Layout/Sidebar"
import { Separator } from "@/components/ui/separator"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/mongodb"
import User from "@/models/user.model"
import AppBreadcrumb from "@/components/Layout/AppBreadcrumb"

async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value
    if (!token) return null

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    if (!payload.userId) return null

    await dbConnect()
    const user = await User.findById(payload.userId).select("fullname email profilePicture")
    if (!user) return null

    return { fullname: user.fullname as string, email: user.email as string, profilePicture: user.profilePicture as string | undefined }
  } catch {
    return null
  }
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <AppBreadcrumb />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
