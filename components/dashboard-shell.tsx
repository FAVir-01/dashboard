"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricsSection } from "@/components/metrics-section"
import { ChartsSection } from "@/components/charts-section"
import { DataTables } from "@/components/data-tables"
import { SettingsForm } from "@/components/settings-form"
import { TimeFilterSelector } from "@/components/time-filter-selector"
import { RegistrationFilter } from "@/components/registration-filter"
import { ModeToggle } from "@/components/mode-toggle"
import { useData } from "@/components/data-provider"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardShell() {
  const [activeTab, setActiveTab] = useState("overview")
  const { error, loading, refetchData } = useData()

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard de Chatbot</h1>
        <div className="flex items-center gap-4">
          <RegistrationFilter />
          <TimeFilterSelector />
          <ModeToggle />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error}
            <button onClick={refetchData} className="ml-4 underline">
              Tentar novamente
            </button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="data">Dados</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <Skeleton className="h-80" />
            </div>
          ) : (
            <>
              <MetricsSection />
              <ChartsSection />
            </>
          )}
        </TabsContent>

        <TabsContent value="data">{loading ? <Skeleton className="h-96" /> : <DataTables />}</TabsContent>

        <TabsContent value="settings">{loading ? <Skeleton className="h-96" /> : <SettingsForm />}</TabsContent>
      </Tabs>
    </div>
  )
}

