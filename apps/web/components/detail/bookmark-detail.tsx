"use client"

import { X } from "lucide-react"

import type { BookmarkListItem } from "@/components/layout/app-state-context"
import { useBookmarkDetail } from "@/hooks/use-bookmarks"
import { BookmarkActions } from "./bookmark-actions"
import { NoteEditor } from "./note-editor"
import { TagManager } from "./tag-manager"
import { BookmarkMedia } from "@/components/media/bookmark-media"
import { TweetPreview } from "@/components/bookmarks/tweet-preview"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"

interface BookmarkDetailProps {
  initialBookmark: BookmarkListItem
  lightboxSignal?: { mediaIndex: number; nonce: number } | null
  onClose: () => void
}

export function BookmarkDetail({
  initialBookmark,
  lightboxSignal,
  onClose,
}: BookmarkDetailProps) {
  const bookmarkId = initialBookmark._id
  const fresh = useBookmarkDetail(bookmarkId)

  // Snapshot provides immediate render; fresh data supersedes it as soon as it lands.
  const display = fresh ?? initialBookmark
  const isNoteLoading = fresh === undefined
  const noteContent = fresh?.note ?? null

  if (fresh === null) {
    return (
      <DetailShell onClose={onClose}>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Bookmark not found</p>
        </div>
      </DetailShell>
    )
  }

  return (
    <DetailShell onClose={onClose}>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-4 p-4">
          <TweetPreview
            authorUsername={display.authorUsername}
            authorDisplayName={display.authorDisplayName}
            authorAvatarUrl={display.authorAvatarUrl}
            text={display.text}
            timeAgo={formatDate(display.createdAt)}
            variant="list"
          />

          {display.media.length > 0 && (
            <BookmarkMedia
              media={display.media}
              variant="list"
              context="detail"
              lightboxSignal={lightboxSignal}
            />
          )}

          <div className="flex gap-4 font-heading text-xs uppercase tracking-wider text-muted-foreground">
            <span>{display.metrics.likes} likes</span>
            <span>{display.metrics.retweets} rt</span>
            <span>{display.metrics.replies} replies</span>
          </div>

          <Separator />

          <div>
            <Label variant="eyebrow" className="mb-2">Tags</Label>
            <TagManager bookmarkId={bookmarkId} existingTags={display.tags} />
          </div>

          <Separator />

          <div>
            <Label variant="eyebrow" className="mb-2">Note</Label>
            {isNoteLoading ? (
              <Skeleton radius="lg" className="h-16 w-full" />
            ) : (
              <NoteEditor
                key={bookmarkId}
                bookmarkId={bookmarkId}
                initialContent={noteContent ?? ""}
              />
            )}
          </div>

          <Separator />

          <BookmarkActions
            bookmarkId={bookmarkId}
            xTweetId={display.xTweetId}
            authorUsername={display.authorUsername}
            onRemoved={onClose}
          />
        </div>
      </ScrollArea>
    </DetailShell>
  )
}

function DetailShell({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="flex w-full shrink-0 flex-col border-l border-border bg-background lg:w-[clamp(18rem,40%,28rem)] xl:w-[min(38vw,32rem)] 2xl:w-[min(34vw,36rem)]">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <Label variant="eyebrow">Detail</Label>
        <Button variant="ghost" size="icon-xs" radius="lg" onClick={onClose}>
          <X className="size-3.5" />
        </Button>
      </div>
      {children}
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
