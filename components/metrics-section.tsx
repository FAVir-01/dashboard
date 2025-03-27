"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/components/data-provider"
import { ArrowDownIcon, ArrowUpIcon, Users, MessageSquare, BarChart } from "lucide-react"

export function MetricsSection() {
  const { clients, interactions, conversions, timeFilter, compareWithPreviousPeriod, showOnlyCompleted } = useData()

  console.log("Total clients available:", clients.length)
  console.log("Total interactions available:", interactions.length)

  const currentDate = new Date()
  const filterByCurrentPeriod = (item: any) => {
    try {
      // Baserow uses "created on" field
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
        // day
        return (
          createdDate.getDate() === currentDate.getDate() &&
          createdDate.getMonth() === currentDate.getMonth() &&
          createdDate.getFullYear() === currentDate.getFullYear()
        )
      }
    } catch (error) {
      return false
    }
  }

  // Filtrar clientes com base no campo registropronto, se necessário
  const filteredClients = showOnlyCompleted ? clients.filter((client) => client.registropronto === true) : clients

  // Filter and count the current period data
  const currentClients = filteredClients.filter(filterByCurrentPeriod).length
  const currentInteractions = interactions.filter(filterByCurrentPeriod).length
  const currentConversions = conversions.filter(filterByCurrentPeriod).length

  console.log("Filtered clients count:", currentClients)
  console.log("Filtered interactions count:", currentInteractions)

  const clientsChangePercent = compareWithPreviousPeriod(currentClients, "clients")
  const interactionsChangePercent = compareWithPreviousPeriod(currentInteractions, "interactions")
  const conversionsChangePercent = compareWithPreviousPeriod(currentConversions, "conversions")

  // Determinar o texto do período para exibição
  const periodText = timeFilter === "year" ? "ano" : timeFilter === "month" ? "mês" : "dia"

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title={showOnlyCompleted ? "Cadastros Concluídos" : "Total Cadastros"}
        value={currentClients}
        icon={<Users className="h-5 w-5" />}
        changePercent={clientsChangePercent}
        period={periodText}
      />

      <MetricCard
        title="Total Interações"
        value={currentInteractions}
        icon={<MessageSquare className="h-5 w-5" />}
        changePercent={interactionsChangePercent}
        period={periodText}
      />

      <MetricCard
        title="Total Conversões"
        value={currentConversions}
        icon={<BarChart className="h-5 w-5" />}
        changePercent={conversionsChangePercent}
        period={periodText}
      />
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon,
  changePercent,
  period,
}: {
  title: string
  value: number
  icon: React.ReactNode
  changePercent: number
  period: string
}) {
  const isPositive = changePercent > 0
  const isZero = changePercent === 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          {isZero ? (
            <span>Sem alteração</span>
          ) : (
            <>
              {isPositive ? (
                <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={isPositive ? "text-green-500" : "text-red-500"}>
                {Math.abs(changePercent).toFixed(1)}%
              </span>
              <span className="ml-1">em relação ao {period} anterior</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

