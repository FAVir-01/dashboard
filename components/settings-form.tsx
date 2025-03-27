"use client"

import type React from "react"

import { useState } from "react"
import { useData } from "@/components/data-provider"
import { updateSettings } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SettingsForm() {
  const { settings, refetchData } = useData()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  // Get the first settings object or use default values
  const defaultSettings = settings && settings.length > 0 ? settings[0] : null

  const [formData, setFormData] = useState({
    bot_name: defaultSettings?.bot_name || "Assistente",
    link: defaultSettings?.link || "",
    auto_reply: defaultSettings?.auto_reply === true,
    working_hours_start: defaultSettings?.working_hours_start || "09:00",
    working_hours_end: defaultSettings?.working_hours_end || "18:00",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!defaultSettings) {
      toast({
        title: "Erro",
        description: "Não foi possível encontrar configurações para atualizar.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      await updateSettings(686, defaultSettings.id, formData)
      toast({
        title: "Sucesso",
        description: "Configurações atualizadas com sucesso.",
      })
      refetchData()
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Chatbot</CardTitle>
        <CardDescription>Personalize as configurações do seu assistente virtual.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bot_name">Nome do Bot</Label>
              <Input
                id="bot_name"
                name="bot_name"
                placeholder="Nome do assistente"
                value={formData.bot_name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link para Planos</Label>
              <Input
                id="link"
                name="link"
                placeholder="https://exemplo.com/planos"
                value={formData.link}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto_reply">Resposta Automática</Label>
                <Switch
                  id="auto_reply"
                  checked={formData.auto_reply}
                  onCheckedChange={(checked) => handleSwitchChange("auto_reply", checked)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Habilitar respostas automáticas quando estiver fora do horário de trabalho
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="working_hours_start">Horário de Início</Label>
                <Input
                  id="working_hours_start"
                  name="working_hours_start"
                  type="time"
                  value={formData.working_hours_start}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="working_hours_end">Horário de Término</Label>
                <Input
                  id="working_hours_end"
                  name="working_hours_end"
                  type="time"
                  value={formData.working_hours_end}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="mt-6" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Configurações"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

