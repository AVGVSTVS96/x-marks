"use client"

import Image from "next/image"
import { cva, type VariantProps } from "@workspace/ui/lib/cva"

import { BookmarkMedia } from "@/components/media/bookmark-media"
import type { MediaItem } from "@/components/media/media-utils"
import type { ViewMode } from "@/lib/constants"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

const tweetAvatarVariants = cva(
  "shrink-0 overflow-hidden rounded-lg border border-border bg-muted",
  {
    variants: {
      variant: {
        list: "relative size-10",
        grid: "relative size-8",
        media: "relative size-8",
      },
    },
    defaultVariants: { variant: "grid" },
  }
)

const tweetDisplayNameVariants = cva(
  "truncate font-medium leading-tight",
  {
    variants: {
      variant: {
        list: "text-[15px]",
        grid: "text-sm",
        media: "text-sm",
      },
    },
    defaultVariants: { variant: "grid" },
  }
)

const tweetBodyVariants = cva("leading-relaxed", {
  variants: {
    variant: {
      list: "line-clamp-6 text-[15px]",
      grid: "line-clamp-4 text-sm",
      media: "line-clamp-4 text-sm",
    },
  },
  defaultVariants: { variant: "grid" },
})

const tweetSkeletonAvatarVariants = cva("shrink-0", {
  variants: {
    variant: {
      list: "size-10",
      grid: "size-8",
      media: "size-8",
    },
  },
  defaultVariants: { variant: "grid" },
})

const tweetSkeletonNameVariants = cva("", {
  variants: {
    variant: {
      list: "h-[15px] w-32",
      grid: "h-3.5 w-28",
      media: "h-3.5 w-28",
    },
  },
  defaultVariants: { variant: "grid" },
})

const tweetSkeletonLineVariants = cva("", {
  variants: {
    variant: {
      list: "h-[15px]",
      grid: "h-3.5",
      media: "h-3.5",
    },
  },
  defaultVariants: { variant: "grid" },
})

const tweetSkeletonStackVariants = cva("flex flex-col", {
  variants: {
    variant: {
      list: "gap-2",
      grid: "gap-1.5",
      media: "gap-1.5",
    },
  },
  defaultVariants: { variant: "grid" },
})

interface TweetPreviewProps extends VariantProps<typeof tweetAvatarVariants> {
  authorUsername: string
  authorDisplayName: string
  authorAvatarUrl: string
  text: string
  media?: MediaItem[]
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
          <div className={tweetAvatarVariants({ variant })}>
            <Image
              src={authorAvatarUrl}
              alt=""
              fill
              sizes={variant === "list" ? "40px" : "32px"}
              className="object-cover"
            />
          </div>
        ) : (
          <div className={tweetAvatarVariants({ variant })} />
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className={tweetDisplayNameVariants({ variant })}>
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

      <p className={tweetBodyVariants({ variant })}>{text}</p>

      {media && media.length > 0 && (
        <BookmarkMedia media={media} variant={variant} context="card" />
      )}
    </div>
  )
}

export function TweetPreviewSkeleton({
  variant = "grid",
}: {
  variant?: ViewMode
}) {
  const lineCount = variant === "list" ? 6 : 4
  const lineWidths = ["w-full", "w-11/12", "w-[96%]", "w-10/12", "w-full", "w-9/12"]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Skeleton
          radius="lg"
          className={tweetSkeletonAvatarVariants({ variant })}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <Skeleton
              radius="lg"
              className={tweetSkeletonNameVariants({ variant })}
            />
            <Skeleton radius="lg" className="h-2.5 w-8" />
          </div>
          <Skeleton radius="lg" className="h-3 w-20" />
        </div>
      </div>

      <div className={tweetSkeletonStackVariants({ variant })}>
        {Array.from({ length: lineCount }).map((_, index) => (
          <Skeleton
            key={index}
            radius="lg"
            className={cn(
              tweetSkeletonLineVariants({ variant }),
              lineWidths[index % lineWidths.length]
            )}
          />
        ))}
      </div>
    </div>
  )
}
