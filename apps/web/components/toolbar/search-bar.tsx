"use client"

import { Search } from "lucide-react"
import { useEffect, useRef } from "react"

import { Input } from "@workspace/ui/components/input"

export function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        inputRef.current?.focus()
      }
      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        onChange("")
        inputRef.current?.blur()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onChange])

  return (
    <div className="relative max-w-sm flex-1">
      <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search bookmarks..."
        className="h-8 rounded-lg pl-8 text-sm"
      />
      {!value ? (
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 font-heading text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      ) : null}
    </div>
  )
}
