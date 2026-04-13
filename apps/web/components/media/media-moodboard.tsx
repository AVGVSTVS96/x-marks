"use client"

import Image from "next/image"
import { Play } from "lucide-react"

import type { BookmarkListItem } from "@/components/layout/app-state-context"
import { EmptyState } from "@workspace/ui/components/empty-state"
import { cn } from "@workspace/ui/lib/utils"
import type { Id } from "@convex/_generated/dataModel"
import { MediaBadge } from "./media-badge"
import { MoodboardLayout } from "./moodboard-layout"
import {
  formatDuration,
  pickPlayableUrl,
  type MediaItem,
} from "./media-utils"

interface MediaMoodboardProps {
  bookmarks: BookmarkListItem[]
  activeBookmarkId: Id<"bookmarks"> | null
  onBookmarkSelect: (bookmark: BookmarkListItem, mediaIndex: number) => void
}

interface Tile {
  key: string
  bookmark: BookmarkListItem
  mediaIndex: number
  item: MediaItem
  isActive: boolean
}

function buildTiles(
  bookmarks: BookmarkListItem[],
  activeBookmarkId: Id<"bookmarks"> | null
): Tile[] {
  const tiles: Tile[] = []
  for (const bookmark of bookmarks) {
    bookmark.media.forEach((item, index) => {
      tiles.push({
        key: `${bookmark._id}:${index}`,
        bookmark,
        mediaIndex: index,
        item,
        isActive: activeBookmarkId === bookmark._id,
      })
    })
  }
  return tiles
}

export function MediaMoodboard({
  bookmarks,
  activeBookmarkId,
  onBookmarkSelect,
}: MediaMoodboardProps) {
  const tiles = buildTiles(bookmarks, activeBookmarkId)

  if (tiles.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          title={
            <span className="font-heading text-sm uppercase tracking-wider">
              No media
            </span>
          }
          description="None of your bookmarks have photos or videos yet"
          className="gap-2 px-0 py-0"
        />
      </div>
    )
  }

  return (
    <MoodboardLayout>
      {tiles.map((tile) => (
        <MoodboardTile
          key={tile.key}
          tile={tile}
          onClick={() => onBookmarkSelect(tile.bookmark, tile.mediaIndex)}
        />
      ))}
    </MoodboardLayout>
  )
}

function MoodboardTile({ tile, onClick }: { tile: Tile; onClick: () => void }) {
  const { item, isActive } = tile
  const isVideo = item.type === "video"
  const isGif = item.type === "animated_gif"
  const poster = item.previewUrl ?? (isVideo || isGif ? "" : item.url)
  const width = item.width ?? 800
  const height = item.height ?? 800

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative mb-3 block w-full overflow-hidden rounded-sm border border-border bg-muted transition-colors break-inside-avoid hover:border-foreground/40",
        isActive && "border-foreground"
      )}
    >
      {isGif ? (
        <video
          src={pickPlayableUrl(item)}
          poster={item.previewUrl}
          autoPlay
          loop
          muted
          playsInline
          width={width}
          height={height}
          className="block h-auto w-full object-cover"
        />
      ) : poster ? (
        <Image
          src={poster}
          alt={item.altText ?? ""}
          width={width}
          height={height}
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="block h-auto w-full object-cover transition-opacity group-hover:opacity-95"
        />
      ) : (
        <div className="aspect-square w-full" />
      )}

      {isVideo && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-sm">
              <Play className="size-5 translate-x-[1px] fill-foreground text-foreground" />
            </div>
          </div>
          {item.durationMs != null && (
            <MediaBadge>{formatDuration(item.durationMs)}</MediaBadge>
          )}
        </>
      )}

      {isGif && <MediaBadge>GIF</MediaBadge>}
    </button>
  )
}
