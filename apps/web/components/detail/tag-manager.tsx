"use client"

import { Plus, X } from "lucide-react"
import { useState } from "react"

import { TAG_COLORS } from "@/lib/constants"
import { useTagMutations, useTags } from "@/hooks/use-tags"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import type { Doc, Id } from "@convex/_generated/dataModel"

interface TagManagerProps {
  bookmarkId: Id<"bookmarks">
  existingTags: Doc<"tags">[]
}

export function TagManager({ bookmarkId, existingTags }: TagManagerProps) {
  const allTags = useTags()
  const { create, addToBookmark, removeFromBookmark } = useTagMutations()
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState<
    (typeof TAG_COLORS)[number]["value"]
  >(TAG_COLORS[0].value)

  const existingTagIds = new Set(existingTags.map((tag) => tag._id))
  const unassignedTags = allTags?.filter((tag) => !existingTagIds.has(tag._id)) ?? []

  const handleCreateAndAssign = async () => {
    if (!newTagName.trim()) return
    const tagId = await create({ name: newTagName.trim(), color: newTagColor })
    await addToBookmark({ tagId, bookmarkId })
    setNewTagName("")
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {existingTags.map((tag) => (
          <Badge
            key={tag._id}
            variant="outline"
            radius="md"
            className="gap-1 border-current pr-1 font-heading text-xs uppercase tracking-wider"
            style={{ color: tag.color }}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeFromBookmark({ tagId: tag._id, bookmarkId })}
              className="hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>

      <Popover>
        <PopoverTrigger
          render={<Button variant="ghost" size="xs" className="w-fit gap-1" />}
        >
          <Plus className="size-3.5" />
          Add tag
        </PopoverTrigger>
        <PopoverContent className="w-56 rounded-lg p-3" align="start">
          <div className="flex flex-col gap-2">
            {unassignedTags.length > 0 ? (
              <div className="flex flex-col gap-1">
                <Label render={<span />} variant="eyebrow">Existing</Label>
                <div className="flex flex-wrap gap-1">
                  {unassignedTags.map((tag) => (
                    <button
                      key={tag._id}
                      type="button"
                      onClick={() => addToBookmark({ tagId: tag._id, bookmarkId })}
                    >
                      <Badge
                        variant="outline"
                        radius="md"
                        className="cursor-pointer border-current font-heading text-xs uppercase tracking-wider hover:bg-muted"
                        style={{ color: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <Label render={<span />} variant="eyebrow">Create new</Label>
              <div className="flex gap-1.5">
                <Input
                  value={newTagName}
                  onChange={(event) => setNewTagName(event.target.value)}
                  placeholder="Tag name"
                  className="h-7 text-xs"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void handleCreateAndAssign()
                    }
                  }}
                />
                <Button
                  size="icon-xs"
                  variant="outline"
                  onClick={handleCreateAndAssign}
                  disabled={!newTagName.trim()}
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>
              <div className="flex gap-1">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setNewTagColor(color.value)}
                    className="size-4 rounded-sm border transition-transform hover:scale-110"
                    style={{
                      backgroundColor: color.value,
                      borderColor:
                        newTagColor === color.value ? "var(--foreground)" : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
