"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { fetchData } from "@/lib/api"

// Atualizar o tipo TimeFilter para incluir "year"
export type TimeFilter = "day" | "month" | "year"

type DataContextType = {
  clients: any[]
  interactions: any[]
  conversions: any[]
  settings: any[]
  loading: boolean
  error: string | null
  refetchData: () => Promise<void>
  timeFilter: TimeFilter
  setTimeFilter: (filter: TimeFilter) => void
  previousPeriodData: {
    clients: number
    interactions: number
    conversions: number
  }
  compareWithPreviousPeriod: (currentCount: number, type: "clients" | "interactions" | "conversions") => number
  showOnlyCompleted: boolean
  setShowOnlyCompleted: (value: boolean) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<any[]>([])
  const [interactions, setInteractions] = useState<any[]>([])
  const [conversions, setConversions] = useState<any[]>([])
  const [settings, setSettings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month")
  const [showOnlyCompleted, setShowOnlyCompleted] = useState(false)
  const [previousPeriodData, setPreviousPeriodData] = useState({
    clients: 0,
    interactions: 0,
    conversions: 0,
  })

  const fetchAllData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch data from all tables with all pages
      const clientsResponse = await fetchData(683) // Clientes table
      const interactionsResponse = await fetchData(682) // Interações table
      const conversionsResponse = await fetchData(685) // Conversões table
      const settingsResponse = await fetchData(686) // Configurações table

      console.log("Total clients:", clientsResponse.results.length)
      console.log("Total interactions:", interactionsResponse.results.length)
      console.log("Total conversions:", conversionsResponse.results.length)

      // Store the results arrays from the responses
      setClients(clientsResponse.results || [])
      setInteractions(interactionsResponse.results || [])
      setConversions(conversionsResponse.results || [])
      setSettings(settingsResponse.results || [])

      // Calculate previous period data
      const previousPeriod = calculatePreviousPeriodData(
        clientsResponse.results || [],
        interactionsResponse.results || [],
        conversionsResponse.results || [],
        timeFilter,
        showOnlyCompleted,
      )
      setPreviousPeriodData(previousPeriod)
    } catch (err) {
      setError("Falha ao buscar dados da API Baserow")
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [timeFilter, showOnlyCompleted])

  const calculatePreviousPeriodData = (
    clientsData: any[],
    interactionsData: any[],
    conversionsData: any[],
    currentTimeFilter: TimeFilter,
    onlyCompleted: boolean,
  ) => {
    // Get current date
    const now = new Date()
    let currentPeriodStart: Date
    let previousPeriodStart: Date
    let previousPeriodEnd: Date

    if (currentTimeFilter === "year") {
      // Current year
      currentPeriodStart = new Date(now.getFullYear(), 0, 1) // Jan 1st of current year
      // Previous year
      previousPeriodStart = new Date(now.getFullYear() - 1, 0, 1) // Jan 1st of previous year
      previousPeriodEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59) // Dec 31st of previous year
    } else if (currentTimeFilter === "month") {
      // Current month
      currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
      // Previous month
      previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      previousPeriodEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
    } else {
      // Current day
      currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      // Previous day
      previousPeriodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      previousPeriodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59)
    }

    // Filtrar clientes com base no campo registropronto, se necessário
    let filteredClientsData = clientsData
    if (onlyCompleted) {
      filteredClientsData = clientsData.filter((client) => client.registropronto === true)
    }

    const filterByPreviousPeriod = (item: any) => {
      try {
        // Use "created on" field from Baserow
        const createdDate = new Date(item["created on"])
        if (isNaN(createdDate.getTime())) {
          return false
        }
        return createdDate >= previousPeriodStart && createdDate <= previousPeriodEnd
      } catch (error) {
        return false
      }
    }

    // Aplicar filtro de período anterior aos clientes já filtrados por registropronto
    const previousPeriodClients = filteredClientsData.filter(filterByPreviousPeriod)

    return {
      clients: previousPeriodClients.length,
      interactions: interactionsData.filter(filterByPreviousPeriod).length,
      conversions: conversionsData.filter(filterByPreviousPeriod).length,
    }
  }

  const compareWithPreviousPeriod = (currentCount: number, type: "clients" | "interactions" | "conversions") => {
    const previousCount = previousPeriodData[type]
    if (previousCount === 0) return 0
    return ((currentCount - previousCount) / previousCount) * 100
  }

  return (
    <DataContext.Provider
      value={{
        clients,
        interactions,
        conversions,
        settings,
        loading,
        error,
        refetchData: fetchAllData,
        timeFilter,
        setTimeFilter,
        previousPeriodData,
        compareWithPreviousPeriod,
        showOnlyCompleted,
        setShowOnlyCompleted,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

