import { v } from "convex/values"
import { mutation } from "./_generated/server"
import { internal } from "./_generated/api"
import { requireAuthenticatedUser } from "./auth"

export const startInitialSync = mutation({
  args: {
    xAccessToken: v.string(),
    xUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx)

    const syncState = await ctx.db
      .query("syncState")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique()

    if (syncState?.status === "syncing") {
      return { status: "already_syncing" as const }
    }

    if (syncState) {
      await ctx.db.patch(syncState._id, {
        status: "syncing",
        error: undefined,
        progress: {
          phase: "bookmarks",
          current: 0,
          total: 0,
        },
      })
    } else {
      await ctx.db.insert("syncState", {
        userId: user._id,
        status: "syncing",
        progress: {
          phase: "bookmarks",
          current: 0,
          total: 0,
        },
      })
    }

    await ctx.scheduler.runAfter(0, internal.syncActions.initialSync, {
      userId: user._id,
      xAccessToken: args.xAccessToken,
      xUserId: args.xUserId,
    })

    return { status: "scheduled" as const }
  },
})
