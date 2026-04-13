import { auth } from "@clerk/nextjs/server"
import { preloadQuery } from "convex/nextjs"

import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"

import { BookmarkFeed } from "@/components/bookmarks/bookmark-feed"
import { DEFAULT_VIEW_PREFS } from "@/lib/constants"

export default async function FolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>
}) {
  const { folderId } = await params
  const { getToken } = await auth()
  const convexToken = await getToken({ template: "convex" })

  const preloadedBookmarks = await preloadQuery(
    api.bookmarks.list,
    {
      folderId: folderId as Id<"folders">,
      sortBy: DEFAULT_VIEW_PREFS.sortField,
      sortDir: DEFAULT_VIEW_PREFS.sortDirection,
    },
    { token: convexToken ?? undefined },
  )

  return <BookmarkFeed preloadedBookmarks={preloadedBookmarks} />
}
