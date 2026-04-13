"use client"

import { ExternalLink, Trash2 } from "lucide-react"
import { useState } from "react"
import { useMutation } from "convex/react"

import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { sectionLabelClasses } from "./section-label"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"

interface BookmarkActionsProps {
  bookmarkId: Id<"bookmarks">
  xTweetId: string
  authorUsername: string
  onRemoved?: () => void
}

export function BookmarkActions({
  bookmarkId,
  xTweetId,
  authorUsername,
  onRemoved,
}: BookmarkActionsProps) {
  const removeBookmark = useMutation(api.bookmarks.remove)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const openOnX = () => {
    window.open(`https://x.com/${authorUsername}/status/${xTweetId}`, "_blank")
  }

  const handleDelete = async () => {
    await removeBookmark({ bookmarkId })
    setConfirmOpen(false)
    onRemoved?.()
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className={cn(sectionLabelClasses, "mb-0")}>Actions</h3>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1 rounded-lg" onClick={openOnX}>
          <ExternalLink className="size-4" />
          View on X
        </Button>
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger
            render={<Button variant="destructive" size="sm" className="gap-1 rounded-lg" />}
          >
            <Trash2 className="size-4" />
            Remove
          </DialogTrigger>
          <DialogContent showCloseButton={false} className="rounded-lg">
            <DialogTitle>Remove bookmark</DialogTitle>
            <DialogDescription>
              This bookmark will be permanently removed from xMarks.
            </DialogDescription>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" size="sm" className="rounded-lg" />}>
                Cancel
              </DialogClose>
              <Button variant="destructive" size="sm" className="rounded-lg" onClick={handleDelete}>
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
