"use client"

import React from "react"

import { redirect } from "next/navigation"

export default function Home() {
  // Use a more stable approach for redirection
  // This helps prevent potential resize observer issues during navigation
  React.useEffect(() => {
    redirect("/login")
  }, [])

  // Return a minimal placeholder while redirecting
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}
