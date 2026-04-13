"use client"

import Image from "next/image"

import { BookmarkMedia } from "@/components/bookmarks/bookmark-media"
import type { ViewMode } from "@/lib/constants"
import { cn } from "@workspace/ui/lib/utils"

interface TweetPreviewProps {
  authorUsername: string
  authorDisplayName: string
  authorAvatarUrl: string
  text: string
  media: Array<{
    type: string
    url: string
    previewUrl?: string
    altText?: string
    variants?: Array<{ contentType: string; bitRate?: number; url: string }>
    durationMs?: number
    width?: number
    height?: number
  }>
  timeAgo: string
  variant?: ViewMode
}

export function TweetPreview({
  authorUsername,
  authorDisplayName,
  authorAvatarUrl,
  text,
  media,
  timeAgo,
  variant = "grid",
}: TweetPreviewProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {authorAvatarUrl ? (
          <div
            className={cn(
              "relative overflow-hidden rounded-lg border border-border bg-muted",
              variant === "list" ? "size-10" : "size-8"
            )}
          >
            <Image
              src={authorAvatarUrl}
              alt=""
              fill
              sizes={variant === "list" ? "40px" : "32px"}
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className={cn(
              "rounded-lg border border-border bg-muted",
              variant === "list" ? "size-10" : "size-8"
            )}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-w-0 items-baseline gap-2">
            <span
              className={cn(
                "truncate font-medium leading-tight",
                variant === "list" ? "text-[15px]" : "text-sm"
              )}
            >
              {authorDisplayName}
            </span>
            <span className="-translate-y-[6px] ml-auto shrink-0 font-heading text-[10px] text-muted-foreground">
              {timeAgo}
            </span>
          </div>
          <span className="truncate text-xs text-muted-foreground">
            @{authorUsername}
          </span>
        </div>
      </div>

      <p
        className={cn(
          "leading-relaxed",
          variant === "list" ? "line-clamp-6 text-[15px]" : "line-clamp-4 text-sm"
        )}
      >
        {text}
      </p>

      {media.length > 0 && (
        <BookmarkMedia media={media} variant={variant} context="card" />
      )}
    </div>
  )
}
