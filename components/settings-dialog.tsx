"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { Key, Save } from "lucide-react"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [apiKey, setApiKey] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem("anthropic_api_key")
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [open])

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("anthropic_api_key", apiKey.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleClear = () => {
    localStorage.removeItem("anthropic_api_key")
    setApiKey("")
    setSaved(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your AI provider settings</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Anthropic API Key</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-sm text-muted-foreground">
                Add your Anthropic API key to use Claude models (Haiku, Sonnet, Opus)
              </Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!apiKey.trim()} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {saved ? "Saved!" : "Save API Key"}
              </Button>
              {apiKey && (
                <Button onClick={handleClear} variant="outline">
                  Clear
                </Button>
              )}
            </div>
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <strong>Note:</strong> If you don't provide an API key, the system will use the default configuration from
              environment variables.
            </p>
            <p>Get your API key from: https://console.anthropic.com/</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
