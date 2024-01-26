"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Lead } from "components/DataTable/data/schema"
import { Badge } from "components/ui/badge"
import { Checkbox } from "components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { statuses } from "./DataTable/data/data"

export const columns: ColumnDef<Lead>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    cell: ({ row }) => <div>{row.getValue("full_name")}</div>,
  },
  {
    accessorKey: "facebook_page_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Página" />,
    cell: ({ row }) => <div>{row.getValue("facebook_page_name")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = statuses.find((status) => status.value === row.getValue("status"))

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          <div className="flex w-[100px] items-center">
            <Badge className={`${status.color} text-white`}>{status.label}</Badge>
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "created_time",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data de criação" />,
    cell: ({ row }) => <div>{row.getValue("created_time")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
  },
]
