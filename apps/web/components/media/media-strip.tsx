"use client"

import Image from "next/image"
import { Play } from "lucide-react"
import { cva } from "@workspace/ui/lib/cva"

import { MediaBadge } from "./media-badge"
import { formatDuration, pickPlayableUrl, type MediaItem } from "./media-utils"

type MediaSize = "sm" | "md"

const mediaTileVariants = cva(
  "relative overflow-hidden rounded-lg border border-border bg-muted",
  {
    variants: {
      size: {
        sm: "h-28 sm:h-32 xl:h-36",
        md: "h-40 lg:h-52",
      },
      role: {
        item: "flex-1",
        overflow:
          "flex w-14 items-center justify-center font-heading text-xs text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "sm",
      role: "item",
    },
  }
)

interface MediaStripProps {
  media: MediaItem[]
  size?: MediaSize
}

export function MediaStrip({ media, size = "sm" }: MediaStripProps) {
  if (media.length === 0) return null

  const visible = media.slice(0, 2)
  const overflow = media.length - visible.length

  return (
    <div className="flex gap-1 overflow-hidden">
      {visible.map((item, index) => (
        <MediaStripItem key={index} item={item} size={size} />
      ))}
      {overflow > 0 && (
        <div className={mediaTileVariants({ size, role: "overflow" })}>
          +{overflow}
        </div>
      )}
    </div>
  )
}

function MediaStripItem({
  item,
  size,
}: {
  item: MediaItem
  size: MediaSize
}) {
  const isVideo = item.type === "video"
  const isGif = item.type === "animated_gif"
  const poster = item.previewUrl ?? (isVideo || isGif ? "" : item.url)

  return (
    <div className={mediaTileVariants({ size, role: "item" })}>
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
          sizes={size === "md" ? "50vw" : "33vw"}
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
