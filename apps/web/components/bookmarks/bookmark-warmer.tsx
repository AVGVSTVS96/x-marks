"use client"

import { useBookmarks } from "@/hooks/use-bookmarks"
import type { SortDirection, SortField } from "@/lib/constants"
import type { Id } from "@convex/_generated/dataModel"

function BookmarkSubscriber({
  folderId,
  sortField,
  sortDirection,
}: {
  folderId: Id<"folders">
  sortField: SortField
  sortDirection: SortDirection
}) {
  useBookmarks({ folderId, sortBy: sortField, sortDir: sortDirection })
  return null
}

export function BookmarkWarmer({
  folderIds,
  sortField,
  sortDirection,
}: {
  folderIds: ReadonlyArray<Id<"folders">>
  sortField: SortField
  sortDirection: SortDirection
}) {
  return (
    <>
      {folderIds.map((folderId) => (
        <BookmarkSubscriber
          key={folderId}
          folderId={folderId}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      ))}
    </>
  )
}
