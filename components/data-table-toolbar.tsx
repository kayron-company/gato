"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { DataTableFacetedFilter } from "components/data-table-faceted-filter"
import { DataTableViewOptions } from "components/data-table-view-options"
import { statuses } from "components/DataTable/data/data"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { DataTableReload } from "./data-table-reload"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <ScrollArea>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Pesquise algum lead..."
            value={(table.getColumn("full_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("full_name")?.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {table.getColumn("status") && (
            <DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={statuses} />
          )}
          {/* {table.getColumn("priority") && (
            <DataTableFacetedFilter column={table.getColumn("priority")} title="Priority" options={priorities} />
          )} */}
          {isFiltered && (
            <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
              Resetar
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableReload table={table} />
        <DataTableViewOptions table={table} />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
