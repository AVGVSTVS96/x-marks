"use client"

import { useMutation, useQuery } from "convex/react"
import { api } from "@convex/_generated/api"

export function useFolders() {
  return useQuery(api.folders.list)
}

export function useFolderMutations() {
  const create = useMutation(api.folders.create)
  const update = useMutation(api.folders.update)
  const remove = useMutation(api.folders.remove)
  const reorder = useMutation(api.folders.reorder)
  const addBookmark = useMutation(api.folders.addBookmark)
  const removeBookmark = useMutation(api.folders.removeBookmark)

  return { create, update, remove, reorder, addBookmark, removeBookmark }
}
