"use client"

import { useCallback, useSyncExternalStore } from "react"

import {
  DEFAULT_VIEW_PREFS,
  type SortDirection,
  type SortField,
  type ViewMode,
} from "@/lib/constants"

interface ViewPrefs {
  viewMode: ViewMode
  sortField: SortField
  sortDirection: SortDirection
}

const STORAGE_KEY = "xmarks-view-prefs"
const listeners = new Set<() => void>()

function normalizePrefs(value: Partial<ViewPrefs> | null | undefined): ViewPrefs {
  return {
    viewMode: value?.viewMode === "list" ? "list" : DEFAULT_VIEW_PREFS.viewMode,
    sortField:
      value?.sortField === "createdAt"
        ? "createdAt"
        : DEFAULT_VIEW_PREFS.sortField,
    sortDirection:
      value?.sortDirection === "asc"
        ? "asc"
        : DEFAULT_VIEW_PREFS.sortDirection,
  }
}

let cachedRaw: string | null = null
let cachedPrefs: ViewPrefs = DEFAULT_VIEW_PREFS

function readStoredPrefs(): ViewPrefs {
  if (typeof window === "undefined") {
    return DEFAULT_VIEW_PREFS
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === cachedRaw) {
    return cachedPrefs
  }

  cachedRaw = stored
  if (!stored) {
    cachedPrefs = DEFAULT_VIEW_PREFS
    return cachedPrefs
  }

  try {
    cachedPrefs = normalizePrefs(JSON.parse(stored) as Partial<ViewPrefs>)
  } catch {
    cachedPrefs = DEFAULT_VIEW_PREFS
  }
  return cachedPrefs
}

function notifyListeners() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {}
  }

  listeners.add(onStoreChange)

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      onStoreChange()
    }
  }

  window.addEventListener("storage", handleStorage)

  return () => {
    listeners.delete(onStoreChange)
    window.removeEventListener("storage", handleStorage)
  }
}

export function useViewPrefs() {
  const prefs = useSyncExternalStore(
    subscribe,
    readStoredPrefs,
    () => DEFAULT_VIEW_PREFS,
  )

  const updatePrefs = useCallback((updates: Partial<ViewPrefs>) => {
    if (typeof window === "undefined") {
      return
    }

    const next = normalizePrefs({ ...readStoredPrefs(), ...updates })
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    notifyListeners()
  }, [])

  return { ...prefs, updatePrefs }
}
