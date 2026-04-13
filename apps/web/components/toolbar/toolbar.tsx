"use client"

import type { SortDirection, SortField, ViewMode } from "@/lib/constants"
import { SearchBar } from "./search-bar"
import { SortControl } from "./sort-control"
import { ViewToggle } from "./view-toggle"
import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"

export function Toolbar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,
}: {
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: ViewMode
  onViewModeChange: (viewMode: ViewMode) => void
  sortField: SortField
  sortDirection: SortDirection
  onSortFieldChange: (sortField: SortField) => void
  onSortDirectionChange: (sortDirection: SortDirection) => void
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-2">
      <SidebarTrigger className="-ml-1 rounded-lg" />
      <Separator orientation="vertical" className="mx-1 h-4" />

      <SearchBar value={searchQuery} onChange={onSearchChange} />

      <div className="ml-auto flex items-center gap-1">
        <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
        <Separator orientation="vertical" className="mx-1 h-4" />
        <SortControl
          sortField={sortField}
          sortDirection={sortDirection}
          onSortFieldChange={onSortFieldChange}
          onSortDirectionChange={onSortDirectionChange}
        />
      </div>
    </div>
  )
}
