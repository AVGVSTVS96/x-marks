import type { Doc } from "@convex/_generated/dataModel"

export type MediaItem = Doc<"bookmarks">["media"][number]

export function formatDuration(ms: number) {
  const total = Math.round(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function pickPlayableUrl(item: MediaItem) {
  const mp4 = item.variants
    ?.filter((v) => v.contentType === "video/mp4" && v.url)
    .sort((a, b) => (b.bitRate ?? 0) - (a.bitRate ?? 0))[0]?.url
  return mp4 ?? item.url
}
