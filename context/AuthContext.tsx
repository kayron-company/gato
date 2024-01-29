"use client"

import axios from "axios"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import React, { createContext, useContext, useEffect, useState } from "react"
import { initializeFacebook, logoutUserFacebook } from "utils/facebookUtils"

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
  logout: () => Promise<void>
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

  useEffect(() => {
    const fetchData = async () => {
      await initializeFacebook()
    }
    fetchData()
  }, [])

  const router = useRouter()

  const login = (data: Omit<AuthState, "isAuthenticated">) => {
    localStorage.setItem("sessionToken", data.token ?? "")

    setAuthState({
      ...data,
      isAuthenticated: true,
    })
  }

  const logout = async () => {
    try {
      const refreshJti = Cookies.get("RT_refreshTokenJti")

      if (refreshJti) {
        await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/logout`, { refresh_token_jti: refreshJti })
      }

      localStorage.removeItem("sessionToken")
      Cookies.remove("RT_accessToken")
      Cookies.remove("RT_refreshToken")
      Cookies.remove("RT_refreshTokenJti")

      setAuthState({
        token: null,
        isAuthenticated: false,
        user: null,
      })

      await logoutUserFacebook().then(() => router.push("/login"))
    } catch (error) {
      console.error(error)
    }
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
