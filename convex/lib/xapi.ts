"use node"

import { Client } from "@xdevplatform/xdk"

export function createXClient(accessToken: string) {
  return new Client({ accessToken })
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
    .map((m) => ({
      type: m.type,
      url: m.url ?? m.previewImageUrl ?? m.preview_image_url ?? "",
      previewUrl: m.previewImageUrl ?? m.preview_image_url,
      altText: m.altText ?? m.alt_text,
    }))

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
