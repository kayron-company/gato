"use client"

import axios from "axios"
import Cookies from "js-cookie"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Icons } from "components/icons"
import { useAuth } from "context/AuthContext"
import { cn } from "lib/utils"
import { NavItem } from "types"
import { initializeFacebook, logoutUserFacebook } from "utils/facebookUtils"

interface DashboardNavProps {
  items: NavItem[]
  setOpen?: Dispatch<SetStateAction<boolean>>
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname()
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (!items?.length) {
    return null
  }

  const handleItemClick = async (item: NavItem) => {
    if (item.title === "Sair") {
      setIsLoggingOut(true)
      await logout()
      setIsLoggingOut(false)
    } else if (setOpen) {
      setOpen(false)
    }
  }

  const Spinner = () => <div className="infinite h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"]
        return (
          item.href && (
            <Link key={index} href={item.disabled ? "/" : item.href} onClick={() => handleItemClick(item)}>
              <span
                className={cn(
                  "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <div className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                {item.title === "Sair" && isLoggingOut && <Spinner />}
              </span>
            </Link>
          )
        )
      })}
    </nav>
  )
}
