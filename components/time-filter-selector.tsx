"use client"

import { CalendarIcon, ClockIcon, CalendarDaysIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useData } from "@/components/data-provider"

export function TimeFilterSelector() {
  const { timeFilter, setTimeFilter } = useData()

  return (
    <div className="flex rounded-md border border-input">
      <Button
        variant="ghost"
        className={`relative rounded-none rounded-l-md px-3 ${timeFilter === "year" ? "bg-muted" : ""}`}
        onClick={() => setTimeFilter("year")}
      >
        <CalendarDaysIcon className="mr-2 h-4 w-4" />
        Ano
      </Button>
      <div className="w-px bg-input" />
      <Button
        variant="ghost"
        className={`relative rounded-none px-3 ${timeFilter === "month" ? "bg-muted" : ""}`}
        onClick={() => setTimeFilter("month")}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        Mês
      </Button>
      <div className="w-px bg-input" />
      <Button
        variant="ghost"
        className={`relative rounded-none rounded-r-md px-3 ${timeFilter === "day" ? "bg-muted" : ""}`}
        onClick={() => setTimeFilter("day")}
      >
        <ClockIcon className="mr-2 h-4 w-4" />
        Dia
      </Button>
    </div>
  )
}

