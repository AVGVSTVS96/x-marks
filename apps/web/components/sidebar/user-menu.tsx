"use client"

import Image from "next/image"
import { SignOutButton } from "@clerk/nextjs"
import { LogOut } from "lucide-react"

import type { AppViewer } from "@/lib/app-view-model"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@workspace/ui/components/button"
import { SidebarMenu, SidebarMenuItem } from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"

export function UserMenu({ viewer }: { viewer: AppViewer }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
          <div className="relative size-9 overflow-hidden rounded-lg border border-border bg-muted">
            {viewer.avatarUrl ? (
              <Image
                src={viewer.avatarUrl}
                alt={viewer.displayName}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{viewer.displayName}</p>
            <p className="truncate text-xs text-muted-foreground">@{viewer.username}</p>
          </div>
          <ThemeToggle />
        </div>
        <SignOutButton>
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-2 w-full justify-center rounded-lg"
            )}
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </SignOutButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
