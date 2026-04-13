import { v } from "convex/values"
import { internalMutation, query } from "./_generated/server"
import { getAuthenticatedUser } from "./auth"

const RECOMMENDED_SYNC_INTERVAL_MS = 15 * 60 * 1000

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx)
    if (!user) return null

    return await ctx.db
      .query("syncState")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique()
  },
})

export const refreshRecommendedSyncAt = internalMutation({
  args: {
    now: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = args.now ?? Date.now()
    const syncStates = await ctx.db.query("syncState").collect()

    await Promise.all(
      syncStates.map(async (syncState) => {
        if (
          syncState.status !== "idle" ||
          (syncState.nextRecommendedSyncAt ?? 0) > now
        ) {
          return
        }

        await ctx.db.patch(syncState._id, {
          nextRecommendedSyncAt: now + RECOMMENDED_SYNC_INTERVAL_MS,
        })
      }),
    )
  },
})
