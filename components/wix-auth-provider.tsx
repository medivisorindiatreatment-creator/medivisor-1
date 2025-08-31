"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { wixClient } from "@/lib/wixClient"

interface WixAuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const WixAuthContext = createContext<WixAuthContextType | undefined>(undefined)

export function WixAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      // Check if user is already authenticated
      const isLoggedIn = wixClient.auth.loggedIn()
      setIsAuthenticated(isLoggedIn)

      if (!isLoggedIn) {
        // Try to authenticate as a visitor
        await wixClient.auth.generateVisitorTokens()
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async () => {
    try {
      await wixClient.auth.generateVisitorTokens()
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await wixClient.auth.logout()
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    }
  }

  return (
    <WixAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>{children}</WixAuthContext.Provider>
  )
}

export function useWixAuth() {
  const context = useContext(WixAuthContext)
  if (context === undefined) {
    throw new Error("useWixAuth must be used within a WixAuthProvider")
  }
  return context
}
