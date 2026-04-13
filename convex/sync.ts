import { v } from "convex/values"
import { internalMutation, internalQuery } from "./_generated/server"

const RECOMMENDED_SYNC_INTERVAL_MS = 15 * 60 * 1000

export const setSyncState = internalMutation({
  args: {
    userId: v.id("users"),
    status: v.union(
      v.literal("idle"),
      v.literal("syncing"),
      v.literal("error"),
    ),
    error: v.optional(v.string()),
    progress: v.optional(
      v.object({
        phase: v.string(),
        current: v.number(),
        total: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const syncState = await ctx.db
      .query("syncState")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique()

    if (!syncState) return

    await ctx.db.patch(syncState._id, {
      status: args.status,
      error: args.error,
      progress: args.progress,
      ...(args.status === "idle"
        ? {
            lastSyncAt: Date.now(),
            nextRecommendedSyncAt: Date.now() + RECOMMENDED_SYNC_INTERVAL_MS,
          }
        : {}),
    })
  },
})

export const upsertBookmarks = internalMutation({
  args: {
    userId: v.id("users"),
    bookmarks: v.array(
      v.object({
        xTweetId: v.string(),
        text: v.string(),
        authorUsername: v.string(),
        authorDisplayName: v.string(),
        authorAvatarUrl: v.string(),
        media: v.array(
          v.object({
            type: v.string(),
            url: v.string(),
            previewUrl: v.optional(v.string()),
            altText: v.optional(v.string()),
          }),
        ),
        metrics: v.object({
          likes: v.number(),
          retweets: v.number(),
          replies: v.number(),
          bookmarks: v.number(),
          impressions: v.optional(v.number()),
        }),
        entities: v.object({
          urls: v.array(
            v.object({
              url: v.string(),
              expandedUrl: v.string(),
              displayUrl: v.string(),
            }),
          ),
          hashtags: v.array(v.string()),
          mentions: v.array(v.string()),
        }),
        createdAt: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const bookmark of args.bookmarks) {
      const existing = await ctx.db
        .query("bookmarks")
        .withIndex("by_userId_xTweetId", (q) =>
          q.eq("userId", args.userId).eq("xTweetId", bookmark.xTweetId),
        )
        .unique()

      if (existing) {
        await ctx.db.patch(existing._id, {
          text: bookmark.text,
          authorUsername: bookmark.authorUsername,
          authorDisplayName: bookmark.authorDisplayName,
          metrics: bookmark.metrics,
          media: bookmark.media,
          authorAvatarUrl: bookmark.authorAvatarUrl,
          entities: bookmark.entities,
          createdAt: bookmark.createdAt,
        })
      } else {
        await ctx.db.insert("bookmarks", {
          userId: args.userId,
          ...bookmark,
          bookmarkedAt: Date.now(),
          removedFromX: false,
        })
      }
    }
  },
})

export const upsertFolders = internalMutation({
  args: {
    userId: v.id("users"),
    folders: v.array(
      v.object({
        xFolderId: v.string(),
        name: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (let i = 0; i < args.folders.length; i++) {
      const folder = args.folders[i]
      if (!folder) {
        continue
      }

      const existing = await ctx.db
        .query("folders")
        .withIndex("by_userId_xFolderId", (q) =>
          q.eq("userId", args.userId).eq("xFolderId", folder.xFolderId),
        )
        .unique()

      if (existing) {
        await ctx.db.patch(existing._id, { name: folder.name })
      } else {
        await ctx.db.insert("folders", {
          userId: args.userId,
          name: folder.name,
          xFolderId: folder.xFolderId,
          sortOrder: i,
        })
      }
    }
  },
})

export const setFolderMemberships = internalMutation({
  args: {
    userId: v.id("users"),
    xFolderId: v.string(),
    xTweetIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const folder = await ctx.db
      .query("folders")
      .withIndex("by_userId_xFolderId", (q) =>
        q.eq("userId", args.userId).eq("xFolderId", args.xFolderId),
      )
      .unique()

    if (!folder) return

    for (const xTweetId of args.xTweetIds) {
      const bookmark = await ctx.db
        .query("bookmarks")
        .withIndex("by_userId_xTweetId", (q) =>
          q.eq("userId", args.userId).eq("xTweetId", xTweetId),
        )
        .unique()

      if (!bookmark) continue

      const existing = await ctx.db
        .query("bookmarkFolders")
        .withIndex("by_folderId_bookmarkId", (q) =>
          q.eq("folderId", folder._id).eq("bookmarkId", bookmark._id),
        )
        .first()

      if (!existing) {
        await ctx.db.insert("bookmarkFolders", {
          bookmarkId: bookmark._id,
          folderId: folder._id,
          userId: args.userId,
        })
      }
    }
  },
})

export const updateUserLastSync = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { lastSyncAt: Date.now() })
  },
})

export const getSyncStatus = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("syncState")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique()
  },
})
