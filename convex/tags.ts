import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getAuthenticatedUser, requireAuthenticatedUser } from "./auth"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx)
    if (!user) return []

    const tags = await ctx.db
      .query("tags")
      .withIndex("by_userId_name", (q) => q.eq("userId", user._id))
      .collect()

    const tagsWithCounts = await Promise.all(
      tags.map(async (tag) => {
        const junctions = await ctx.db
          .query("bookmarkTags")
          .withIndex("by_tagId", (q) => q.eq("tagId", tag._id))
          .collect()

        return {
          ...tag,
          bookmarkCount: junctions.length,
        }
      }),
    )

    return tagsWithCounts
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)

    const existing = await ctx.db
      .query("tags")
      .withIndex("by_userId_name", (q) =>
        q.eq("userId", user._id).eq("name", args.name),
      )
      .first()

    if (existing) {
      throw new Error(`Tag "${args.name}" already exists`)
    }

    return await ctx.db.insert("tags", {
      userId: user._id,
      name: args.name,
      color: args.color,
    })
  },
})

export const update = mutation({
  args: {
    tagId: v.id("tags"),
    name: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)
    const tag = await ctx.db.get(args.tagId)

    if (!tag || tag.userId !== user._id) {
      throw new Error("Tag not found")
    }

    const updates: Record<string, string | undefined> = {}
    if (args.name !== undefined) updates.name = args.name
    if (args.color !== undefined) updates.color = args.color

    await ctx.db.patch(args.tagId, updates)
  },
})

export const remove = mutation({
  args: {
    tagId: v.id("tags"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)
    const tag = await ctx.db.get(args.tagId)

    if (!tag || tag.userId !== user._id) {
      throw new Error("Tag not found")
    }

    const junctions = await ctx.db
      .query("bookmarkTags")
      .withIndex("by_tagId", (q) => q.eq("tagId", args.tagId))
      .collect()

    await Promise.all(junctions.map((j) => ctx.db.delete(j._id)))
    await ctx.db.delete(args.tagId)
  },
})

export const addToBookmark = mutation({
  args: {
    tagId: v.id("tags"),
    bookmarkId: v.id("bookmarks"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)

    const existing = await ctx.db
      .query("bookmarkTags")
      .withIndex("by_bookmarkId_tagId", (q) =>
        q.eq("bookmarkId", args.bookmarkId).eq("tagId", args.tagId),
      )
      .first()

    if (existing) return existing._id

    return await ctx.db.insert("bookmarkTags", {
      bookmarkId: args.bookmarkId,
      tagId: args.tagId,
      userId: user._id,
    })
  },
})

export const removeFromBookmark = mutation({
  args: {
    tagId: v.id("tags"),
    bookmarkId: v.id("bookmarks"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)

    const junction = await ctx.db
      .query("bookmarkTags")
      .withIndex("by_bookmarkId_tagId", (q) =>
        q.eq("bookmarkId", args.bookmarkId).eq("tagId", args.tagId),
      )
      .first()

    if (junction && junction.userId === user._id) {
      await ctx.db.delete(junction._id)
    }
  },
})

export const bulkTag = mutation({
  args: {
    tagId: v.id("tags"),
    bookmarkIds: v.array(v.id("bookmarks")),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)

    await Promise.all(
      args.bookmarkIds.map(async (bookmarkId) => {
        const existing = await ctx.db
          .query("bookmarkTags")
          .withIndex("by_bookmarkId", (q) => q.eq("bookmarkId", bookmarkId))
          .filter((q) => q.eq(q.field("tagId"), args.tagId))
          .first()

        if (!existing) {
          await ctx.db.insert("bookmarkTags", {
            bookmarkId,
            tagId: args.tagId,
            userId: user._id,
          })
        }
      }),
    )
  },
})
