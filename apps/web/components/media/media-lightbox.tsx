"use client"

import { useCallback, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { Dialog, DialogContent } from "@workspace/ui/components/dialog"
import { pickPlayableUrl, type MediaItem } from "./media-utils"

interface MediaLightboxProps {
  items: MediaItem[]
  index: number | null
  onIndexChange: (index: number | null) => void
}

export function MediaLightbox({
  items,
  index,
  onIndexChange,
}: MediaLightboxProps) {
  const isOpen = index !== null
  const activeItem = index !== null ? items[index] : null

  const close = useCallback(() => onIndexChange(null), [onIndexChange])

  const next = useCallback(() => {
    onIndexChange(index === null ? null : (index + 1) % items.length)
  }, [index, items.length, onIndexChange])

  const prev = useCallback(() => {
    onIndexChange(
      index === null ? null : (index - 1 + items.length) % items.length
    )
  }, [index, items.length, onIndexChange])

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      {activeItem && (
        <DialogContent
          showCloseButton={false}
          className="grid size-full max-h-svh max-w-[100vw] place-items-center gap-0 border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-[100vw]"
        >
          <div
            className="relative flex size-full items-center justify-center"
            onClick={close}
          >
            {activeItem.type === "animated_gif" ? (
              <video
                src={pickPlayableUrl(activeItem)}
                poster={activeItem.previewUrl}
                autoPlay
                loop
                muted
                playsInline
                onClick={(e) => e.stopPropagation()}
                className="h-auto max-h-[90vh] w-auto min-w-[min(750px,92vw)] max-w-[92vw] rounded-lg"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeItem.url}
                alt={activeItem.altText ?? ""}
                width={activeItem.width}
                height={activeItem.height}
                onClick={(e) => e.stopPropagation()}
                className="h-auto max-h-[90vh] w-auto min-w-[min(750px,92vw)] max-w-[92vw] rounded-lg"
              />
            )}

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

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    prev()
                  }}
                  className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition hover:bg-background"
                  aria-label="Previous"
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
                  aria-label="Next"
                >
                  <ChevronRight className="size-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded border border-border bg-background/80 px-2 py-1 font-heading text-xs uppercase tracking-wider text-foreground backdrop-blur-sm">
                  {(index ?? 0) + 1} / {items.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
