"use client"

import { NotebookText } from "lucide-react"

import type { ViewMode } from "@/lib/constants"
import { TweetPreview } from "./tweet-preview"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import type { Doc } from "@convex/_generated/dataModel"

interface BookmarkCardProps {
  bookmark: Doc<"bookmarks"> & {
    tags: Doc<"tags">[]
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
        "flex rounded-lg border border-border text-left transition-colors hover:bg-muted/50",
        viewMode === "list" ? "flex-col gap-4 p-5 lg:p-6" : "flex-col gap-3 p-4",
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
          "flex items-center gap-3 font-heading uppercase tracking-wider text-muted-foreground",
          viewMode === "list" ? "text-[11px]" : "text-[10px]"
        )}
      >
        <span>{formatCount(bookmark.metrics.likes)} likes</span>
        <span>{formatCount(bookmark.metrics.retweets)} rt</span>
        <span>{formatCount(bookmark.metrics.replies)} replies</span>
      </div>

      <div className="flex items-center gap-2">
        {bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {bookmark.tags.map((tag) => (
              <Badge
                key={tag._id}
                variant="outline"
                className="rounded-md border-current px-1.5 py-0 font-heading text-[10px] uppercase tracking-wider"
                style={{ color: tag.color }}
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
