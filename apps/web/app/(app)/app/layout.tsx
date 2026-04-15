import { auth } from "@clerk/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import Link from "next/link"
import { redirect } from "next/navigation"

import { api } from "@convex/_generated/api"

import { AppShell } from "@/components/layout/app-shell"
import { resolveAppSession } from "@/lib/server/app-session"
import { getServerViewPrefs } from "@/lib/server/view-prefs"
import { buttonVariants } from "@workspace/ui/lib/button-variants"
import { Card } from "@workspace/ui/components/card"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { userId, getToken } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const appSession = await resolveAppSession()

  if (appSession.status !== "ready") {
    return (
      <main className="flex min-h-svh items-center justify-center px-6 py-10">
        <Card padding="lg" gap="md" className="w-full max-w-md">
          <p className="font-heading text-sm uppercase tracking-eyebrow text-foreground">
            xMarks
          </p>
          <p className="text-sm text-muted-foreground">{appSession.message}</p>
          <div className="pt-3">
            <Link
              href="/"
              className={buttonVariants({ variant: "outline" })}
            >
              Back home
            </Link>
          </div>
        </Card>
      </main>
    )
  }

  const convexToken = await getToken({ template: "convex" })
  const [initialViewPrefs, preloadedSidebarData] = await Promise.all([
    getServerViewPrefs(),
    preloadQuery(api.folders.sidebarData, {}, { token: convexToken ?? undefined }),
  ])

  return (
    <AppShell
      viewer={appSession.viewer}
      initialViewPrefs={initialViewPrefs}
      preloadedSidebarData={preloadedSidebarData}
    >
      {children}
    </AppShell>
  )
}
