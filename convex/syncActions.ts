"use node"

import { v } from "convex/values"
import { internalAction, type ActionCtx } from "./_generated/server"
import { internal } from "./_generated/api"
import { createXClient, parseBookmarkResponse } from "./lib/xapi"
import type { Id } from "./_generated/dataModel"

const updateSyncStatus = async (
  ctx: ActionCtx,
  userId: Id<"users">,
  status: "idle" | "syncing" | "error",
  extra: {
    error?: string
    phase?: string
    current?: number
    total?: number
  } = {},
) => {
  await ctx.runMutation(internal.sync.setSyncState, {
    userId,
    status,
    error: extra.error,
    progress:
      extra.phase !== undefined
        ? {
            phase: extra.phase,
            current: extra.current ?? 0,
            total: extra.total ?? 0,
          }
        : undefined,
  })
}

export const initialSync = internalAction({
  args: {
    userId: v.id("users"),
    xAccessToken: v.string(),
    xUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const client = createXClient(args.xAccessToken)

    try {
      await updateSyncStatus(ctx, args.userId, "syncing", {
        phase: "bookmarks",
        current: 0,
        total: 0,
      })

      let paginationToken: string | undefined
      let totalFetched = 0

      do {
        const params = {
          maxResults: 100,
          expansions: ["author_id", "attachments.media_keys"],
          tweetFields: [
            "author_id",
            "created_at",
            "public_metrics",
            "entities",
            "attachments",
          ],
          userFields: ["username", "name", "profile_image_url"],
          mediaFields: [
            "type",
            "url",
            "preview_image_url",
            "alt_text",
            "variants",
            "duration_ms",
            "width",
            "height",
            "public_metrics",
          ],
          paginationToken,
        }

        const response = await client.users.getBookmarks(args.xUserId, params)
        const data = response as unknown as {
          data?: Array<Record<string, unknown>>
          includes?: Record<string, unknown[]>
          meta?: { next_token?: string; result_count?: number }
        }

        if (data.data && data.data.length > 0) {
          const parsed = data.data.map((tweet) =>
            parseBookmarkResponse(tweet as never, (data.includes ?? {}) as never),
          )

          await ctx.runMutation(internal.sync.upsertBookmarks, {
            userId: args.userId,
            bookmarks: parsed,
          })

          totalFetched += data.data.length

          await updateSyncStatus(ctx, args.userId, "syncing", {
            phase: "bookmarks",
            current: totalFetched,
            total: totalFetched,
          })
        }

        paginationToken = data.meta?.next_token
      } while (paginationToken)

      await updateSyncStatus(ctx, args.userId, "syncing", {
        phase: "folders",
        current: 0,
        total: 0,
      })

      const foldersResponse = await client.users.getBookmarkFolders(args.xUserId)
      const foldersData = foldersResponse as unknown as {
        data?: Array<{ id: string; name: string }>
      }

      if (foldersData.data && foldersData.data.length > 0) {
        await ctx.runMutation(internal.sync.upsertFolders, {
          userId: args.userId,
          folders: foldersData.data.map((f) => ({
            xFolderId: f.id,
            name: f.name,
          })),
        })

        for (let i = 0; i < foldersData.data.length; i++) {
          const folder = foldersData.data[i]
          if (!folder) {
            continue
          }

          await updateSyncStatus(ctx, args.userId, "syncing", {
            phase: "folder-contents",
            current: i + 1,
            total: foldersData.data.length,
          })

          const tweetIds: string[] = []

          const folderResponse = await client.users.getBookmarksByFolderId(
            args.xUserId,
            folder.id,
          )
          const folderData = folderResponse as unknown as {
            data?: Array<{ id: string }>
          }

          if (folderData.data) {
            tweetIds.push(...folderData.data.map((t) => t.id))
          }

          if (tweetIds.length > 0) {
            await ctx.runMutation(internal.sync.setFolderMemberships, {
              userId: args.userId,
              xFolderId: folder.id,
              xTweetIds: tweetIds,
            })
          }
        }
      }

      await updateSyncStatus(ctx, args.userId, "idle")

      await ctx.runMutation(internal.sync.updateUserLastSync, {
        userId: args.userId,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown sync error"
      await updateSyncStatus(ctx, args.userId, "error", { error: message })
    }
  },
})
