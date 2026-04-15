import { auth } from "@clerk/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import { Suspense } from "react"

import { api } from "@convex/_generated/api"

import { BookmarkFeedLoading } from "@/components/bookmarks/bookmark-feed-loading"
import { RouteBookmarkFeed } from "@/components/bookmarks/route-bookmark-feed"

export default function AppPage() {
  return (
    <Suspense fallback={<BookmarkFeedLoading />}>
      <AllBookmarksFeed />
    </Suspense>
  )
}

async function AllBookmarksFeed() {
  const { getToken } = await auth()
  const convexToken = await getToken({ template: "convex" })
  const preloadedBookmarks = await preloadQuery(
    api.bookmarks.list,
    {},
    { token: convexToken ?? undefined },
  )

  return <RouteBookmarkFeed preloaded={preloadedBookmarks} />
}
