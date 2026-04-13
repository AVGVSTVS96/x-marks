import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getAuthenticatedUser, requireAuthenticatedUser } from "./auth"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx)
    if (!user) return []

    const folders = await ctx.db
      .query("folders")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect()

    const foldersWithCounts = await Promise.all(
      folders.map(async (folder) => {
        const memberships = await ctx.db
          .query("bookmarkFolders")
          .withIndex("by_folderId_userId", (q) =>
            q.eq("folderId", folder._id).eq("userId", user._id),
          )
          .collect()

        return {
          ...folder,
          bookmarkCount: memberships.length,
        }
      }),
    )

    return foldersWithCounts.sort((a, b) => a.sortOrder - b.sortOrder)
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)

    const existing = await ctx.db
      .query("folders")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect()

    const maxSort = existing.reduce((max, f) => Math.max(max, f.sortOrder), -1)

    return await ctx.db.insert("folders", {
      userId: user._id,
      name: args.name,
      sortOrder: maxSort + 1,
      color: args.color,
      icon: args.icon,
    })
  },
})

export const update = mutation({
  args: {
    folderId: v.id("folders"),
    name: v.optional(v.string()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)
    const folder = await ctx.db.get(args.folderId)

    if (!folder || folder.userId !== user._id) {
      throw new Error("Folder not found")
    }

    const updates: Record<string, string | undefined> = {}
    if (args.name !== undefined) updates.name = args.name
    if (args.color !== undefined) updates.color = args.color
    if (args.icon !== undefined) updates.icon = args.icon

    await ctx.db.patch(args.folderId, updates)
  },
})

export const remove = mutation({
  args: {
    folderId: v.id("folders"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)
    const folder = await ctx.db.get(args.folderId)

    if (!folder || folder.userId !== user._id) {
      throw new Error("Folder not found")
    }

    if (folder.xFolderId) {
      throw new Error("Cannot delete a folder synced from X")
    }

    const memberships = await ctx.db
      .query("bookmarkFolders")
      .withIndex("by_folderId_userId", (q) =>
        q.eq("folderId", args.folderId).eq("userId", user._id),
      )
      .collect()

    await Promise.all(memberships.map((m) => ctx.db.delete(m._id)))
    await ctx.db.delete(args.folderId)
  },
})

export const reorder = mutation({
  args: {
    folderIds: v.array(v.id("folders")),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)

    await Promise.all(
      args.folderIds.map(async (folderId, index) => {
        const folder = await ctx.db.get(folderId)
        if (folder && folder.userId === user._id) {
          await ctx.db.patch(folderId, { sortOrder: index })
        }
      }),
    )
  },
})

export const addBookmark = mutation({
  args: {
    folderId: v.id("folders"),
    bookmarkId: v.id("bookmarks"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)

    const existing = await ctx.db
      .query("bookmarkFolders")
      .withIndex("by_folderId_bookmarkId", (q) =>
        q.eq("folderId", args.folderId).eq("bookmarkId", args.bookmarkId),
      )
      .first()

    if (existing) return existing._id

    return await ctx.db.insert("bookmarkFolders", {
      bookmarkId: args.bookmarkId,
      folderId: args.folderId,
      userId: user._id,
    })
  },
})

export const removeBookmark = mutation({
  args: {
    folderId: v.id("folders"),
    bookmarkId: v.id("bookmarks"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)

    const membership = await ctx.db
      .query("bookmarkFolders")
      .withIndex("by_folderId_bookmarkId", (q) =>
        q.eq("folderId", args.folderId).eq("bookmarkId", args.bookmarkId),
      )
      .first()

    if (membership && membership.userId === user._id) {
      await ctx.db.delete(membership._id)
    }
  },
})
