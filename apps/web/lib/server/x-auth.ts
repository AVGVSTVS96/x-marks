type XOAuthProvider = "x" | "twitter"

export interface XAccount {
  provider?: string | null
  providerUserId: string
  username?: string | null
  imageUrl?: string | null
  approvedScopes?: string | string[] | null
}

type ClerkOauthClient = {
  users: {
    getUserOauthAccessToken: (
      userId: string,
      provider: XOAuthProvider
    ) => Promise<{
      data?: Array<{
        token?: string | null
      }>
    }>
  }
}

export function isXProvider(provider: string | null | undefined) {
  return (
    provider === "x" ||
    provider === "twitter" ||
    provider === "oauth_x" ||
    provider === "oauth_twitter"
  )
}

export function getLinkedXAccount(accounts: XAccount[] | null | undefined) {
  return accounts?.find((account) => isXProvider(account.provider)) ?? null
}

function normalizeXProviderForOauthToken(provider: string | null | undefined) {
  if (provider === "twitter" || provider === "oauth_twitter") {
    return "twitter"
  }

  return "x"
}

function getApprovedScopes(account: XAccount) {
  if (typeof account.approvedScopes === "string") {
    return account.approvedScopes.split(/\s+/).filter(Boolean)
  }

  return Array.isArray(account.approvedScopes) ? account.approvedScopes : []
}

export async function getXAccessToken(
  clerk: ClerkOauthClient,
  userId: string,
  account: XAccount
) {
  const approvedScopes = getApprovedScopes(account)

  if (!approvedScopes.includes("bookmark.read")) {
    return {
      ok: false as const,
      error:
        "Your X connection is missing the `bookmark.read` scope. Reconnect X with bookmark access enabled.",
    }
  }

  const provider = normalizeXProviderForOauthToken(account.provider)
  const fallbackProvider = provider === "x" ? "twitter" : "x"

  const primaryTokenResponse = await clerk.users.getUserOauthAccessToken(
    userId,
    provider
  )
  let accessToken = primaryTokenResponse.data?.[0]?.token ?? null

  if (!accessToken) {
    const fallbackTokenResponse = await clerk.users.getUserOauthAccessToken(
      userId,
      fallbackProvider
    )
    accessToken = fallbackTokenResponse.data?.[0]?.token ?? null
  }

  if (!accessToken) {
    return {
      ok: false as const,
      error:
        "X OAuth token not available from Clerk. Reconnect your X account and ensure OAuth access tokens are enabled.",
    }
  }

  return {
    ok: true as const,
    accessToken,
  }
}
