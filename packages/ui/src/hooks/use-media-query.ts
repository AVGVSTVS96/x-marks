"use client"

import * as React from "react"

export function useMediaQuery(query: string): boolean {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => {}
      }

      const mql = window.matchMedia(query)
      mql.addEventListener("change", onStoreChange)

      return () => mql.removeEventListener("change", onStoreChange)
    },
    () => {
      if (typeof window === "undefined") {
        return false
      }

      return window.matchMedia(query).matches
    },
    () => false
  )
}
