"use client"

import { useCallback, useState } from "react"

import { useNoteMutations } from "@/hooks/use-notes"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import type { Id } from "@convex/_generated/dataModel"

export function NoteEditor({
  bookmarkId,
  initialContent,
}: {
  bookmarkId: Id<"bookmarks">
  initialContent: string
}) {
  const [content, setContent] = useState(initialContent)
  const [isDirty, setIsDirty] = useState(false)
  const { upsert } = useNoteMutations()

  const handleChange = useCallback(
    (value: string) => {
      setContent(value)
      setIsDirty(value !== initialContent)
    },
    [initialContent]
  )

  const handleSave = useCallback(async () => {
    if (!isDirty) return
    await upsert({ bookmarkId, content })
    setIsDirty(false)
  }, [bookmarkId, content, isDirty, upsert])

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={content}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Add a note..."
        className="min-h-[96px] resize-none text-sm"
        onBlur={handleSave}
      />
      {isDirty ? (
        <Button size="xs" className="w-fit rounded-lg" onClick={handleSave}>
          Save
        </Button>
      ) : null}
    </div>
  )
}
