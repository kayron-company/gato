"use client"

import Cookies from "js-cookie"
import Image from "next/image"
import { useEffect } from "react"
import { useAuth } from "context/AuthContext"
import { initializeFacebook, loginUserFacebook } from "utils/facebookUtils"

declare global {
  interface Window {
    FB: any // Use "any" or a more specific type if you have the typings
  }
}

interface UserSession {
  email: string
  name: string
  permissions: string[]
  role: string
  sessionToken: string
}
// Restante do seu componente...

export default function Login() {
  const { login } = useAuth() // Use o hook useAuth para obter a função de login

  // Handler to be called when the login button is clicked
  const handleFBLogin = async () => {
    await loginUserFacebook(authenticateUser)
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
      console.log("Dados de autenticação:", data)

      Cookies.set("RT_sessionToken", data.sessionToken, { secure: true, sameSite: "strict" })

      login({
        token: data.sessionToken,
        user: { name: data.name, email: data.email, permissions: data.permissions, role: data.role },
      })

      // Redirecione o usuário para a raiz do site
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Erro na autenticação:", error)
    }
  }

  // Load the SDK script asynchronously
  useEffect(() => {
    initializeFacebook()
  }, [])
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            width={1000}
            height={1000}
            className="mx-auto h-14 w-auto"
            src="/logo-raisetalk.png"
            alt="Your Company"
          />
        </div>

        <div className="mt-5">
          <button
            onClick={() => handleFBLogin()}
            className="mt-2 flex w-full items-center justify-center space-x-3 rounded-lg border bg-blue-500 px-4 py-2 text-center text-sm text-white transition-colors duration-200 hover:bg-gray-600 dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-facebook"
              viewBox="0 0 16 16"
            >
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
            </svg>
            <span className="text-sm text-white dark:text-gray-200">Entrar com facebook</span>
          </button>
        </div>
      </div>
    </>
  )
}
