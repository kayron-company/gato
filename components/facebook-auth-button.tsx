"use client"

import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "context/AuthContext"
import { initializeFacebook, loginUserFacebook } from "utils/facebookUtils"
import { Icons } from "./icons"
import { Button } from "./ui/button"

declare global {
  interface Window {
    FB: any
  }
}

interface UserSession {
  user: {
    email: string
    name: string
    permissions: string[]
    role: string
    acessTokenFacebook: string
    pageIds: string[]
  }
  sessionToken: string
}

export default function FacebookSignInButton() {
  const { login } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleFBLogin = async () => {
    setIsLoading(true)
    try {
      const accessToken = await loginUserFacebook()
      await authenticateUser(accessToken)
    } catch (error) {
      console.error("Erro ao logar com o Facebook:", error)
      setIsLoading(false)
    }
  }

  async function authenticateUser(accessToken: string) {
    try {
      const response = await fetch("http://localhost:5000/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      })

      if (!response.ok) {
        throw new Error("Falha na autenticação com o backend")
      }

      const data = (await response.json()) as UserSession

      Cookies.set("RT_sessionToken", data.sessionToken, { secure: true, sameSite: "strict" })
      Cookies.set("RT_user", JSON.stringify(data.user), { secure: true, sameSite: "strict" })

      login({
        token: data.sessionToken,
        user: {
          name: data.user.name,
          email: data.user.email,
          permissions: data.user.permissions,
          role: data.user.role,
        },
      })

      router.push("/dashboard")
    } catch (error) {
      setIsLoading(false)
      console.error("Erro na autenticação:", error)
    }
  }

  const Spinner = () => <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>

  return (
    <Button className="w-full bg-blue-500 text-white" type="button" onClick={() => handleFBLogin()}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Icons.Facebook className="mr-2 h-4 w-4" />
          Entrar com Facebook
        </>
      )}
    </Button>
  )
}