"use client"

import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"

function normalizeTimestamp(value: string | number | null) {
  if (value == null) {
    return null
  }

  if (typeof value === "number") {
    return value
  }

  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? null : parsed
}

export function useSyncStatus(initialLastSyncAt: string | number | null = null) {
  const syncState = useQuery(api.syncState.getCurrent)

  return {
    syncState,
    lastSyncAt: syncState?.lastSyncAt ?? normalizeTimestamp(initialLastSyncAt),
    nextRecommendedSyncAt: syncState?.nextRecommendedSyncAt ?? null,
  }
}
