"use client"

import { Images, LayoutGrid, Rows3 } from "lucide-react"

import { useViewPrefs } from "@/hooks/use-view-prefs"
import type { ViewMode } from "@/lib/constants"
import { Toggle } from "@workspace/ui/components/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"

const VIEW_OPTIONS: Array<{
  mode: ViewMode
  label: string
  Icon: typeof LayoutGrid
}> = [
  { mode: "grid", label: "Grid view", Icon: LayoutGrid },
  { mode: "list", label: "List view", Icon: Rows3 },
  { mode: "media", label: "Moodboard", Icon: Images },
]

export function ViewToggle() {
  const { viewMode, updatePrefs } = useViewPrefs()

  return (
    <div className="flex items-center">
      {VIEW_OPTIONS.map(({ mode, label, Icon }) => (
        <Tooltip key={mode}>
          <TooltipTrigger
            render={
              <Toggle
                pressed={viewMode === mode}
                onPressedChange={() => updatePrefs({ viewMode: mode })}
                size="sm"
                aria-label={label}
                className="rounded-lg"
              />
            }
          >
            <Icon className="size-4" />
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
