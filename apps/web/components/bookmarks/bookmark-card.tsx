"use client"

import { Folder, NotebookText } from "lucide-react"
import { cva, type VariantProps } from "@workspace/ui/lib/cva"

import type { ViewMode } from "@/lib/constants"
import { TweetPreview, TweetPreviewSkeleton } from "./tweet-preview"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import type { Doc } from "@convex/_generated/dataModel"

const bookmarkCardVariants = cva(
  "flex flex-col rounded-2xl border border-border text-left transition-colors",
  {
    variants: {
      size: {
        sm: "gap-3 p-3",
        md: "gap-4 p-4 lg:p-5",
      },
      interactive: {
        true: "hover:bg-muted/50",
        false: "",
      },
      active: {
        true: "border-foreground bg-muted/50",
        false: "",
      },
    },
    defaultVariants: {
      size: "sm",
      interactive: false,
      active: false,
    },
  }
)

function sizeForViewMode(viewMode: ViewMode): "sm" | "md" {
  return viewMode === "list" ? "md" : "sm"
}

interface BookmarkCardProps extends VariantProps<typeof bookmarkCardVariants> {
  bookmark: Doc<"bookmarks"> & {
    tags: Doc<"tags">[]
    folders: Doc<"folders">[]
    hasNote: boolean
  }
  viewMode: ViewMode
  isActive: boolean
  onClick: () => void
}

export function BookmarkCard({
  bookmark,
  viewMode,
  isActive,
  onClick,
}: BookmarkCardProps) {
  const size = sizeForViewMode(viewMode)
  const timeAgo = formatTimeAgo(bookmark.createdAt)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={bookmarkCardVariants({
        size,
        interactive: true,
        active: isActive,
      })}
    >
      <TweetPreview
        authorUsername={bookmark.authorUsername}
        authorDisplayName={bookmark.authorDisplayName}
        authorAvatarUrl={bookmark.authorAvatarUrl}
        text={bookmark.text}
        media={bookmark.media}
        timeAgo={timeAgo}
        size={size}
      />

      <div className="flex items-center gap-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
        <span>{formatCount(bookmark.metrics.likes)} likes</span>
        <span>{formatCount(bookmark.metrics.retweets)} rt</span>
        <span>{formatCount(bookmark.metrics.replies)} replies</span>
      </div>

      <div className="flex items-center gap-2">
        {(bookmark.folders.length > 0 || bookmark.tags.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {bookmark.folders.map((folder) => (
              <Badge
                key={folder._id}
                variant="secondary"
                className="gap-1.5 text-xs"
              >
                <Folder data-icon="inline-start" />
                {folder.name}
              </Badge>
            ))}
            {bookmark.tags.map((tag) => (
              <Badge
                key={tag._id}
                variant="outline"
                className="font-heading text-xs uppercase tracking-wider"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
        {bookmark.hasNote && (
          <div className="ml-auto flex items-center gap-1 text-muted-foreground">
            <NotebookText className="size-3" />
          </div>
        )}
      </div>
    </button>
  )
}

export function BookmarkCardSkeleton({ viewMode }: { viewMode: ViewMode }) {
  const size = sizeForViewMode(viewMode)
  return (
    <div className={bookmarkCardVariants({ size })}>
      <TweetPreviewSkeleton size={size} />

      <div className="flex items-center gap-3">
        <Skeleton radius="lg" className="h-2.5 w-14" />
        <Skeleton radius="lg" className="h-2.5 w-10" />
        <Skeleton radius="lg" className="h-2.5 w-16" />
      </div>
    </div>
  )
}

function formatTimeAgo(timestamp: number) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  return `${Math.floor(days / 30)}mo`
}

function formatCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}
