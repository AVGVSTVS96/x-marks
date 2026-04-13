"use client"

import { LayoutGrid, Rows3 } from "lucide-react"

import type { ViewMode } from "@/lib/constants"
import { Toggle } from "@workspace/ui/components/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"

export function ViewToggle({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode
  onViewModeChange: (viewMode: ViewMode) => void
}) {
  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger
          render={
            <Toggle
              pressed={viewMode === "grid"}
              onPressedChange={() => onViewModeChange("grid")}
              size="sm"
              aria-label="Grid view"
              className="rounded-lg"
            />
          }
        >
          <LayoutGrid className="size-4" />
        </TooltipTrigger>
        <TooltipContent>Grid view</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Toggle
              pressed={viewMode === "list"}
              onPressedChange={() => onViewModeChange("list")}
              size="sm"
              aria-label="List view"
              className="rounded-lg"
            />
          }
        >
          <Rows3 className="size-4" />
        </TooltipTrigger>
        <TooltipContent>List view</TooltipContent>
      </Tooltip>
    </div>
  )
}
