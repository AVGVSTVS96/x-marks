"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react"
import Image from "next/image"

import type { ViewMode } from "@/lib/constants"
import { Dialog, DialogContent } from "@workspace/ui/components/dialog"
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
    return <DetailGallery media={media} />
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

function DetailGallery({ media }: { media: MediaItem[] }) {
  const photos = media.filter((item) => item.type === "photo")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const isOpen = lightboxIndex !== null
  const activePhoto = lightboxIndex !== null ? photos[lightboxIndex] : null

  const close = useCallback(() => setLightboxIndex(null), [])
  const next = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i + 1) % photos.length,
      ),
    [photos.length],
  )
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i - 1 + photos.length) % photos.length,
      ),
    [photos.length],
  )

  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next()
      else if (event.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, next, prev])

  return (
    <>
      <div className="flex flex-col gap-2">
        {media.map((item, index) => {
          if (item.type === "photo") {
            const photoIndex = photos.indexOf(item)
            return (
              <button
                key={index}
                type="button"
                onClick={() => setLightboxIndex(photoIndex)}
                className="group relative block w-full overflow-hidden rounded-lg border border-border bg-muted"
              >
                <Image
                  src={item.url}
                  alt={item.altText ?? ""}
                  width={item.width ?? 1200}
                  height={item.height ?? 800}
                  className="h-auto w-full object-contain transition-opacity group-hover:opacity-90"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </button>
            )
          }
          return <DetailMediaItem key={index} item={item} />
        })}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
        {activePhoto && (
          <DialogContent
            showCloseButton={false}
            className="grid size-full max-h-svh max-w-[100vw] place-items-center gap-0 border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-[100vw]"
          >
            <div
              className="relative flex size-full items-center justify-center"
              onClick={close}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto.url}
                alt={activePhoto.altText ?? ""}
                width={activePhoto.width}
                height={activePhoto.height}
                onClick={(e) => e.stopPropagation()}
                className="h-auto max-h-[90vh] w-auto min-w-[min(750px,92vw)] max-w-[92vw] rounded-lg"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  close()
                }}
                className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition hover:bg-background"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      prev()
                    }}
                    className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition hover:bg-background"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      next()
                    }}
                    className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition hover:bg-background"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded border border-border bg-background/80 px-2 py-1 font-heading text-[10px] uppercase tracking-wider text-foreground backdrop-blur-sm">
                    {(lightboxIndex ?? 0) + 1} / {photos.length}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
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

  return null
}
