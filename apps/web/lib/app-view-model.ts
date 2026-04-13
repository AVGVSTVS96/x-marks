export const AUTO_SYNC_INTERVAL_MS = 3 * 60 * 1000
export const AUTO_SYNC_INTERVAL_MINUTES = 3

export type AppViewer = {
  id: string
  username: string
  displayName: string
  emailAddress: string | null
  avatarUrl: string | null
  lastSyncAt: string | null
}

