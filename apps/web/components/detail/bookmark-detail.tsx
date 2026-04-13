"use client"

import { X } from "lucide-react"

import { useBookmarkDetail } from "@/hooks/use-bookmarks"
import { BookmarkActions } from "./bookmark-actions"
import { NoteEditor } from "./note-editor"
import { sectionLabelClasses } from "./section-label"
import { TagManager } from "./tag-manager"
import { BookmarkMedia } from "@/components/bookmarks/bookmark-media"
import { TweetPreview } from "@/components/bookmarks/tweet-preview"
import { Button } from "@workspace/ui/components/button"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import type { Id } from "@convex/_generated/dataModel"

interface BookmarkDetailProps {
  bookmarkId: Id<"bookmarks">
  onClose: () => void
}

export function BookmarkDetail({ bookmarkId, onClose }: BookmarkDetailProps) {
  const bookmark = useBookmarkDetail(bookmarkId)

  return (
    <div className="flex w-full shrink-0 flex-col border-l border-border bg-background lg:w-[clamp(18rem,40%,28rem)] xl:w-[min(38vw,32rem)] 2xl:w-[min(34vw,36rem)]">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className={sectionLabelClasses}>Detail</span>
        <Button variant="ghost" size="icon-xs" className="rounded-lg" onClick={onClose}>
          <X className="size-3.5" />
        </Button>
      </div>

      {bookmark === undefined ? (
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-32 rounded-lg" />
              <Skeleton className="h-3 w-20 rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      ) : bookmark === null ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Bookmark not found</p>
        </div>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-4 p-4">
            <TweetPreview
              authorUsername={bookmark.authorUsername}
              authorDisplayName={bookmark.authorDisplayName}
              authorAvatarUrl={bookmark.authorAvatarUrl}
              text={bookmark.text}
              media={[]}
              timeAgo={formatDate(bookmark.createdAt)}
              variant="list"
            />

            {bookmark.media.length > 0 && (
              <BookmarkMedia
                media={bookmark.media}
                variant="list"
                context="detail"
              />
            )}

            <div className="flex gap-4 font-heading text-xs uppercase tracking-wider text-muted-foreground">
              <span>{bookmark.metrics.likes} likes</span>
              <span>{bookmark.metrics.retweets} rt</span>
              <span>{bookmark.metrics.replies} replies</span>
            </div>

            <Separator />

            <div>
              <h3 className={cn(sectionLabelClasses, "mb-2")}>Tags</h3>
              <TagManager bookmarkId={bookmarkId} existingTags={bookmark.tags} />
            </div>

            <Separator />

            <div>
              <h3 className={cn(sectionLabelClasses, "mb-2")}>Note</h3>
              <NoteEditor
                key={bookmarkId}
                bookmarkId={bookmarkId}
                initialContent={bookmark.note ?? ""}
              />
            </div>

            <Separator />

            <BookmarkActions
              bookmarkId={bookmarkId}
              xTweetId={bookmark.xTweetId}
              authorUsername={bookmark.authorUsername}
              onRemoved={onClose}
            />
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
