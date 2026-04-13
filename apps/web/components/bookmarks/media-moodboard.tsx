"use client"

import Image from "next/image"
import { Play } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import type { Doc, Id } from "@convex/_generated/dataModel"

type MediaItem = Doc<"bookmarks">["media"][number]

interface MediaMoodboardProps {
  bookmarks: Doc<"bookmarks">[]
  activeBookmarkId: Id<"bookmarks"> | null
  onBookmarkSelect: (bookmarkId: Id<"bookmarks">, mediaIndex: number) => void
}

interface Tile {
  key: string
  bookmarkId: Id<"bookmarks">
  mediaIndex: number
  item: MediaItem
  isActive: boolean
}

function buildTiles(
  bookmarks: Doc<"bookmarks">[],
  activeBookmarkId: Id<"bookmarks"> | null,
): Tile[] {
  const tiles: Tile[] = []
  for (const bookmark of bookmarks) {
    bookmark.media.forEach((item, index) => {
      tiles.push({
        key: `${bookmark._id}:${index}`,
        bookmarkId: bookmark._id,
        mediaIndex: index,
        item,
        isActive: activeBookmarkId === bookmark._id,
      })
    })
  }
  return tiles
}

function formatDuration(ms: number) {
  const total = Math.round(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function pickPlayableUrl(item: MediaItem) {
  const mp4 = item.variants
    ?.filter((v) => v.contentType === "video/mp4" && v.url)
    .sort((a, b) => (b.bitRate ?? 0) - (a.bitRate ?? 0))[0]?.url
  return mp4 ?? item.url
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
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
            No media
          </p>
          <p className="text-xs text-muted-foreground">
            None of your bookmarks have photos or videos yet
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div
        className={cn(
          "mx-auto w-full max-w-[1560px] px-4 py-5",
          "columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4",
        )}
      >
        {tiles.map((tile) => (
          <MoodboardTile
            key={tile.key}
            tile={tile}
            onClick={() => onBookmarkSelect(tile.bookmarkId, tile.mediaIndex)}
          />
        ))}
      </div>
    </div>
  )
}

function MoodboardTile({
  tile,
  onClick,
}: {
  tile: Tile
  onClick: () => void
}) {
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
        isActive && "border-foreground",
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
            <span className="absolute bottom-1.5 right-1.5 rounded border border-border bg-background/80 px-1.5 py-0.5 font-heading text-[10px] leading-none text-foreground backdrop-blur-sm">
              {formatDuration(item.durationMs)}
            </span>
          )}
        </>
      )}

      {isGif && (
        <span className="absolute bottom-1.5 right-1.5 rounded border border-border bg-background/80 px-1.5 py-0.5 font-heading text-[10px] leading-none text-foreground backdrop-blur-sm">
          GIF
        </span>
      )}
    </button>
  )
}
