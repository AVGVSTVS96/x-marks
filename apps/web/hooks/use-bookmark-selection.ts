"use client"

import { useCallback, useState } from "react"

import type { BookmarkListItem } from "@/components/layout/app-state-context"

export interface LightboxSignal {
  mediaIndex: number
  nonce: number
}

export function useBookmarkSelection() {
  const [activeBookmark, setActiveBookmark] = useState<BookmarkListItem | null>(
    null
  )
  const [lightboxSignal, setLightboxSignal] = useState<LightboxSignal | null>(
    null
  )

  const selectBookmark = useCallback(
    (bookmark: BookmarkListItem | null, mediaIndex?: number) => {
      setActiveBookmark(bookmark)
      if (bookmark == null || mediaIndex == null) {
        setLightboxSignal(null)
      } else {
        setLightboxSignal({ mediaIndex, nonce: Date.now() })
      }
    },
    []
  )

  const closeDetail = useCallback(() => {
    setActiveBookmark(null)
    setLightboxSignal(null)
  }, [])

  return {
    activeBookmark,
    lightboxSignal,
    selectBookmark,
    closeDetail,
  }
}
