"use client"

import React, { createContext, useContext, useState } from "react"

interface User {
  email: string
  name: string
  role: string
  permissions: string[]
}

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  user: User | null
}

interface AuthContextType extends AuthState {
  login: (data: Omit<AuthState, "isAuthenticated">) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
    user: null,
  })

  const login = (data: Omit<AuthState, "isAuthenticated">) => {
    localStorage.setItem("sessionToken", data.token ?? "")
    setAuthState({
      ...data,
      isAuthenticated: true,
    })
  }

  const logout = () => {
    localStorage.removeItem("sessionToken")
    setAuthState({
      token: null,
      isAuthenticated: false,
      user: null,
    })
  }

  return <AuthContext.Provider value={{ ...authState, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
