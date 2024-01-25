"use client"

import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { z } from "zod"
import { promises as fs } from "fs"
import path from "path"

import { columns } from "components/columns"
import { DataTable } from "components/data-table"
import { taskSchema } from "components/DataTable/data/schema"

import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import { ScrollArea } from "components/ui/scroll-area"
import { Separator } from "components/ui/separator"
import { formatLeadData, getLeadDetails, getPageAccessToken, initializeFacebook } from "utils/facebookUtils"

interface Lead {
  id: number
  lead_id: string
  form_id: string
  created_time: string
  facebook_page_id: string
  // outros campos conforme necessário
}

interface UserData {
  email: string
  name: string
  permissions: string[]
  role: string
  accessTokenFacebook: string
  pageIds: string[]
}

async function fetchLeads(): Promise<Lead[]> {
  const token = Cookies.get("RT_sessionToken")
  const response = await fetch("http://localhost:5000/lead", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  return (await response.json()) as Lead[]
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [isFacebookSDKInitialized, setIsFacebookSDKInitialized] = useState(false)

  useEffect(() => {
    initializeFacebook()
      .then(async () => {
        try {
          const userDataString = Cookies.get("RT_user")
          if (!userDataString) {
            throw new Error("UserData not found in cookies")
          }
          const userData: UserData = JSON.parse(userDataString) as UserData
          const userAccessToken = userData.accessTokenFacebook
          const pageIds = userData.pageIds

          // Dicionário para armazenar os tokens de acesso de cada página
          const pageAccessTokens: { [key: string]: string } = {}

          // Obter tokens de acesso para cada página
          for (const pageId of pageIds) {
            const pageAccessToken = await getPageAccessToken(userAccessToken, pageId)
            pageAccessTokens[pageId] = pageAccessToken
          }
          console.log({ pageAccessTokens })
          // Obter todos os leads
          const leads = await fetchLeads()

          // Buscar detalhes de cada lead
          for (const lead of leads) {
            console.log({ lead })
            const pageAccessToken = pageAccessTokens[lead.facebook_page_id]
            if (pageAccessToken) {
              const leadDetails = await getLeadDetails(lead.lead_id, pageAccessToken)
              console.log(`Detalhes do Lead ${lead.lead_id}:`, formatLeadData(leadDetails))
            } else {
              console.log(`Token de acesso não encontrado para a página ${lead.facebook_page_id}`)
            }
          }
        } catch (error) {
          console.error("Error:", error)
        }
      })
      .catch((error) => {
        console.error("Erro ao inicializar o SDK do Facebook:", error)
      })
  }, [])

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Olá, bem-vindo de volta 👋</h2>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 since last hour</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1">
            <div>
              <div className="mb-5">
                <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
                <span className="text-md">Acompanhe e gerencie seus contatos potenciais aqui.</span>
              </div>
              <Separator className="my-4" />
              <DataTable data={tasks} columns={columns} />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
