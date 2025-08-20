"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Info, Bell } from "lucide-react"

interface AlertsPanelProps {
  designVariant: number
}

interface Alert {
  id: string
  type: "warning" | "success" | "info"
  message: string
  timestamp: Date
}

export function AlertsPanel({ designVariant }: AlertsPanelProps) {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "success",
      message: "Motor cycle completed successfully",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: "2",
      type: "warning",
      message: "Water level approaching threshold",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: "3",
      type: "info",
      message: "System maintenance scheduled for tomorrow",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
    },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "warning":
        return "destructive" as const
      case "success":
        return "default" as const
      default:
        return "secondary" as const
    }
  }

  return (
    <Card className="animate-slide-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              {getAlertIcon(alert.type)}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{alert.message}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{alert.timestamp.toLocaleTimeString()}</p>
                  <Badge variant={getAlertVariant(alert.type)} className="text-xs">
                    {alert.type}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
