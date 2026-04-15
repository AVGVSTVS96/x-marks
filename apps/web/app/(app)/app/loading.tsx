import { BookmarkFeedLoading } from "@/components/bookmarks/bookmark-feed-loading"
import { getServerViewPrefs } from "@/lib/server/view-prefs"

export default async function Loading() {
  const viewPrefs = await getServerViewPrefs()

  return <BookmarkFeedLoading initialViewMode={viewPrefs.viewMode} />
}
