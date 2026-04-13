import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { redirect } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { resolveAppSession } from "@/lib/server/app-session"
import { buttonVariants } from "@workspace/ui/lib/button-variants"
import { cn } from "@workspace/ui/lib/utils"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  void children

  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const appSession = await resolveAppSession()

  if (appSession.status !== "ready") {
    return (
      <main className="flex min-h-svh items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-md flex-col gap-3 rounded-lg border border-border bg-card p-6">
          <p className="font-heading text-sm uppercase tracking-[0.15em] text-foreground">
            xMarks
          </p>
          <p className="text-sm text-muted-foreground">{appSession.message}</p>
          <div className="pt-3">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-lg")}
            >
              Back home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return <AppShell viewer={appSession.viewer} />
}
