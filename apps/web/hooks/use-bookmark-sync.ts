"use client"

import { useEffect } from "react"

import { AUTO_SYNC_INTERVAL_MS } from "@/lib/app-view-model"

export function useBookmarkSync() {
  useEffect(() => {
    const runSync = async () => {
      if (typeof window === "undefined" || !navigator.onLine) {
        return
      }

      try {
        await fetch("/api/sync", { method: "POST" })
      } catch {
        return
      }
    }

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void runSync()
      }
    }, AUTO_SYNC_INTERVAL_MS)

    void runSync()

    const onFocus = () => {
      if (document.visibilityState === "visible") {
        void runSync()
      }
    }

    window.addEventListener("focus", onFocus)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener("focus", onFocus)
    }
  }, [])
}
