import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import type { Doc, Id } from "./_generated/dataModel"
import type { QueryCtx } from "./_generated/server"
import { getAuthenticatedUser, requireAuthenticatedUser } from "./auth"
import { compareBookmarks } from "./lib/compareBookmarks"

async function enrichBookmarks(
  ctx: QueryCtx,
  userId: Id<"users">,
  bookmarks: Doc<"bookmarks">[],
) {
  const bookmarkIds = bookmarks.map((b) => b._id)

  const [allTagJunctions, allFolderJunctions, allNotes] = await Promise.all([
    Promise.all(
      bookmarkIds.map((id) =>
        ctx.db
          .query("bookmarkTags")
          .withIndex("by_bookmarkId", (q) => q.eq("bookmarkId", id))
          .collect(),
      ),
    ),
    Promise.all(
      bookmarkIds.map((id) =>
        ctx.db
          .query("bookmarkFolders")
          .withIndex("by_bookmarkId", (q) => q.eq("bookmarkId", id))
          .collect(),
      ),
    ),
    Promise.all(
      bookmarkIds.map((id) =>
        ctx.db
          .query("notes")
          .withIndex("by_bookmarkId_userId", (q) =>
            q.eq("bookmarkId", id).eq("userId", userId),
          )
          .first(),
      ),
    ),
  ])

  const tagIdSet = new Set(allTagJunctions.flat().map((j) => j.tagId))
  const tagDocs = new Map<Id<"tags">, Doc<"tags">>()
  const folderIdSet = new Set(allFolderJunctions.flat().map((j) => j.folderId))
  const folderDocs = new Map<Id<"folders">, Doc<"folders">>()
  await Promise.all([
    ...[...tagIdSet].map(async (id) => {
      const doc = await ctx.db.get(id)
      if (doc) tagDocs.set(id, doc)
    }),
    ...[...folderIdSet].map(async (id) => {
      const doc = await ctx.db.get(id)
      if (doc) folderDocs.set(id, doc)
    }),
  ])

  return bookmarks.map((b, i) => ({
    ...b,
    tags: (allTagJunctions[i] ?? [])
      .map((j) => tagDocs.get(j.tagId))
      .filter((t): t is Doc<"tags"> => t != null),
    folders: (allFolderJunctions[i] ?? [])
      .map((j) => folderDocs.get(j.folderId))
      .filter((f): f is Doc<"folders"> => f != null),
    hasNote: allNotes[i] != null,
  }))
}

export const list = query({
  args: {
    folderId: v.optional(v.id("folders")),
    sortBy: v.optional(
      v.union(v.literal("bookmarkedAt"), v.literal("createdAt")),
    ),
    sortDir: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx)
    if (!user) return []
    const sortBy = args.sortBy ?? "bookmarkedAt"
    const sortDir = args.sortDir ?? "desc"

    let bookmarks: Doc<"bookmarks">[]

    if (args.folderId) {
      const memberships = await ctx.db
        .query("bookmarkFolders")
        .withIndex("by_folderId_userId", (q) =>
          q.eq("folderId", args.folderId!).eq("userId", user._id),
        )
        .collect()

      const loaded = await Promise.all(
        memberships.map((m) => ctx.db.get(m.bookmarkId)),
      )

      bookmarks = loaded
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .sort((a, b) => compareBookmarks(a, b, sortBy, sortDir))
    } else {
      const all = await ctx.db
        .query("bookmarks")
        .withIndex("by_userId_bookmarkedAt", (q) => q.eq("userId", user._id))
        .collect()

      bookmarks = all.sort((a, b) => compareBookmarks(a, b, sortBy, sortDir))
    }

    return enrichBookmarks(ctx, user._id, bookmarks)
  },
})

export const get = query({
  args: { bookmarkId: v.id("bookmarks") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx)
    if (!user) return null
    const bookmark = await ctx.db.get(args.bookmarkId)

    if (!bookmark || bookmark.userId !== user._id) {
      return null
    }

    const [tagJunctions, note, folderJunctions] = await Promise.all([
      ctx.db
        .query("bookmarkTags")
        .withIndex("by_bookmarkId", (q) => q.eq("bookmarkId", args.bookmarkId))
        .collect(),
      ctx.db
        .query("notes")
        .withIndex("by_bookmarkId_userId", (q) =>
          q.eq("bookmarkId", args.bookmarkId).eq("userId", user._id),
        )
        .first(),
      ctx.db
        .query("bookmarkFolders")
        .withIndex("by_bookmarkId", (q) => q.eq("bookmarkId", args.bookmarkId))
        .collect(),
    ])

    const tags = await Promise.all(tagJunctions.map((j) => ctx.db.get(j.tagId)))
    const folders = await Promise.all(
      folderJunctions.map((j) => ctx.db.get(j.folderId)),
    )

    return {
      ...bookmark,
      tags: tags.filter((t): t is NonNullable<typeof t> => t !== null),
      note: note?.content ?? null,
      folders: folders.filter((f): f is NonNullable<typeof f> => f !== null),
    }
  },
})

export const search = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx)
    if (!user) return []

    if (!args.query.trim()) {
      return []
    }

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withSearchIndex("search_text", (q) => q.search("text", args.query).eq("userId", user._id))
      .take(1024)

    return enrichBookmarks(ctx, user._id, bookmarks)
  },
})

export const updateSortOrder = mutation({
  args: {
    bookmarkId: v.id("bookmarks"),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)
    const bookmark = await ctx.db.get(args.bookmarkId)

    if (!bookmark || bookmark.userId !== user._id) {
      throw new Error("Bookmark not found")
    }

    await ctx.db.patch(args.bookmarkId, { sortOrder: args.sortOrder })
  },
})

export const remove = mutation({
  args: {
    bookmarkId: v.id("bookmarks"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)
    const bookmark = await ctx.db.get(args.bookmarkId)

    if (!bookmark || bookmark.userId !== user._id) {
      throw new Error("Bookmark not found")
    }

    const [tagJunctions, folderJunctions, notes] = await Promise.all([
      ctx.db
        .query("bookmarkTags")
        .withIndex("by_bookmarkId", (q) => q.eq("bookmarkId", args.bookmarkId))
        .collect(),
      ctx.db
        .query("bookmarkFolders")
        .withIndex("by_bookmarkId", (q) => q.eq("bookmarkId", args.bookmarkId))
        .collect(),
      ctx.db
        .query("notes")
        .withIndex("by_bookmarkId_userId", (q) =>
          q.eq("bookmarkId", args.bookmarkId).eq("userId", user._id),
        )
        .collect(),
    ])

    await Promise.all([
      ...tagJunctions.map((j) => ctx.db.delete(j._id)),
      ...folderJunctions.map((j) => ctx.db.delete(j._id)),
      ...notes.map((n) => ctx.db.delete(n._id)),
      ctx.db.delete(args.bookmarkId),
    ])
  },
})
