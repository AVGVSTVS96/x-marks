"use client"

import { SearchBar } from "./search-bar"
import { SortControl } from "./sort-control"
import { ViewToggle } from "./view-toggle"
import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"

interface ToolbarProps {
  search: {
    value: string
    onChange: (value: string) => void
  }
}

export function Toolbar({ search }: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-2">
      <SidebarTrigger className="-ml-1 rounded-lg" />
      <Separator orientation="vertical" className="mx-1 h-4" />

      <SearchBar value={search.value} onChange={search.onChange} />

      <div className="ml-auto flex items-center gap-1">
        <ViewToggle />
        <Separator orientation="vertical" className="mx-1 h-4" />
        <SortControl />
      </div>
    </div>
  )
}
