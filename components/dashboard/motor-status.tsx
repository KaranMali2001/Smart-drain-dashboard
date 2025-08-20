"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Clock, Power, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SensorData {
  distance: number
  motor: "ON" | "OFF"
  ts: number
}

interface MotorStatusProps {
  latestReading: SensorData | null
  designVariant: number
}

interface MotorLog {
  id: number
  motor_state: string
  distance: number
  reason: string
  timestamp: number
  created_at: string
}

export function MotorStatus({ latestReading, designVariant }: MotorStatusProps) {
  const [lastMotorChange, setLastMotorChange] = useState<MotorLog | null>(null)
  const [motorStats, setMotorStats] = useState({ uptime: 0, cycles: 0 })
  const supabase = createClient()


  const getStatusColor = () => {
    if (!latestReading) return "secondary"
    return latestReading.motor === "ON" ? "default" : "outline"
  }

  const getDesignAccent = () => {
    switch (designVariant) {
      case 2:
        return "text-cyan-600 dark:text-cyan-400"
      case 3:
        return "text-slate-600 dark:text-slate-400"
      case 4:
        return "text-amber-600 dark:text-amber-400"
      case 5:
        return "text-purple-600 dark:text-purple-400"
      default:
        return "text-blue-600 dark:text-blue-400"
    }
  }

  const shouldMotorBeOn = latestReading && latestReading.distance < 200
  const isMotorCorrect =
    latestReading &&
    ((shouldMotorBeOn && latestReading.motor === "ON") || (!shouldMotorBeOn && latestReading.motor === "OFF"))

  return (
    <Card className="animate-slide-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Power className="h-5 w-5" />
          Motor Control System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Status</span>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor()} className="animate-pulse">
              {latestReading?.motor || "Unknown"}
            </Badge>
            {!isMotorCorrect && latestReading && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Zap className={`h-4 w-4 ${getDesignAccent()}`} />
          <span className="text-sm">
            {latestReading?.motor === "ON" ? "Drainage pump active" : "Drainage pump idle"}
          </span>
        </div>

        {latestReading && (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${shouldMotorBeOn ? "bg-red-500" : "bg-green-500"}`} />
            <span className="text-sm text-muted-foreground">
              Distance: {latestReading.distance}cm {shouldMotorBeOn ? "(Below threshold)" : "(Above threshold)"}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Last updated:{" "}
            {latestReading
              ? new Date(latestReading.ts).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
              : "Never"}
          </span>
        </div>

        {lastMotorChange && (
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground mb-1">Last State Change:</div>
            <div className="text-sm">
              <span className="font-medium">{lastMotorChange.motor_state}</span> at{" "}
              {new Date(lastMotorChange.timestamp).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </div>
            <div className="text-xs text-muted-foreground">{lastMotorChange.reason}</div>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{motorStats.uptime}%</div>
              <div className="text-xs text-muted-foreground">24h Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{motorStats.cycles}</div>
              <div className="text-xs text-muted-foreground">ON Cycles</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
