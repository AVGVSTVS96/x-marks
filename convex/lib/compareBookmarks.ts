export function compareBookmarks(
  a: {
    bookmarkedAt: number
    createdAt: number
    sortOrder?: number
    _creationTime?: number
  },
  b: {
    bookmarkedAt: number
    createdAt: number
    sortOrder?: number
    _creationTime?: number
  },
  sortBy: "bookmarkedAt" | "createdAt",
  sortDir: "asc" | "desc",
) {
  const direction = sortDir === "asc" ? 1 : -1
  const primary = a[sortBy] - b[sortBy]
  if (primary !== 0) return primary * direction

  if (sortBy === "bookmarkedAt") {
    const savedOrderA = a.sortOrder ?? a._creationTime ?? a.createdAt
    const savedOrderB = b.sortOrder ?? b._creationTime ?? b.createdAt
    const savedOrderDiff = savedOrderA - savedOrderB
    if (savedOrderDiff !== 0) return savedOrderDiff * direction
    return (a.createdAt - b.createdAt) * direction
  }

  const savedAtDiff = a.bookmarkedAt - b.bookmarkedAt
  if (savedAtDiff !== 0) return savedAtDiff * direction

  const savedOrderA = a.sortOrder ?? a._creationTime ?? a.createdAt
  const savedOrderB = b.sortOrder ?? b._creationTime ?? b.createdAt
  return (savedOrderA - savedOrderB) * direction
}
