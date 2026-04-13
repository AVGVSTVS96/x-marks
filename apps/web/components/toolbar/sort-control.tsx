"use client"

import { ArrowDown, ArrowUp } from "lucide-react"

import { useViewPrefs } from "@/hooks/use-view-prefs"
import { SORT_OPTIONS, type SortField } from "@/lib/constants"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export function SortControl() {
  const { sortField, sortDirection, updatePrefs } = useViewPrefs()

  return (
    <div className="flex items-center gap-1.5">
      <Label variant="eyebrow" className="font-heading">Sort</Label>
      <Select
        value={sortField}
        onValueChange={(value) => updatePrefs({ sortField: value as SortField })}
      >
        <SelectTrigger className="h-7 w-auto gap-1 rounded-lg border-none px-2 text-xs shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-lg">
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon-xs"
        radius="lg"
        aria-label={
          sortDirection === "desc"
            ? "Switch to ascending sort"
            : "Switch to descending sort"
        }
        onClick={() =>
          updatePrefs({
            sortDirection: sortDirection === "desc" ? "asc" : "desc",
          })
        }
      >
        {sortDirection === "desc" ? (
          <ArrowDown className="size-3.5" />
        ) : (
          <ArrowUp className="size-3.5" />
        )}
      </Button>
    </div>
  )
}
