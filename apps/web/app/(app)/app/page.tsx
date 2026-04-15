import { auth } from "@clerk/nextjs/server"
import { preloadQuery } from "convex/nextjs"

import { api } from "@convex/_generated/api"

import { RouteBookmarkFeed } from "@/components/bookmarks/route-bookmark-feed"

export default async function AppPage() {
  const { getToken } = await auth()
  const convexToken = await getToken({ template: "convex" })
  const preloadedBookmarks = await preloadQuery(
    api.bookmarks.list,
    {},
    { token: convexToken ?? undefined },
  )

  return <RouteBookmarkFeed preloaded={preloadedBookmarks} />
}
