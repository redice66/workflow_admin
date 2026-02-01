"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemesProviderProps } from "next-themes"

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Add a useEffect to handle potential resize observer issues
  React.useEffect(() => {
    // This helps prevent ResizeObserver loops when theme changes cause layout shifts
    const handleResize = () => {
      // Force a reflow to help stabilize layout
      document.body.offsetHeight
    }

    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
