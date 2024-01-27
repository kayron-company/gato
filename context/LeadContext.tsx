"use client"

import Cookies from "js-cookie"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Lead } from "app/dashboard/page"
import {
  formatLeadData,
  FormattedLeadData,
  getLeadDetails,
  getLeadDetailsMock,
  getPageAccessToken,
  initializeFacebook,
} from "utils/facebookUtils"

interface LeadAnalyticsData {
  total_leads: number
  new_leads_week: number
  conversion_rate: number
  leads_awaiting_contact: number
  // Inclua outros campos conforme necessário.
}

interface LeadContextValue {
  leads: any[]
  setLeads: React.Dispatch<React.SetStateAction<any[]>>
  isLoading: boolean
  fetchAndDisplayLeadDetails: (page?: number, perPage?: number) => Promise<void>
  totalPages: number
  currentPage: number
  perPage: number
  setPerPage: React.Dispatch<React.SetStateAction<number>>
  analytics: LeadAnalyticsData | null
}

const LeadContext = createContext<LeadContextValue | undefined>(undefined)

interface LeadProviderProps {
  children: ReactNode
}

interface UserData {
  email: string
  name: string
  permissions: string[]
  role: string
  accessTokenFacebook: string
  pageIds: string[]
}

async function fetchLeads(page: number = 1, perPage: number = 10): Promise<any> {
  const token = Cookies.get("RT_sessionToken")
  const response = await fetch(`http://localhost:5000/lead?page=${page}&per_page=${perPage}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  return await response.json()
}

async function fetchLeadAnalytics(): Promise<any> {
  const token = Cookies.get("RT_sessionToken")
  const response = await fetch("http://localhost:5000/lead/analytics", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  return await response.json()
}

export const LeadProvider: React.FC<LeadProviderProps> = ({ children }) => {
  const [leads, setLeads] = useState<FormattedLeadData[]>([])
  const pathname = usePathname()
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10) // Você pode definir este valor com base em suas necessidades ou UI
  const [analytics, setAnalytics] = useState<LeadAnalyticsData | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  // Aqui você pode mover a lógica do useEffect para buscar e exibir leads

  const fetchAndSetLeadAnalytics = async () => {
    try {
      const analyticsData = await fetchLeadAnalytics()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error("Error fetching lead analytics:", error)
    }
  }

  const fetchAndDisplayLeadDetails = async (page: number = currentPage, perPage: number = 10) => {
    setIsLoading(true)

    try {
      // Inicialize o SDK do Facebook
      await initializeFacebook()

      const userDataString = Cookies.get("RT_user")
      if (!userDataString) {
        throw new Error("UserData not found in cookies")
      }
      const userData: UserData = JSON.parse(userDataString) as UserData
      const userAccessToken = userData.accessTokenFacebook

      // Obter tokens de acesso para cada página
      const pageAccessTokens: { [key: string]: string } = {}
      for (const pageId of userData.pageIds) {
        const pageAccessToken = await getPageAccessToken(userAccessToken, pageId)
        pageAccessTokens[pageId] = pageAccessToken
      }

      // Obter todos os leads do backend
      const backendLeads = await fetchLeads(page, perPage)

      // Processar cada lead
      const processedLeads = []
      for (const lead of backendLeads.leads) {
        const pageAccessToken = pageAccessTokens[lead.facebook_page_id]
        if (pageAccessToken) {
          const leadDetails = await getLeadDetailsMock(lead.lead_id, pageAccessToken)
          const formattedLead = formatLeadData(leadDetails, lead.facebook_page_name, lead.status, lead.facebook_page_id)

          processedLeads.push(formattedLead)
        }
      }

      setLeads(processedLeads)
      setTotalPages(backendLeads.total_pages)
      setCurrentPage(backendLeads.current_page)

      //TODO: remover timeout quando resolver erro de undefined api do facebook
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      //TODO: remover timeout quando resolver erro de undefined api do facebook
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    }
  }

  useEffect(() => {
    ;(async () => {
      await fetchAndSetLeadAnalytics()
    })()
  }, [leads])

  useEffect(() => {
    if (pathname === "/dashboard") {
      fetchAndDisplayLeadDetails()
    }
  }, [pathname])

  return (
    <LeadContext.Provider
      value={{
        leads,
        setLeads,
        fetchAndDisplayLeadDetails,
        isLoading,
        totalPages,
        currentPage,
        perPage,
        setPerPage,
        analytics,
      }}
    >
      {children}
    </LeadContext.Provider>
  )
}

export const useLeads = (): LeadContextValue => {
  const context = useContext(LeadContext)
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadProvider")
  }
  return context
}
