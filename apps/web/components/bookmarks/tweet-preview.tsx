"use client"

import Image from "next/image"

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
        <div className="flex min-w-0 flex-col">
          <span
            className={cn(
              "truncate font-medium leading-tight",
              variant === "list" ? "text-[15px]" : "text-sm"
            )}
          >
            {authorDisplayName}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            @{authorUsername}
          </span>
        </div>
        <span className="ml-auto shrink-0 font-heading text-[10px] text-muted-foreground">
          {timeAgo}
        </span>
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
        <div className="flex gap-1 overflow-hidden">
          {media.slice(0, 2).map((item, index) => (
            <div
              key={index}
              className={cn(
                "relative flex-1 overflow-hidden rounded-lg border border-border bg-muted",
                variant === "list" ? "h-40 lg:h-52" : "h-28 sm:h-32 xl:h-36"
              )}
            >
              <Image
                src={item.previewUrl ?? item.url}
                alt={item.altText ?? ""}
                fill
                sizes={variant === "list" ? "50vw" : "33vw"}
                className="object-cover"
              />
            </div>
          ))}
          {media.length > 2 && (
            <div
              className={cn(
                "flex w-14 items-center justify-center rounded-lg border border-border bg-muted font-heading text-xs text-muted-foreground",
                variant === "list" ? "h-40 lg:h-52" : "h-28 sm:h-32 xl:h-36"
              )}
            >
              +{media.length - 2}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
