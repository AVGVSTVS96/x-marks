export const VIEW_MODES = ["grid", "list"] as const
export type ViewMode = (typeof VIEW_MODES)[number]

export const SORT_OPTIONS = [
  { value: "bookmarkedAt", label: "Date Saved" },
  { value: "createdAt", label: "Date Posted" },
] as const
export type SortField = (typeof SORT_OPTIONS)[number]["value"]

export const SORT_DIRECTIONS = ["desc", "asc"] as const
export type SortDirection = (typeof SORT_DIRECTIONS)[number]

export const DEFAULT_VIEW_PREFS = {
  viewMode: "grid",
  sortField: "bookmarkedAt",
  sortDirection: "desc",
} as const satisfies {
  viewMode: ViewMode
  sortField: SortField
  sortDirection: SortDirection
}

export const TAG_COLORS = [
  { name: "Blue", value: "#0ea5e9" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Emerald", value: "#10b981" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Slate", value: "#64748b" },
] as const
