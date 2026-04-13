import { auth, clerkClient } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"

import { api } from "@convex/_generated/api"

import type { AppViewer } from "@/lib/app-view-model"
import { getLinkedXAccount, getXAccessToken, type XAccount } from "./x-auth"

type ClerkUserLike = {
  id: string
  username?: string | null
  fullName?: string | null
  imageUrl?: string | null
  emailAddresses?: Array<{
    emailAddress: string
  }>
  externalAccounts?: XAccount[]
}

export type ResolvedAppSession =
  | {
      status: "ready"
      viewer: AppViewer
      shouldSync: boolean
    }
  | {
      status: "missing_x_account" | "sync_unavailable" | "error"
      message: string
    }

function createAuthedConvexClient(token: string) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)
  convex.setAuth(token)
  return convex
}

function toViewer(user: {
  _id: string
  username: string
  displayName: string
  avatarUrl: string
  lastSyncAt?: number | null
  emailAddress?: string | null
}): AppViewer {
  return {
    id: user._id,
    username: user.username,
    displayName: user.displayName,
    emailAddress: user.emailAddress ?? null,
    avatarUrl: user.avatarUrl || null,
    lastSyncAt: user.lastSyncAt ? new Date(user.lastSyncAt).toISOString() : null,
  }
}

async function getClerkUser(userId: string) {
  const client = await clerkClient()
  const user = (await client.users.getUser(userId)) as ClerkUserLike
  return { client, user }
}

export async function resolveAppSession(): Promise<ResolvedAppSession> {
  const { userId, getToken } = await auth()

  if (!userId) {
    return {
      status: "error",
      message: "You must be signed in to open xMarks.",
    }
  }

  const convexToken = await getToken({ template: "convex" })

  if (!convexToken) {
    return {
      status: "error",
      message:
        'Convex auth is not connected to Clerk. Enable the Convex integration or add the Clerk JWT template named "convex".',
    }
  }

  try {
    const { user: clerkUser } = await getClerkUser(userId)
    const xAccount = getLinkedXAccount(clerkUser.externalAccounts)

    if (!xAccount) {
      return {
        status: "missing_x_account",
        message: "Your Clerk account is missing an X connection.",
      }
    }

    const convex = createAuthedConvexClient(convexToken)
    let viewer = await convex.query(api.auth.getCurrentUser, {})

    if (!viewer) {
      await convex.mutation(api.auth.getOrCreateUser, {
        xUserId: xAccount.providerUserId,
        username:
          xAccount.username ?? clerkUser.username ?? `x-${xAccount.providerUserId}`,
        displayName: clerkUser.fullName ?? xAccount.username ?? "xMarks User",
        avatarUrl: xAccount.imageUrl ?? clerkUser.imageUrl ?? "",
      })

      viewer = await convex.query(api.auth.getCurrentUser, {})
    }

    if (!viewer) {
      return {
        status: "error",
        message: "Failed to initialize your xMarks account.",
      }
    }

    const syncState = await convex.query(api.syncState.getCurrent, {})
    const nextRecommendedSyncAt = syncState?.nextRecommendedSyncAt ?? null

    return {
      status: "ready",
      viewer: toViewer({
        ...viewer,
        emailAddress: clerkUser.emailAddresses?.[0]?.emailAddress ?? null,
      }),
      shouldSync:
        !viewer.lastSyncAt ||
        syncState?.status !== "syncing" &&
          (nextRecommendedSyncAt ? nextRecommendedSyncAt <= Date.now() : true),
    }
  } catch (error) {
    console.error("[app-session] failed to resolve app session", error)

    return {
      status: "error",
      message: "Unable to load your xMarks account right now.",
    }
  }
}

export async function triggerAppSync() {
  const { userId, getToken } = await auth()

  if (!userId) {
    return {
      ok: false as const,
      status: 401,
      error: "Unauthorized",
    }
  }

  const convexToken = await getToken({ template: "convex" })

  if (!convexToken) {
    return {
      ok: false as const,
      status: 401,
      error: "Missing Convex auth token",
    }
  }

  try {
    const { client: clerk, user: clerkUser } = await getClerkUser(userId)
    const xAccount = getLinkedXAccount(clerkUser.externalAccounts)

    if (!xAccount) {
      return {
        ok: false as const,
        status: 400,
        error: "X account not linked",
      }
    }

    const xToken = await getXAccessToken(clerk, userId, xAccount)

    if (!xToken.ok) {
      return {
        ok: false as const,
        status: 400,
        error: xToken.error,
      }
    }

    const convex = createAuthedConvexClient(convexToken)

    await convex.mutation(api.auth.getOrCreateUser, {
      xUserId: xAccount.providerUserId,
      username:
        xAccount.username ?? clerkUser.username ?? `x-${xAccount.providerUserId}`,
      displayName: clerkUser.fullName ?? xAccount.username ?? "xMarks User",
      avatarUrl: xAccount.imageUrl ?? clerkUser.imageUrl ?? "",
    })

    const syncState = await convex.query(api.syncState.getCurrent, {})
    const nextRecommendedSyncAt = syncState?.nextRecommendedSyncAt ?? null
    const shouldStartSync =
      syncState?.status !== "syncing" &&
      (!nextRecommendedSyncAt || nextRecommendedSyncAt <= Date.now())

    if (shouldStartSync) {
      await convex.mutation(api.syncStart.startInitialSync, {
        xAccessToken: xToken.accessToken,
        xUserId: xAccount.providerUserId,
      })
    }

    const viewer = await convex.query(api.auth.getCurrentUser, {})

    return {
      ok: true as const,
      status: shouldStartSync ? "sync_scheduled" : "sync_not_needed",
      lastSyncAt:
        viewer?.lastSyncAt ? new Date(viewer.lastSyncAt).toISOString() : null,
      cadenceMinutes: 15,
    }
  } catch (error) {
    return {
      ok: false as const,
      status: 500,
      error: error instanceof Error ? error.message : "Sync failed",
    }
  }
}
