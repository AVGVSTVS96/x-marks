"use client"

import { useMutation, useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"

export function useNote(bookmarkId: Id<"bookmarks"> | null) {
  return useQuery(api.notes.get, bookmarkId ? { bookmarkId } : "skip")
}

export function useNoteMutations() {
  const upsert = useMutation(api.notes.upsert)
  const remove = useMutation(api.notes.remove)

  return { upsert, remove }
}
