import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { AUTO_SYNC_INTERVAL_MINUTES } from "@/lib/app-view-model"
import { triggerAppSync } from "@/lib/server/app-session"

export const runtime = "nodejs"

export async function POST() {
  const result = await triggerAppSync()

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(result)
}

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    status: "ready",
    cadenceMinutes: AUTO_SYNC_INTERVAL_MINUTES,
  })
}
