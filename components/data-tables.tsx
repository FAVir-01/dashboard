"use client"

import { useState, useEffect } from "react"
import { useData } from "@/components/data-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function DataTables() {
  const { clients, interactions, conversions, timeFilter, showOnlyCompleted } = useData()
  const [activeTab, setActiveTab] = useState("clients")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const itemsPerPage = 10

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Data inválida"
      }
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (error) {
      return "Data inválida"
    }
  }

  // Função para filtrar dados por período (ano/mês/dia)
  const filterByTimeFilter = (items: any[]) => {
    const currentDate = new Date()

    return items.filter((item) => {
      try {
        const createdDate = new Date(item["created on"])
        if (isNaN(createdDate.getTime())) {
          return false
        }

        if (timeFilter === "year") {
          return createdDate.getFullYear() === currentDate.getFullYear()
        } else if (timeFilter === "month") {
          return (
            createdDate.getMonth() === currentDate.getMonth() && createdDate.getFullYear() === currentDate.getFullYear()
          )
        } else {
          // dia
          return (
            createdDate.getDate() === currentDate.getDate() &&
            createdDate.getMonth() === currentDate.getMonth() &&
            createdDate.getFullYear() === currentDate.getFullYear()
          )
        }
      } catch (error) {
        return false
      }
    })
  }

  // Aplicar filtro de tempo e busca
  useEffect(() => {
    let data: any[] = []

    // Selecionar a fonte de dados com base na aba ativa
    switch (activeTab) {
      case "clients":
        // Filtrar clientes com base no campo registropronto, se necessário
        data = showOnlyCompleted ? clients.filter((client) => client.registropronto === true) : clients
        break
      case "interactions":
        data = interactions
        break
      case "conversions":
        data = conversions
        break
      default:
        data = clients
    }

    // Aplicar filtro de tempo (ano/mês/dia)
    data = filterByTimeFilter(data)

    // Aplicar filtro de busca
    if (searchTerm.trim() !== "") {
      data = data.filter((item) => {
        return Object.keys(item).some((key) => {
          const value = item[key]
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchTerm.toLowerCase())
          }
          if (typeof value === "number") {
            return value.toString().includes(searchTerm)
          }
          return false
        })
      })
    }

    setFilteredItems(data)
    setCurrentPage(1) // Reset para a primeira página quando os filtros mudam
  }, [activeTab, clients, interactions, conversions, searchTerm, timeFilter, showOnlyCompleted])

  const paginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredItems.slice(startIndex, startIndex + itemsPerPage)
  }

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabela de Dados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
            <TabsList>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
              <TabsTrigger value="interactions">Interações</TabsTrigger>
              <TabsTrigger value="conversions">Conversões</TabsTrigger>
            </TabsList>
          </Tabs>

          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
            }}
            className="w-[250px]"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {activeTab === "clients" && (
                  <>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Status</TableHead>
                  </>
                )}
                {activeTab === "interactions" && (
                  <>
                    <TableHead>ID</TableHead>
                    <TableHead>Session ID</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Data</TableHead>
                  </>
                )}
                {activeTab === "conversions" && (
                  <>
                    <TableHead>ID</TableHead>
                    <TableHead>Session ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData().map((item) => (
                <TableRow key={item.id}>
                  {activeTab === "clients" && (
                    <>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.nome || "N/A"}</TableCell>
                      <TableCell>{item.email || "N/A"}</TableCell>
                      <TableCell>{item.telefone || "N/A"}</TableCell>
                      <TableCell>{formatDate(item["created on"])}</TableCell>
                      <TableCell>
                        {item.registropronto === true ? (
                          <Badge className="bg-green-500">Concluído</Badge>
                        ) : (
                          <Badge variant="outline">Pendente</Badge>
                        )}
                      </TableCell>
                    </>
                  )}
                  {activeTab === "interactions" && (
                    <>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.sessionId || "N/A"}</TableCell>
                      <TableCell>{item.action || "N/A"}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.chatInput || "N/A"}</TableCell>
                      <TableCell>{formatDate(item["created on"])}</TableCell>
                    </>
                  )}
                  {activeTab === "conversions" && (
                    <>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.sessionId || "N/A"}</TableCell>
                      <TableCell>{item.conversionType || "N/A"}</TableCell>
                      <TableCell>
                        {typeof item.conversionValue === "number"
                          ? new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.conversionValue)
                          : "N/A"}
                      </TableCell>
                      <TableCell>{formatDate(item["created on"])}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              {paginatedData().length === 0 && (
                <TableRow>
                  <TableCell colSpan={activeTab === "clients" ? 6 : 5} className="text-center py-8">
                    Nenhum dado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1
                // Only show immediate neighbors of current page for cleaner pagination
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink onClick={() => setCurrentPage(page)} isActive={page === currentPage}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }

                // Show ellipsis for gaps in pagination
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <PaginationItem key={page}>
                      <span className="px-4">...</span>
                    </PaginationItem>
                  )
                }

                return null
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  )
}

