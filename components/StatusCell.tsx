import React, { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { useLeads } from "context/LeadContext"
import { statuses } from "./DataTable/data/data"

interface StatusCellProps {
  leadId: string
  initialStatus: string
  updateLeadStatus: (leadId: string, newStatus: string, prevStatus: string) => void
}

export const StatusCell: React.FC<StatusCellProps> = ({ leadId, initialStatus, updateLeadStatus }) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus)
  const { leads, setLeads } = useLeads()

  useEffect(() => {
    const lead = leads.find((l) => l.id === leadId)
    if (lead) {
      setCurrentStatus(lead.status)
    }
  }, [leads, leadId])

  const handleStatusChange = async (newStatus: string) => {
    const prevStatus = currentStatus
    try {
      await updateLeadStatus(leadId, newStatus, prevStatus)
      setCurrentStatus(newStatus)

      setLeads((leads) => leads.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead)))
    } catch (error) {
      // Se falhar, volta para o status anterior
      setCurrentStatus(prevStatus)
    }
  }

  return (
    <Select defaultValue={currentStatus} value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((statusOption) => (
          <SelectItem key={statusOption.value} value={statusOption.value}>
            {statusOption.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
