import Link from "next/link"

import { Show } from "@clerk/nextjs"
import { ArrowRight, Check, RefreshCw, Search } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { buttonVariants } from "@workspace/ui/lib/button-variants"

import { ThemeToggle } from "@/components/layout/theme-toggle"
import { AUTO_SYNC_INTERVAL_MINUTES } from "@/lib/app-view-model"
import { cn } from "@workspace/ui/lib/utils"

export default function Page() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-border pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-heading text-sm uppercase tracking-[0.18em]"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-muted text-xs font-semibold">
              XM
            </span>
            <span>xMarks</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Show when="signed-in">
              <Link
                href="/app"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-lg"
                )}
              >
                Open app
              </Link>
            </Show>
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-lg"
                )}
              >
                Sign in
              </Link>
            </Show>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:py-14">
          <div className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-lg">
                Next 16
              </Badge>
              <Badge variant="outline" className="rounded-lg">
                React 19.2
              </Badge>
              <Badge variant="outline" className="rounded-lg">
                Clerk
              </Badge>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="max-w-2xl font-heading text-5xl leading-tight tracking-tight sm:text-6xl">
                Keep the bookmarks you care about in one fast, current workspace.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                xMarks keeps the public entry, the sign-in flow, and the protected
                app shell in sync with a shorter refresh loop so the next backend
                pass has room to feel immediate.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Show when="signed-in">
                <Link
                  href="/app"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-lg shadow-sm"
                  )}
                >
                  Open app
                  <ArrowRight className="size-4" />
                </Link>
              </Show>
              <Show when="signed-out">
                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-lg shadow-sm"
                  )}
                >
                  Sign in
                  <ArrowRight className="size-4" />
                </Link>
              </Show>
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-lg"
                )}
              >
                Create account
              </Link>
            </div>

            <Separator />

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Search className="size-4" />
                  Search
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Find tags, notes, and links without leaving the shell.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <RefreshCw className="size-4" />
                  Sync
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Auto-refresh runs every {AUTO_SYNC_INTERVAL_MINUTES} minutes
                  while the app is open.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Check className="size-4" />
                  Access
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Clerk handles the session and protected routing.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Shell preview
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Bookmarks</p>
                    <Badge variant="secondary" className="rounded-lg">
                      Ready
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The app route is protected, stateful, and ready for the Convex
                    lane to start filling rows.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Sync loop</p>
                    <Badge variant="outline" className="rounded-lg">
                      Focus-aware
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The shell pings the local sync endpoint on a short interval and
                    when the tab regains attention.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Routing</p>
                    <Badge variant="outline" className="rounded-lg">
                      App Router
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Landing, auth, and protected app surfaces are split by route
                    instead of by client island.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              The workspace stays quiet until you sign in, then hands you straight
              to the app shell.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
