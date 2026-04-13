import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getAuthenticatedUser, requireAuthenticatedUser } from "./auth"

export const get = query({
  args: {
    bookmarkId: v.id("bookmarks"),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx)
    if (!user) return null

    return await ctx.db
      .query("notes")
      .withIndex("by_bookmarkId_userId", (q) =>
        q.eq("bookmarkId", args.bookmarkId).eq("userId", user._id),
      )
      .first()
  },
})

export const upsert = mutation({
  args: {
    bookmarkId: v.id("bookmarks"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)

    const existing = await ctx.db
      .query("notes")
      .withIndex("by_bookmarkId_userId", (q) =>
        q.eq("bookmarkId", args.bookmarkId).eq("userId", user._id),
      )
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, { content: args.content })
      return existing._id
    }

    return await ctx.db.insert("notes", {
      bookmarkId: args.bookmarkId,
      userId: user._id,
      content: args.content,
    })
  },
})

export const remove = mutation({
  args: {
    bookmarkId: v.id("bookmarks"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)

    const note = await ctx.db
      .query("notes")
      .withIndex("by_bookmarkId_userId", (q) =>
        q.eq("bookmarkId", args.bookmarkId).eq("userId", user._id),
      )
      .first()

    if (note) {
      await ctx.db.delete(note._id)
    }
  },
})
