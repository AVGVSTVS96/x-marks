"use client"

import { SyncStatus } from "./sync-status"

export function SidebarHeaderContent({
  initialLastSyncAt,
}: {
  initialLastSyncAt: string | null
}) {
  return (
    <div className="flex items-center gap-3 px-1">
      <div className="flex flex-col gap-0.5">
        <h1 className="font-heading text-base font-bold uppercase tracking-wider">
          xMarks
        </h1>
      </div>
      <div className="ml-auto">
        <SyncStatus
          initialLastSyncAt={initialLastSyncAt ? Date.parse(initialLastSyncAt) : null}
        />
      </div>
    </div>
  )
}
