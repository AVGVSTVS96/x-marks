"use client"

import { Folder, NotebookText } from "lucide-react"

import type { ViewMode } from "@/lib/constants"
import { TweetPreview, TweetPreviewSkeleton } from "./tweet-preview"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import type { Doc } from "@convex/_generated/dataModel"

const cardLayoutClasses = (viewMode: ViewMode) =>
  cn(
    "flex rounded-2xl border border-border text-left transition-colors",
    viewMode === "list" ? "flex-col gap-4 p-4 lg:p-5" : "flex-col gap-3 p-3"
  )

interface BookmarkCardProps {
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
  const timeAgo = formatTimeAgo(bookmark.createdAt)

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        cardLayoutClasses(viewMode),
        "hover:bg-muted/50",
        isActive && "border-foreground bg-muted/50"
      )}
    >
      <TweetPreview
        authorUsername={bookmark.authorUsername}
        authorDisplayName={bookmark.authorDisplayName}
        authorAvatarUrl={bookmark.authorAvatarUrl}
        text={bookmark.text}
        media={bookmark.media}
        timeAgo={timeAgo}
        variant={viewMode}
      />

      <div
        className={cn(
          "flex items-center gap-3 font-heading tracking-wider text-muted-foreground uppercase",
          viewMode === "list" ? "text-[11px]" : "text-[10px]"
        )}
      >
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
                className="gap-1.5 text-[11px]"
              >
                <Folder data-icon="inline-start" />
                {folder.name}
              </Badge>
            ))}
            {bookmark.tags.map((tag) => (
              <Badge
                key={tag._id}
                variant="outline"
                className="font-heading text-[10px] tracking-wider uppercase"
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
  return (
    <div className={cardLayoutClasses(viewMode)}>
      <TweetPreviewSkeleton variant={viewMode} />

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
