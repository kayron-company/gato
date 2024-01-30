"use client"

import { columns } from "components/columns"
import { DataTable } from "components/data-table"
import PhoneModal from "components/PhoneModal"

import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import { ScrollArea } from "components/ui/scroll-area"
import { Separator } from "components/ui/separator"
import { useAuth } from "context/AuthContext"

import { useLeads } from "context/LeadContext"

export interface Lead {
  id: number
  lead_id: string
  form_id: string
  created_time: string
  facebook_page_id: string
  facebook_page_name: string
  status: string
  // outros campos conforme necessário
}

export default function Dashboard() {
  const { leads, isLoading, analytics } = useLeads()
  const { showPhoneModal, setShowPhoneModal } = useAuth()

  return (
    <>
      <PhoneModal isOpenPhoneModal={showPhoneModal} onClose={() => setShowPhoneModal(false)} />
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
                  <div className="text-2xl font-bold">{analytics ? analytics.total_leads : "Carregando..."}</div>
                  {/* <p className="text-xs text-muted-foreground">+15% em relação ao mês passado</p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de novos Leads - últimos 7 Dias</CardTitle>
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
                  <div className="text-2xl font-bold">{analytics ? analytics.new_leads_week : "Carregando..."}</div>
                  {/* <p className="text-xs text-muted-foreground">+20 novos leads esta semana</p> */}
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
                  <div className="text-2xl font-bold">
                    {analytics ? `${analytics.conversion_rate}%` : "Carregando..."}
                  </div>
                  {/* <p className="text-xs text-muted-foreground">12 fechamentos no último mês</p> */}
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
                  <div className="text-2xl font-bold">
                    {analytics ? analytics.leads_awaiting_contact : "Carregando..."}
                  </div>
                  {/* <p className="text-xs text-muted-foreground">24 leads aguardando ação</p> */}
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
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                  </div>
                ) : (
                  // Ajuste o valor e a largura conforme necessário
                  <DataTable data={leads} columns={columns} />
                )}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  )
}
