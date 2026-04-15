"use client"

import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { forwardRef, useCallback, useEffect, useRef, useState } from "react"

type SmartLinkProps = Omit<
  React.ComponentPropsWithoutRef<typeof NextLink>,
  "href" | "prefetch"
> & {
  eager?: boolean
  href: string
  prefetchDelayMs?: number
}

function isModifiedEvent(event: {
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
}) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") {
    ref(value)
    return
  }

  if (ref) {
    ref.current = value
  }
}

export const SmartLink = forwardRef<HTMLAnchorElement, SmartLinkProps>(
  function SmartLink(
    {
      eager = false,
      href,
      onClick,
      onFocus,
      onMouseDown,
      onMouseEnter,
      prefetchDelayMs = 300,
      scroll,
      children,
      ...props
    },
    forwardedRef,
  ) {
    const router = useRouter()
    const [anchorElement, setAnchorElement] = useState<HTMLAnchorElement | null>(
      null,
    )
    const timerRef = useRef<number | null>(null)
    const pressedRef = useRef(false)

    const setAnchorRef = useCallback(
      (node: HTMLAnchorElement | null) => {
        setAnchorElement(node)
        assignRef(forwardedRef, node)
      },
      [forwardedRef],
    )

    const clearPrefetchTimer = useCallback(() => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }, [])

    const prefetchNow = useCallback(() => {
      clearPrefetchTimer()
      router.prefetch(href)
    }, [clearPrefetchTimer, href, router])

    const schedulePrefetch = useCallback(() => {
      clearPrefetchTimer()
      timerRef.current = window.setTimeout(() => {
        router.prefetch(href)
        timerRef.current = null
      }, prefetchDelayMs)
    }, [clearPrefetchTimer, href, prefetchDelayMs, router])

    useEffect(() => {
      if (!eager) {
        return
      }

      schedulePrefetch()
      return clearPrefetchTimer
    }, [clearPrefetchTimer, eager, schedulePrefetch])

    useEffect(() => {
      if (!anchorElement) {
        return
      }

      const observer = new IntersectionObserver((entries) => {
        if (!entries[0]?.isIntersecting) {
          return
        }

        schedulePrefetch()
        observer.disconnect()
      })

      observer.observe(anchorElement)

      return () => {
        observer.disconnect()
      }
    }, [anchorElement, schedulePrefetch])

    return (
      <NextLink
        {...props}
        href={href}
        prefetch={false}
        ref={setAnchorRef}
        scroll={scroll}
        onFocus={(event) => {
          schedulePrefetch()
          onFocus?.(event)
        }}
        onMouseEnter={(event) => {
          prefetchNow()
          onMouseEnter?.(event)
        }}
        onMouseDown={(event) => {
          onMouseDown?.(event)

          if (
            event.button !== 0 ||
            event.defaultPrevented ||
            isModifiedEvent(event)
          ) {
            return
          }

          event.preventDefault()
          pressedRef.current = true
          router.push(href, { scroll })
        }}
        onClick={(event) => {
          if (pressedRef.current) {
            event.preventDefault()
            pressedRef.current = false
          }

          onClick?.(event)
        }}
      >
        {children}
      </NextLink>
    )
  },
)
