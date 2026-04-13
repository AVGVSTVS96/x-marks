"use node"

import { Client } from "@xdevplatform/xdk"

export function createXClient(accessToken: string) {
  return new Client({ accessToken })
}

interface RawVariant {
  content_type?: string
  contentType?: string
  bit_rate?: number
  bitRate?: number
  url: string
}

interface RawMedia {
  media_key?: string
  mediaKey?: string
  type: string
  url?: string
  preview_image_url?: string
  previewImageUrl?: string
  alt_text?: string
  altText?: string
  variants?: RawVariant[]
  duration_ms?: number
  durationMs?: number
  width?: number
  height?: number
}

interface RawUser {
  id: string
  username: string
  name: string
  profile_image_url?: string
  profileImageUrl?: string
}

interface RawTweet {
  id: string
  text: string
  author_id?: string
  authorId?: string
  created_at?: string
  createdAt?: string
  public_metrics?: {
    like_count?: number
    retweet_count?: number
    reply_count?: number
    bookmark_count?: number
    impression_count?: number
  }
  publicMetrics?: {
    likeCount?: number
    retweetCount?: number
    replyCount?: number
    bookmarkCount?: number
    impressionCount?: number
  }
  entities?: {
    urls?: Array<{
      url: string
      expanded_url?: string
      expandedUrl?: string
      display_url?: string
      displayUrl?: string
    }>
    hashtags?: Array<{ tag: string }>
    mentions?: Array<{ username: string }>
  }
  attachments?: {
    media_keys?: string[]
    mediaKeys?: string[]
  }
}

interface Includes {
  users?: RawUser[]
  media?: RawMedia[]
}

export function parseBookmarkResponse(
  tweet: RawTweet,
  includes: Includes = {},
) {
  const authorId = tweet.authorId ?? tweet.author_id
  const author = includes.users?.find((u) => u.id === authorId)
  const mediaKeys = tweet.attachments?.mediaKeys ?? tweet.attachments?.media_keys ?? []
  const media = mediaKeys
    .map((key) => includes.media?.find((m) => (m.mediaKey ?? m.media_key) === key))
    .filter((m): m is RawMedia => m !== undefined)
    .map((m) => {
      const rawVariants = m.variants ?? []
      const variants = rawVariants.map((variant) => ({
        contentType: variant.contentType ?? variant.content_type ?? "",
        bitRate: variant.bitRate ?? variant.bit_rate,
        url: variant.url,
      }))
      const mp4Variants = variants
        .filter((v) => v.contentType === "video/mp4" && v.url)
        .sort((a, b) => (b.bitRate ?? 0) - (a.bitRate ?? 0))
      const bestMp4Url = mp4Variants[0]?.url
      const previewUrl = m.previewImageUrl ?? m.preview_image_url
      const isPlayable = m.type === "video" || m.type === "animated_gif"
      const url = isPlayable
        ? bestMp4Url ?? previewUrl ?? ""
        : m.url ?? previewUrl ?? ""

      return {
        type: m.type,
        url,
        previewUrl,
        altText: m.altText ?? m.alt_text,
        variants: variants.length > 0 ? variants : undefined,
        durationMs: m.durationMs ?? m.duration_ms,
        width: m.width,
        height: m.height,
      }
    })

  return {
    xTweetId: tweet.id,
    text: tweet.text,
    authorUsername: author?.username ?? "unknown",
    authorDisplayName: author?.name ?? "Unknown",
    authorAvatarUrl: author?.profileImageUrl ?? author?.profile_image_url ?? "",
    media,
    metrics: {
      likes: tweet.publicMetrics?.likeCount ?? tweet.public_metrics?.like_count ?? 0,
      retweets:
        tweet.publicMetrics?.retweetCount ?? tweet.public_metrics?.retweet_count ?? 0,
      replies: tweet.publicMetrics?.replyCount ?? tweet.public_metrics?.reply_count ?? 0,
      bookmarks:
        tweet.publicMetrics?.bookmarkCount ?? tweet.public_metrics?.bookmark_count ?? 0,
      impressions:
        tweet.publicMetrics?.impressionCount ??
        tweet.public_metrics?.impression_count,
    },
    entities: {
      urls: (tweet.entities?.urls ?? []).map((u) => ({
        url: u.url,
        expandedUrl: u.expandedUrl ?? u.expanded_url ?? u.url,
        displayUrl: u.displayUrl ?? u.display_url ?? u.expandedUrl ?? u.expanded_url ?? u.url,
      })),
      hashtags: (tweet.entities?.hashtags ?? []).map((h) => h.tag),
      mentions: (tweet.entities?.mentions ?? []).map((m) => m.username),
    },
    createdAt:
      tweet.createdAt ?? tweet.created_at
        ? new Date(tweet.createdAt ?? tweet.created_at ?? Date.now()).getTime()
        : Date.now(),
  }
}
