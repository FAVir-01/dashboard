import { DashboardShell } from "@/components/dashboard-shell"
import { DataProvider } from "@/components/data-provider"

export default function DashboardPage() {
  return (
    <DataProvider>
      <DashboardShell />
    </DataProvider>
  )
}

