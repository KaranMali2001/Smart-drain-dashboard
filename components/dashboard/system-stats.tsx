"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { BarChart3, Database } from "lucide-react"

interface SensorData {
  distance: number
  motor: "ON" | "OFF"
  ts: number
}

interface SystemStatsProps {
  data: SensorData[]
  designVariant: number
}

export function SystemStats({ data, designVariant }: SystemStatsProps) {
  const avgDistance = data.length > 0 ? data.reduce((sum, item) => sum + item.distance, 0) / data.length : 0

  const motorOnTime = data.filter((item) => item.motor === "ON").length
  const motorOnPercentage = data.length > 0 ? (motorOnTime / data.length) * 100 : 0

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    readings: Math.floor(Math.random() * 10) + 1,
  }))

  const getDesignAccent = () => {
    switch (designVariant) {
      case 2:
        return "#0891b2"
      case 3:
        return "#475569"
      case 4:
        return "#d97706"
      case 5:
        return "#7c3aed"
      default:
        return "#3b82f6"
    }
  }

  return (
    <Card className="animate-slide-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          System Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Avg Distance</span>
              <span className="font-medium">{avgDistance.toFixed(1)}cm</span>
            </div>
            <Progress value={avgDistance} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Motor Usage</span>
              <span className="font-medium">{motorOnPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={motorOnPercentage} className="h-2" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Database className="h-4 w-4" />
            24h Activity
          </h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData.slice(-12)}>
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Bar dataKey="readings" fill={getDesignAccent()} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
