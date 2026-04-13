"use client"

import type { ViewMode } from "@/lib/constants"
import { MediaGallery } from "./media-gallery"
import { MediaStrip } from "./media-strip"
import type { MediaItem } from "./media-utils"

interface BookmarkMediaProps {
  media: MediaItem[]
  variant?: ViewMode
  context: "card" | "detail"
  lightboxSignal?: { mediaIndex: number; nonce: number } | null
}

export function BookmarkMedia({
  media,
  variant,
  context,
  lightboxSignal,
}: BookmarkMediaProps) {
  if (media.length === 0) return null

  if (context === "detail") {
    return <MediaGallery media={media} lightboxSignal={lightboxSignal} />
  }

  return <MediaStrip media={media} variant={variant} />
}
