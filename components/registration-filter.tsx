"use client"

import { CheckCircle, CircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useData } from "@/components/data-provider"

export function RegistrationFilter() {
  const { showOnlyCompleted, setShowOnlyCompleted } = useData()

  return (
    <div className="flex rounded-md border border-input">
      <Button
        variant="ghost"
        className={`relative rounded-none rounded-l-md px-3 ${!showOnlyCompleted ? "bg-muted" : ""}`}
        onClick={() => setShowOnlyCompleted(false)}
      >
        <CircleIcon className="mr-2 h-4 w-4" />
        Todos
      </Button>
      <div className="w-px bg-input" />
      <Button
        variant="ghost"
        className={`relative rounded-none rounded-r-md px-3 ${showOnlyCompleted ? "bg-muted" : ""}`}
        onClick={() => setShowOnlyCompleted(true)}
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Concluídos
      </Button>
    </div>
  )
}

