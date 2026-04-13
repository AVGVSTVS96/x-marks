"use client"

import { useMutation, useQuery } from "convex/react"
import { api } from "@convex/_generated/api"

export function useTags() {
  return useQuery(api.tags.list)
}

export function useTagMutations() {
  const create = useMutation(api.tags.create)
  const update = useMutation(api.tags.update)
  const remove = useMutation(api.tags.remove)
  const addToBookmark = useMutation(api.tags.addToBookmark)
  const removeFromBookmark = useMutation(api.tags.removeFromBookmark)
  const bulkTag = useMutation(api.tags.bulkTag)

  return { create, update, remove, addToBookmark, removeFromBookmark, bulkTag }
}
