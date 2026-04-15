import {
  DEFAULT_VIEW_PREFS,
  VIEW_MODES,
  type SortDirection,
  type SortField,
  type ViewMode,
} from "@/lib/constants"

export interface ViewPrefs {
  viewMode: ViewMode
  sortField: SortField
  sortDirection: SortDirection
}

export const VIEW_PREFS_STORAGE_KEY = "xmarks-view-prefs"
export const VIEW_PREFS_COOKIE_NAME = VIEW_PREFS_STORAGE_KEY

export function isViewMode(value: unknown): value is ViewMode {
  return VIEW_MODES.includes(value as ViewMode)
}

export function normalizeViewPrefs(
  value: Partial<ViewPrefs> | null | undefined,
): ViewPrefs {
  return {
    viewMode: isViewMode(value?.viewMode)
      ? value.viewMode
      : DEFAULT_VIEW_PREFS.viewMode,
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

export function parseViewPrefs(raw: string | null | undefined): ViewPrefs {
  if (!raw) {
    return DEFAULT_VIEW_PREFS
  }

  try {
    return normalizeViewPrefs(JSON.parse(raw) as Partial<ViewPrefs>)
  } catch {
    return DEFAULT_VIEW_PREFS
  }
}
