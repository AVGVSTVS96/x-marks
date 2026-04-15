"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react"

import { DEFAULT_VIEW_PREFS } from "@/lib/constants"
import {
  normalizeViewPrefs,
  parseViewPrefs,
  VIEW_PREFS_COOKIE_NAME,
  VIEW_PREFS_STORAGE_KEY,
  type ViewPrefs,
} from "@/lib/view-prefs"

const listeners = new Set<() => void>()
const ViewPrefsContext = createContext<ViewPrefs>(DEFAULT_VIEW_PREFS)

let cachedRaw: string | null = null
let cachedPrefs: ViewPrefs = DEFAULT_VIEW_PREFS

function readStoredPrefs(fallback: ViewPrefs): ViewPrefs {
  if (typeof window === "undefined") {
    return fallback
  }

  const stored = window.localStorage.getItem(VIEW_PREFS_STORAGE_KEY)
  if (stored === cachedRaw) {
    return cachedPrefs
  }

  cachedRaw = stored
  if (!stored) {
    cachedPrefs = fallback
    return cachedPrefs
  }

  cachedPrefs = parseViewPrefs(stored)
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
    if (event.key === VIEW_PREFS_STORAGE_KEY) {
      onStoreChange()
    }
  }

  window.addEventListener("storage", handleStorage)

  return () => {
    listeners.delete(onStoreChange)
    window.removeEventListener("storage", handleStorage)
  }
}

interface ViewPrefsProviderProps {
  initialPrefs: ViewPrefs
  children: React.ReactNode
}

export function ViewPrefsProvider({
  initialPrefs,
  children,
}: ViewPrefsProviderProps) {
  const value = useMemo(() => normalizeViewPrefs(initialPrefs), [initialPrefs])

  return (
    <ViewPrefsContext.Provider value={value}>
      {children}
    </ViewPrefsContext.Provider>
  )
}

export function useViewPrefs() {
  const initialPrefs = useContext(ViewPrefsContext)
  const prefs = useSyncExternalStore(
    subscribe,
    () => readStoredPrefs(initialPrefs),
    () => initialPrefs,
  )

  const updatePrefs = useCallback((updates: Partial<ViewPrefs>) => {
    if (typeof window === "undefined") {
      return
    }

    const next = normalizeViewPrefs({
      ...readStoredPrefs(initialPrefs),
      ...updates,
    })
    const serialized = JSON.stringify(next)

    window.localStorage.setItem(VIEW_PREFS_STORAGE_KEY, serialized)
    document.cookie = `${VIEW_PREFS_COOKIE_NAME}=${encodeURIComponent(serialized)}; Path=/; SameSite=Lax; Max-Age=31536000`
    notifyListeners()
  }, [initialPrefs])

  return { ...prefs, updatePrefs }
}
