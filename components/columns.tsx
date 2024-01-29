"use client"

import { ColumnDef } from "@tanstack/react-table"
import Cookies from "js-cookie"
import { CopyIcon } from "lucide-react"
import { toast } from "sonner"
import { Lead } from "components/DataTable/data/schema"
import { Checkbox } from "components/ui/checkbox"
import { formatDate, formatPhoneNumber } from "utils/maskUtils"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { statuses } from "./DataTable/data/data"
import { StatusCell } from "./StatusCell"
import { Button } from "./ui/button"

async function updateLeadStatus(leadId: string, newStatus: string, prevStatus: string): Promise<void> {
  try {
    const token = Cookies.get("RT_accessToken")

    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/lead/${leadId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Substitua pelo seu token real
      },
      body: JSON.stringify({ status: newStatus }),
    })

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    // Mostra o toast de sucesso
    toast.success(`Status atualizado para "${newStatus}"`, {
      action: {
        label: "Desfazer",
        onClick: async () => {
          // Faz a chamada para reverter o status no backend
          await updateLeadStatus(leadId, prevStatus, newStatus)

          // Toast para confirmar que a ação foi desfeita
          toast.info("Ação desfeita.", {
            duration: 5000,
          })
        },
      },
      duration: 4000,
    })
  } catch (error) {
    // Mostra o toast de erro
    toast.error("Falha ao atualizar o status", {
      duration: 2000,
    })
  }
}

export const columns: ColumnDef<Lead>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    cell: ({ row }) => <div>{row.getValue("full_name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <div>
        {row.getValue("email")}{" "}
        <Button
          variant="ghost"
          onClick={() => {
            navigator.clipboard.writeText(row.getValue("email"))
            toast.success("Email copiado", { duration: 2000 })
          }}
        >
          <CopyIcon className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Telefone" />,
    cell: ({ row }) => (
      <div>
        {formatPhoneNumber(row.getValue("phone_number"))}
        <Button
          variant="ghost"
          onClick={() => {
            navigator.clipboard.writeText(row.getValue("phone_number"))
            toast.success("Número de telefone copiado", { duration: 2000 })
          }}
        >
          <CopyIcon className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "facebook_page_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Página" />,
    cell: ({ row }) => <div>{row.getValue("facebook_page_name")}</div>,
  },
  {
    accessorKey: "status",
    header: () => "Status",
    cell: ({ row }) => {
      const status = statuses.find((status) => status.value === row.getValue("status"))

      if (!status) {
        return null
      }

      return <StatusCell leadId={row.original.id} initialStatus={status.value} updateLeadStatus={updateLeadStatus} />
    },

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "created_time",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data de criação" />,
    cell: ({ row }) => <div>{formatDate(row.getValue("created_time"))}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
  },
]
