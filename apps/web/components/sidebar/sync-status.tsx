"use client"

import { useEffect, useState } from "react"

import { useSyncStatus } from "@/hooks/use-sync-status"
import { StatusDot } from "@workspace/ui/components/status-dot"

export function SyncStatus({
  initialLastSyncAt,
}: {
  initialLastSyncAt: number | null
}) {
  const { lastSyncAt } = useSyncStatus(initialLastSyncAt)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 60_000)

    return () => window.clearInterval(timer)
  }, [])

  const formatSyncTime = (timestamp: number | null, currentTime: number) => {
    if (!timestamp) return "Never"
    const diff = currentTime - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="flex items-center gap-1.5">
      <StatusDot status={lastSyncAt ? "success" : "warning"} pulse />
      <span className="font-heading text-[10px] uppercase tracking-wider text-muted-foreground">
        {formatSyncTime(lastSyncAt, now)}
      </span>
    </div>
  )
}
