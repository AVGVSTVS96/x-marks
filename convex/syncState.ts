import { query } from "./_generated/server"
import { getAuthenticatedUser } from "./auth"

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
