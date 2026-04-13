import Link from "next/link"
import type { ReactNode } from "react"

import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { buttonVariants } from "@workspace/ui/lib/button-variants"

import { ThemeToggle } from "@/components/layout/theme-toggle"
import { cn } from "@workspace/ui/lib/utils"

type AuthShellProps = {
  title: string
  eyebrow: string
  description: string
  note: string
  backHref: string
  backLabel: string
  children: ReactNode
}

export function AuthShell({
  title,
  eyebrow,
  description,
  note,
  backHref,
  backLabel,
  children,
}: AuthShellProps) {
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
            <Link
              href={backHref}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-lg"
              )}
            >
              {backLabel}
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <div className="grid flex-1 items-stretch gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:py-12">
          <section className="flex min-w-0 flex-col justify-between gap-8 border-border lg:border-r lg:pr-8">
            <div className="flex flex-col gap-4">
              <Badge variant="outline" className="w-fit rounded-lg">
                {eyebrow}
              </Badge>
              <div className="flex flex-col gap-3">
                <h1 className="max-w-xl font-heading text-4xl leading-tight tracking-tight sm:text-5xl">
                  {title}
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Auto-sync
                </p>
                <p className="mt-2 text-sm leading-6">
                  Refreshes in the background and on focus.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Search
                </p>
                <p className="mt-2 text-sm leading-6">
                  Fast access to saved links, notes, and tags.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Access
                </p>
                <p className="mt-2 text-sm leading-6">
                  Clerk-managed sign-in and route protection.
                </p>
              </div>
            </div>
          </section>

          <section className="flex min-w-0 items-center justify-center">
            <div className="w-full max-w-md">
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                {children}
              </div>
              <Separator className="my-6" />
              <p className="text-sm leading-6 text-muted-foreground">{note}</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
