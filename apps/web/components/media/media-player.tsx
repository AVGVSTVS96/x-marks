"use client"

import { pickPlayableUrl, type MediaItem } from "./media-utils"

export function MediaPlayer({ item }: { item: MediaItem }) {
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
