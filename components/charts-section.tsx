"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useData } from "@/components/data-provider"

import { Chart, type ChartData } from "@/components/ui/chart"

export function ChartsSection() {
  const [chartType, setChartType] = useState("line")
  const { clients, interactions, conversions, timeFilter, showOnlyCompleted } = useData()

  // Process data based on time filter
  const processChartData = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    let labels: string[] = []
    let clientsData: number[] = []
    let interactionsData: number[] = []
    let conversionsData: number[] = []

    // Filtrar clientes com base no campo registropronto, se necessário
    const filteredClients = showOnlyCompleted ? clients.filter((client) => client.registropronto === true) : clients

    if (timeFilter === "year") {
      // Generate data for each month of the current year
      labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

      // Initialize with zeros
      clientsData = new Array(12).fill(0)
      interactionsData = new Array(12).fill(0)
      conversionsData = new Array(12).fill(0)

      // Populate data for the current year
      filteredClients.forEach((client) => {
        try {
          const date = new Date(client["created on"])
          if (!isNaN(date.getTime()) && date.getFullYear() === currentYear) {
            const month = date.getMonth() // 0-based index (0 = January)
            clientsData[month]++
          }
        } catch (error) {
          // Skip invalid dates
        }
      })

      interactions.forEach((interaction) => {
        try {
          const date = new Date(interaction["created on"])
          if (!isNaN(date.getTime()) && date.getFullYear() === currentYear) {
            const month = date.getMonth()
            interactionsData[month]++
          }
        } catch (error) {
          // Skip invalid dates
        }
      })

      conversions.forEach((conversion) => {
        try {
          const date = new Date(conversion["created on"])
          if (!isNaN(date.getTime()) && date.getFullYear() === currentYear) {
            const month = date.getMonth()
            conversionsData[month]++
          }
        } catch (error) {
          // Skip invalid dates
        }
      })
    } else if (timeFilter === "month") {
      // Generate data for each day of the current month
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
      labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`)

      // Initialize with zeros
      clientsData = new Array(daysInMonth).fill(0)
      interactionsData = new Array(daysInMonth).fill(0)
      conversionsData = new Array(daysInMonth).fill(0)

      // Populate data for the current month
      filteredClients.forEach((client) => {
        try {
          const date = new Date(client["created on"])
          if (!isNaN(date.getTime()) && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            const day = date.getDate() - 1 // 0-based index
            clientsData[day]++
          }
        } catch (error) {
          // Skip invalid dates
        }
      })

      interactions.forEach((interaction) => {
        try {
          const date = new Date(interaction["created on"])
          if (!isNaN(date.getTime()) && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            const day = date.getDate() - 1 // 0-based index
            interactionsData[day]++
          }
        } catch (error) {
          // Skip invalid dates
        }
      })

      conversions.forEach((conversion) => {
        try {
          const date = new Date(conversion["created on"])
          if (!isNaN(date.getTime()) && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            const day = date.getDate() - 1 // 0-based index
            conversionsData[day]++
          }
        } catch (error) {
          // Skip invalid dates
        }
      })
    } else {
      // For daily view, show hourly data
      labels = Array.from({ length: 24 }, (_, i) => `${i}h`)

      // Initialize with zeros
      clientsData = new Array(24).fill(0)
      interactionsData = new Array(24).fill(0)
      conversionsData = new Array(24).fill(0)

      // Populate data for the current day
      filteredClients.forEach((client) => {
        try {
          const date = new Date(client["created on"])
          if (
            !isNaN(date.getTime()) &&
            date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          ) {
            const hour = date.getHours()
            clientsData[hour]++
          }
        } catch (error) {
          // Skip invalid dates
        }
      })

      interactions.forEach((interaction) => {
        try {
          const date = new Date(interaction["created on"])
          if (
            !isNaN(date.getTime()) &&
            date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          ) {
            const hour = date.getHours()
            interactionsData[hour]++
          }
        } catch (error) {
          // Skip invalid dates
        }
      })

      conversions.forEach((conversion) => {
        try {
          const date = new Date(conversion["created on"])
          if (
            !isNaN(date.getTime()) &&
            date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          ) {
            const hour = date.getHours()
            conversionsData[hour]++
          }
        } catch (error) {
          // Skip invalid dates
        }
      })
    }

    return {
      labels,
      datasets: [
        {
          label: showOnlyCompleted ? "Cadastros Concluídos" : "Cadastros",
          data: clientsData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Interações",
          data: interactionsData,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
        {
          label: "Conversões",
          data: conversionsData,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    }
  }

  const chartData = processChartData()

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Análise de Dados</CardTitle>
        <Tabs defaultValue="line" value={chartType} onValueChange={setChartType}>
          <TabsList className="grid w-40 grid-cols-2">
            <TabsTrigger value="line">Linha</TabsTrigger>
            <TabsTrigger value="bar">Barra</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          {chartType === "line" ? <LineChart data={chartData} /> : <BarChart data={chartData} />}
        </div>
      </CardContent>
    </Card>
  )
}

function LineChart({ data }: { data: ChartData<"line"> }) {
  return (
    <Chart
      type="line"
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
        plugins: {
          legend: {
            position: "top" as const,
          },
          title: {
            display: false,
          },
        },
      }}
      data={data}
    />
  )
}

function BarChart({ data }: { data: ChartData<"bar"> }) {
  return (
    <Chart
      type="bar"
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
        plugins: {
          legend: {
            position: "top" as const,
          },
          title: {
            display: false,
          },
        },
      }}
      data={data}
    />
  )
}

