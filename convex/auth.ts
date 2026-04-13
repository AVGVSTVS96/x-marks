import { v } from "convex/values"
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server"

type AuthenticatedUserCtx = QueryCtx | MutationCtx

export async function getAuthenticatedUser(ctx: AuthenticatedUserCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    return null
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
    .unique()

  return user
}

export async function requireAuthenticatedUser(ctx: AuthenticatedUserCtx) {
  const user = await getAuthenticatedUser(ctx)
  if (!user) {
    throw new Error("Not authenticated")
  }

  return user
}

export const getOrCreateUser = mutation({
  args: {
    xUserId: v.string(),
    username: v.string(),
    displayName: v.string(),
    avatarUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, {
        username: args.username,
        displayName: args.displayName,
        avatarUrl: args.avatarUrl,
        xConnectionStatus: "connected",
        xTokenLastCheckedAt: Date.now(),
      })
      return existing._id
    }

    const userId = await ctx.db.insert("users", {
      clerkId: identity.tokenIdentifier,
      xUserId: args.xUserId,
      username: args.username,
      displayName: args.displayName,
      avatarUrl: args.avatarUrl,
      xConnectionStatus: "connected",
      xTokenLastCheckedAt: Date.now(),
    })

    await ctx.db.insert("syncState", {
      userId,
      status: "idle",
    })

    return userId
  },
})

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getAuthenticatedUser(ctx)
  },
})
