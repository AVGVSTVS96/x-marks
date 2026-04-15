import { cookies } from "next/headers"

import { parseViewPrefs, VIEW_PREFS_COOKIE_NAME } from "@/lib/view-prefs"

export async function getServerViewPrefs() {
  const cookieStore = await cookies()
  const raw = cookieStore.get(VIEW_PREFS_COOKIE_NAME)?.value

  return parseViewPrefs(raw ? decodeURIComponent(raw) : raw)
}
