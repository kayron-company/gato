import { Table } from "@tanstack/react-table"
import { RefreshCw } from "lucide-react"
import React, { useState } from "react"
import { toast } from "sonner"
import { Button } from "components/ui/button"
import { useLeads } from "context/LeadContext"

interface DataTableReloadProps<TData> {
  table: Table<TData>
}

export function DataTableReload<TData>({ table }: DataTableReloadProps<TData>) {
  const { fetchAndDisplayLeadDetails } = useLeads()
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true) // Inicia a animação
    try {
      await fetchAndDisplayLeadDetails()
      toast.success("Leads atualizados com sucesso!", { duration: 3000 })
    } catch (error) {
      toast.error("Erro ao atualizar leads.", { duration: 3000 })
    } finally {
      setIsSyncing(false)
    }
  }

  const rotationStyle = isSyncing ? { animation: "spin 1s linear infinite" } : {}

  return (
    <Button variant="outline" size="sm" className="ml-auto mr-2 hidden h-8 lg:flex" onClick={handleSync}>
      <RefreshCw className="mr-2 h-4 w-4" style={rotationStyle} />
      Sincronizar
    </Button>
  )
}
