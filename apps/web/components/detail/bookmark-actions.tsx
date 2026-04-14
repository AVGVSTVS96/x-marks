"use client"

import { ExternalLink, Trash2 } from "lucide-react"
import { useState } from "react"
import { useMutation } from "convex/react"

import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
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
import { Label } from "@workspace/ui/components/label"

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
      <Label render={<span />} variant="eyebrow">Actions</Label>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1" onClick={openOnX}>
          <ExternalLink className="size-4" />
          View on X
        </Button>
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger
            render={<Button variant="destructive" size="sm" className="gap-1" />}
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
              <DialogClose render={<Button variant="outline" size="sm" />}>
                Cancel
              </DialogClose>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
