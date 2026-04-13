import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    xUserId: v.string(),
    username: v.string(),
    displayName: v.string(),
    avatarUrl: v.string(),
    xConnectionStatus: v.union(
      v.literal("connected"),
      v.literal("missing"),
      v.literal("error"),
    ),
    xTokenLastCheckedAt: v.optional(v.number()),
    lastSyncAt: v.optional(v.number()),
  }).index("by_clerkId", ["clerkId"]),

  bookmarks: defineTable({
    userId: v.id("users"),
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
    bookmarkedAt: v.number(),
    sortOrder: v.optional(v.number()),
    removedFromX: v.boolean(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_xTweetId", ["userId", "xTweetId"])
    .index("by_userId_bookmarkedAt", ["userId", "bookmarkedAt"])
    .searchIndex("search_text", {
      searchField: "text",
      filterFields: ["userId"],
    }),

  folders: defineTable({
    userId: v.id("users"),
    name: v.string(),
    xFolderId: v.optional(v.string()),
    sortOrder: v.number(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_xFolderId", ["userId", "xFolderId"]),

  bookmarkFolders: defineTable({
    bookmarkId: v.id("bookmarks"),
    folderId: v.id("folders"),
    userId: v.id("users"),
  })
    .index("by_folderId_userId", ["folderId", "userId"])
    .index("by_bookmarkId", ["bookmarkId"])
    .index("by_folderId_bookmarkId", ["folderId", "bookmarkId"]),

  tags: defineTable({
    userId: v.id("users"),
    name: v.string(),
    color: v.string(),
  }).index("by_userId_name", ["userId", "name"]),

  bookmarkTags: defineTable({
    bookmarkId: v.id("bookmarks"),
    tagId: v.id("tags"),
    userId: v.id("users"),
  })
    .index("by_bookmarkId", ["bookmarkId"])
    .index("by_bookmarkId_tagId", ["bookmarkId", "tagId"])
    .index("by_tagId", ["tagId"])
    .index("by_userId", ["userId"]),

  notes: defineTable({
    bookmarkId: v.id("bookmarks"),
    userId: v.id("users"),
    content: v.string(),
  })
    .index("by_bookmarkId_userId", ["bookmarkId", "userId"])
    .index("by_userId", ["userId"]),

  syncState: defineTable({
    userId: v.id("users"),
    status: v.union(
      v.literal("idle"),
      v.literal("syncing"),
      v.literal("error"),
    ),
    lastSyncAt: v.optional(v.number()),
    error: v.optional(v.string()),
    progress: v.optional(
      v.object({
        phase: v.string(),
        current: v.number(),
        total: v.number(),
      }),
    ),
    nextRecommendedSyncAt: v.optional(v.number()),
  }).index("by_userId", ["userId"]),
})
