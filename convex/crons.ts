import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

crons.interval(
  "refresh sync cadence hints",
  { minutes: 15 },
  internal.syncState.refreshRecommendedSyncAt,
  {},
)

export default crons
