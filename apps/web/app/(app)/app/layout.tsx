import { auth } from "@clerk/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import Link from "next/link"
import { redirect } from "next/navigation"

import { api } from "@convex/_generated/api"

import { AppShell } from "@/components/layout/app-shell"
import { resolveAppSession } from "@/lib/server/app-session"
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
              className={buttonVariants({ variant: "outline", radius: "lg" })}
            >
              Back home
            </Link>
          </div>
        </Card>
      </main>
    )
  }

  const convexToken = await getToken({ template: "convex" })

  const [preloadedFolders, preloadedAllBookmarks] = await Promise.all([
    preloadQuery(api.folders.list, {}, { token: convexToken ?? undefined }),
    preloadQuery(api.bookmarks.list, {}, { token: convexToken ?? undefined }),
  ])

  return (
    <AppShell
      viewer={appSession.viewer}
      preloadedFolders={preloadedFolders}
      preloadedAllBookmarks={preloadedAllBookmarks}
    >
      {children}
    </AppShell>
  )
}
