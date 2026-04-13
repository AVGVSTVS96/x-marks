"use client"

import { Play } from "lucide-react"
import Image from "next/image"

import type { ViewMode } from "@/lib/constants"
import { cn } from "@workspace/ui/lib/utils"

type MediaItem = {
  type: string
  url: string
  previewUrl?: string
  altText?: string
  variants?: Array<{ contentType: string; bitRate?: number; url: string }>
  durationMs?: number
  width?: number
  height?: number
}

interface BookmarkMediaProps {
  media: MediaItem[]
  variant?: ViewMode
  context: "card" | "detail"
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

export function BookmarkMedia({
  media,
  variant = "grid",
  context,
}: BookmarkMediaProps) {
  if (media.length === 0) return null

  if (context === "detail") {
    return (
      <div className="flex flex-col gap-2">
        {media.map((item, index) => (
          <DetailMediaItem key={index} item={item} />
        ))}
      </div>
    )
  }

  const visible = media.slice(0, 2)
  const overflow = media.length - visible.length

  return (
    <div className="flex gap-1 overflow-hidden">
      {visible.map((item, index) => (
        <CardMediaItem key={index} item={item} variant={variant} />
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            "flex w-14 items-center justify-center rounded-lg border border-border bg-muted font-heading text-xs text-muted-foreground",
            variant === "list" ? "h-40 lg:h-52" : "h-28 sm:h-32 xl:h-36",
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}

function CardMediaItem({
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
        variant === "list" ? "h-40 lg:h-52" : "h-28 sm:h-32 xl:h-36",
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
    </div>
  )
}

function DetailMediaItem({ item }: { item: MediaItem }) {
  if (item.type === "video") {
    return (
      <video
        src={pickPlayableUrl(item)}
        poster={item.previewUrl}
        controls
        preload="metadata"
        playsInline
        className="max-h-[70vh] w-full rounded-lg border border-border bg-black object-contain"
      />
    )
  }

  if (item.type === "animated_gif") {
    return (
      <video
        src={pickPlayableUrl(item)}
        poster={item.previewUrl}
        autoPlay
        loop
        muted
        playsInline
        className="max-h-[70vh] w-full rounded-lg border border-border bg-black object-contain"
      />
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border bg-muted">
      <Image
        src={item.url}
        alt={item.altText ?? ""}
        width={item.width ?? 1200}
        height={item.height ?? 800}
        className="h-auto w-full object-contain"
        sizes="(min-width: 1024px) 40vw, 100vw"
      />
    </div>
  )
}
