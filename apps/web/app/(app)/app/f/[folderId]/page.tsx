import { auth } from "@clerk/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import { Suspense } from "react"

import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"

import { BookmarkFeedLoading } from "@/components/bookmarks/bookmark-feed-loading"
import { RouteBookmarkFeed } from "@/components/bookmarks/route-bookmark-feed"

export default function FolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>
}) {
  return (
    <Suspense fallback={<BookmarkFeedLoading />}>
      <FolderBookmarksFeed params={params} />
    </Suspense>
  )
}

async function FolderBookmarksFeed({
  params,
}: {
  params: Promise<{ folderId: string }>
}) {
  const { folderId } = await params
  const { getToken } = await auth()
  const convexToken = await getToken({ template: "convex" })
  const preloadedBookmarks = await preloadQuery(
    api.bookmarks.list,
    { folderId: folderId as Id<"folders"> },
    { token: convexToken ?? undefined },
  )

  return <RouteBookmarkFeed preloaded={preloadedBookmarks} />
}
