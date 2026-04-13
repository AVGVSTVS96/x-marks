"use client"

import Image from "next/image"
import { Play } from "lucide-react"

import type { ViewMode } from "@/lib/constants"
import { cn } from "@workspace/ui/lib/utils"
import { MediaBadge } from "./media-badge"
import { formatDuration, pickPlayableUrl, type MediaItem } from "./media-utils"

interface MediaStripProps {
  media: MediaItem[]
  variant?: ViewMode
}

export function MediaStrip({ media, variant = "grid" }: MediaStripProps) {
  if (media.length === 0) return null

  const visible = media.slice(0, 2)
  const overflow = media.length - visible.length

  return (
    <div className="flex gap-1 overflow-hidden">
      {visible.map((item, index) => (
        <MediaStripItem key={index} item={item} variant={variant} />
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            "flex w-14 items-center justify-center rounded-lg border border-border bg-muted font-heading text-xs text-muted-foreground",
            variant === "list" ? "h-40 lg:h-52" : "h-28 sm:h-32 xl:h-36"
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}

function MediaStripItem({
  item,
  variant,
}: {
  item: MediaItem
  variant: ViewMode
}) {
  const isVideo = item.type === "video"
  const isGif = item.type === "animated_gif"
  const poster = item.previewUrl ?? (isVideo || isGif ? "" : item.url)

  return (
    <div
      className={cn(
        "relative flex-1 overflow-hidden rounded-lg border border-border bg-muted",
        variant === "list" ? "h-40 lg:h-52" : "h-28 sm:h-32 xl:h-36"
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
          className="absolute inset-0 size-full object-cover"
        />
      ) : poster ? (
        <Image
          src={poster}
          alt={item.altText ?? ""}
          fill
          sizes={variant === "list" ? "50vw" : "33vw"}
          className="object-cover"
        />
      ) : null}

      {isVideo && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
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
    </div>
  )
}
