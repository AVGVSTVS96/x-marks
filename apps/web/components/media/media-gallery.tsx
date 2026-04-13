"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { MediaBadge } from "./media-badge"
import { MediaLightbox } from "./media-lightbox"
import { MediaPlayer } from "./media-player"
import { pickPlayableUrl, type MediaItem } from "./media-utils"

interface MediaGalleryProps {
  media: MediaItem[]
  lightboxSignal?: { mediaIndex: number; nonce: number } | null
}

export function MediaGallery({ media, lightboxSignal }: MediaGalleryProps) {
  const lightboxItems = media.filter(
    (item) => item.type === "photo" || item.type === "animated_gif"
  )
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!lightboxSignal) return
    const target = media[lightboxSignal.mediaIndex]
    if (!target) return
    const idx = lightboxItems.indexOf(target)
    if (idx >= 0) setLightboxIndex(idx)
    // Only react to nonce changes; media/lightboxItems are derived from the
    // same bookmark and shouldn't re-trigger the lightbox on their own.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxSignal?.nonce])

  return (
    <>
      <div className="flex flex-col gap-2">
        {media.map((item, index) => {
          if (item.type === "photo" || item.type === "animated_gif") {
            const itemIndex = lightboxItems.indexOf(item)
            return (
              <button
                key={index}
                type="button"
                onClick={() => setLightboxIndex(itemIndex)}
                className="group relative block w-full overflow-hidden rounded-lg border border-border bg-muted"
              >
                {item.type === "animated_gif" ? (
                  <video
                    src={pickPlayableUrl(item)}
                    poster={item.previewUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-auto w-full object-contain transition-opacity group-hover:opacity-90"
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt={item.altText ?? ""}
                    width={item.width ?? 1200}
                    height={item.height ?? 800}
                    className="h-auto w-full object-contain transition-opacity group-hover:opacity-90"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                )}
                {item.type === "animated_gif" && <MediaBadge>GIF</MediaBadge>}
              </button>
            )
          }
          return <MediaPlayer key={index} item={item} />
        })}
      </div>

      <MediaLightbox
        items={lightboxItems}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </>
  )
}
