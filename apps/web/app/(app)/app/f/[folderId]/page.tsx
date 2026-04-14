import type { Id } from "@convex/_generated/dataModel"

import { RouteBookmarkFeed } from "@/components/bookmarks/route-bookmark-feed"

export default async function FolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>
}) {
  const { folderId } = await params

  return <RouteBookmarkFeed folderId={folderId as Id<"folders">} />
}
