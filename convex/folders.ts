import { v } from "convex/values"

import type { Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import type { QueryCtx } from "./_generated/server"
import { getAuthenticatedUser, requireAuthenticatedUser } from "./auth"

async function getSidebarData(ctx: QueryCtx, userId: Id<"users">) {
  const [folders, bookmarks, memberships] = await Promise.all([
    ctx.db
      .query("folders")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect(),
    ctx.db
      .query("bookmarks")
      .withIndex("by_userId_bookmarkedAt", (q) => q.eq("userId", userId))
      .collect(),
    ctx.db
      .query("bookmarkFolders")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect(),
  ])

  const folderCounts = new Map<Id<"folders">, number>()
  for (const membership of memberships) {
    folderCounts.set(
      membership.folderId,
      (folderCounts.get(membership.folderId) ?? 0) + 1,
    )
  }

  const foldersWithCounts = folders
    .map((folder) => ({
      ...folder,
      bookmarkCount: folderCounts.get(folder._id) ?? 0,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return {
    folders: foldersWithCounts,
    totalBookmarks: bookmarks.length,
  }
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx)
    if (!user) return []

    const { folders } = await getSidebarData(ctx, user._id)
    return folders
  },
})

export const sidebarData = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx)
    if (!user) {
      return {
        folders: [],
        totalBookmarks: 0,
      }
    }

    return getSidebarData(ctx, user._id)
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
