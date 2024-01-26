"use client"

import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { z } from "zod"
import { promises as fs } from "fs"
import path from "path"

import { columns } from "components/columns"
import { DataTable } from "components/data-table"
import leadsData from "components/DataTable/data/leads.json"

import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import { ScrollArea } from "components/ui/scroll-area"
import { Separator } from "components/ui/separator"
import {
  formatLeadData,
  FormattedLeadData,
  getLeadDetails,
  getPageAccessToken,
  initializeFacebook,
} from "utils/facebookUtils"

interface Lead {
  id: number
  lead_id: string
  form_id: string
  created_time: string
  facebook_page_id: string
  facebook_page_name: string
  status: string
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
  const [leads, setLeads] = useState<any[]>([])

  useEffect(() => {
    const fetchAndDisplayLeadDetails = async () => {
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
        const backendLeads = await fetchLeads()

        // Processar cada lead
        const processedLeads = []
        for (const lead of backendLeads) {
          const pageAccessToken = pageAccessTokens[lead.facebook_page_id]
          if (pageAccessToken) {
            const leadDetails = await getLeadDetails(lead.lead_id, pageAccessToken)
            const formattedLead = formatLeadData(
              leadDetails,
              lead.facebook_page_name,
              lead.status,
              lead.facebook_page_id
            )
            processedLeads.push(formattedLead)
          }
        }

        // Atualizar o estado com os leads processados
        setLeads(processedLeads)
      } catch (error) {
        console.error("Error:", error)
      }
    }

    fetchAndDisplayLeadDetails()
  }, [])

  console.log({ leads })

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
                <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
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
                <div className="text-2xl font-bold">9999</div>
                <p className="text-xs text-muted-foreground">+15% em relação ao mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos Leads</CardTitle>
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
                <div className="text-2xl font-bold">21</div>
                <p className="text-xs text-muted-foreground">+20 novos leads esta semana</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
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
                <div className="text-2xl font-bold">60%</div>
                <p className="text-xs text-muted-foreground">12 fechamentos no último mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aguardando Contato</CardTitle>
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
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">24 leads aguardando ação</p>
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
              <DataTable data={leads} columns={columns} />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
