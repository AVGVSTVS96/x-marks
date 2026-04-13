"use client"

import { ArrowDown, ArrowUp } from "lucide-react"

import { SORT_OPTIONS, type SortDirection, type SortField } from "@/lib/constants"
import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export function SortControl({
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,
}: {
  sortField: SortField
  sortDirection: SortDirection
  onSortFieldChange: (sortField: SortField) => void
  onSortDirectionChange: (sortDirection: SortDirection) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-heading text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Sort
      </span>
      <Select
        value={sortField}
        onValueChange={(value) => onSortFieldChange(value as SortField)}
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
        className="rounded-lg"
        aria-label={
          sortDirection === "desc"
            ? "Switch to ascending sort"
            : "Switch to descending sort"
        }
        onClick={() =>
          onSortDirectionChange(sortDirection === "desc" ? "asc" : "desc")
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
