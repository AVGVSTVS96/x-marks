"use client"

import type { ReactNode } from "react"
import { useMemo } from "react"
import { useAuth } from "@clerk/nextjs"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { ConvexReactClient } from "convex/react"

const defaultConvexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

function createClient(url: string) {
  return new ConvexReactClient(url, { expectAuth: true })
}

type ConvexProviderProps = {
  children: ReactNode
  client?: ConvexReactClient
  url?: string
}

export function ConvexProvider({
  children,
  client,
  url,
}: ConvexProviderProps) {
  const resolvedClient = useMemo(() => {
    if (client) {
      return client
    }

    const resolvedUrl = url ?? defaultConvexUrl
    if (!resolvedUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is required for ConvexProvider")
    }

    return createClient(resolvedUrl)
  }, [client, url])

  return (
    <ConvexProviderWithClerk client={resolvedClient} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}

export { createClient as createConvexClient }
