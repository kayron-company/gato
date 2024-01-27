import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons"
import { Button } from "components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { useLeads } from "context/LeadContext" // Importe seu contexto de leads

export function DataTablePagination() {
  const { currentPage, totalPages, fetchAndDisplayLeadDetails, perPage, setPerPage } = useLeads()

  // Handler para mudança de página
  const handlePageChange = (newPage: number) => {
    const validNewPage = Math.max(1, Math.min(newPage, totalPages)) // Limita o número da página aos limites existentes
    fetchAndDisplayLeadDetails(validNewPage, perPage)
  }

  // Handler para mudança do número de leads por página
  const handlePageSizeChange = (pageSize: number) => {
    fetchAndDisplayLeadDetails(1, pageSize) // Volta para a primeira página com o novo tamanho
    setPerPage(pageSize) // Atualiza o estado do contexto
  }

  return (
    <div className="flex items-center justify-end px-2 lg:justify-between">
      <div className="hidden flex-1 text-sm text-muted-foreground lg:block">
        {/* Aqui você pode exibir o número de leads selecionados */}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="hidden items-center space-x-2 lg:flex">
          <p className="text-sm font-medium">Leads por página</p>
          <Select
            defaultValue={`${perPage}`}
            value={`${perPage}`}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Ir para a primeira página</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Ir para a página anterior</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Ir para a próxima página</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Ir para a última página</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
