"use client"

import { MediaGallery } from "./media-gallery"
import { MediaStrip } from "./media-strip"
import type { MediaItem } from "./media-utils"

interface BookmarkMediaProps {
  media: MediaItem[]
  context: "card" | "detail"
  size?: "sm" | "md"
  lightboxSignal?: { mediaIndex: number; nonce: number } | null
}

export function BookmarkMedia({
  media,
  context,
  size,
  lightboxSignal,
}: BookmarkMediaProps) {
  if (media.length === 0) return null

  if (context === "detail") {
    return <MediaGallery media={media} lightboxSignal={lightboxSignal} />
  }

  return <MediaStrip media={media} size={size} />
}
