"use client"

import Image from "next/image"

import { BookmarkMedia } from "@/components/media/bookmark-media"
import type { MediaItem } from "@/components/media/media-utils"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

type TweetSize = "sm" | "md"

interface TweetPreviewProps {
  authorUsername: string
  authorDisplayName: string
  authorAvatarUrl: string
  text: string
  media?: MediaItem[]
  timeAgo: string
  size?: TweetSize
}

export function TweetPreview({
  authorUsername,
  authorDisplayName,
  authorAvatarUrl,
  text,
  media,
  timeAgo,
  size = "sm",
}: TweetPreviewProps) {
  const isMd = size === "md"
  const avatarClass = cn(
    "shrink-0 overflow-hidden rounded-lg border border-border bg-muted",
    isMd ? "size-10" : "size-8",
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {authorAvatarUrl ? (
          <div className={cn("relative", avatarClass)}>
            <Image
              src={authorAvatarUrl}
              alt=""
              fill
              sizes={isMd ? "40px" : "32px"}
              className="object-cover"
            />
          </div>
        ) : (
          <div className={avatarClass} />
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-w-0 items-baseline gap-2">
            <span
              className={cn(
                "truncate font-medium leading-tight",
                isMd ? "text-base" : "text-sm",
              )}
            >
              {authorDisplayName}
            </span>
            <span className="-translate-y-[6px] ml-auto shrink-0 font-heading text-xs text-muted-foreground">
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
          isMd ? "line-clamp-6 text-base" : "line-clamp-4 text-sm",
        )}
      >
        {text}
      </p>

      {media && media.length > 0 && (
        <BookmarkMedia media={media} size={size} context="card" />
      )}
    </div>
  )
}

const SKELETON_LINE_WIDTHS = [
  "w-full",
  "w-11/12",
  "w-[96%]",
  "w-10/12",
  "w-full",
  "w-9/12",
]

export function TweetPreviewSkeleton({ size = "sm" }: { size?: TweetSize }) {
  const isMd = size === "md"
  const lineCount = isMd ? 6 : 4
  const lineHeight = isMd ? "h-4" : "h-3.5"

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Skeleton radius="lg" className={cn("shrink-0", isMd ? "size-10" : "size-8")} />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <Skeleton
              radius="lg"
              className={isMd ? "h-4 w-32" : "h-3.5 w-28"}
            />
            <Skeleton radius="lg" className="h-2.5 w-8" />
          </div>
          <Skeleton radius="lg" className="h-3 w-20" />
        </div>
      </div>

      <div className={cn("flex flex-col", isMd ? "gap-2" : "gap-1.5")}>
        {Array.from({ length: lineCount }).map((_, index) => (
          <Skeleton
            key={index}
            radius="lg"
            className={cn(
              lineHeight,
              SKELETON_LINE_WIDTHS[index % SKELETON_LINE_WIDTHS.length],
            )}
          />
        ))}
      </div>
    </div>
  )
}
