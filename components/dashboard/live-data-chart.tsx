"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface SensorData {
  distance: number;
  motor: "ON" | "OFF";
  ts: number;
}

interface LiveDataChartProps {
  data: SensorData[];
  designVariant: number;
}

export function LiveDataChart({ data, designVariant }: LiveDataChartProps) {
  const chartData = data.map((item, index) => ({
    time: new Date(item.ts).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    distance: item.distance,
    motorState: item.motor === "ON" ? 100 : 0,
    index,
  }));

  const getChartColors = () => {
    switch (designVariant) {
      case 2:
        return {
          primary: "#0891b2",
          secondary: "#06b6d4",
          threshold: "#ef4444",
        };
      case 3:
        return {
          primary: "#475569",
          secondary: "#64748b",
          threshold: "#ef4444",
        };
      case 4:
        return {
          primary: "#d97706",
          secondary: "#f59e0b",
          threshold: "#ef4444",
        };
      case 5:
        return {
          primary: "#7c3aed",
          secondary: "#8b5cf6",
          threshold: "#ef4444",
        };
      default:
        return {
          primary: "#3b82f6",
          secondary: "#60a5fa",
          threshold: "#ef4444",
        };
    }
  };

  const colors = getChartColors();

  return (
    <Card className="animate-slide-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Live Water Level Monitoring
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Motor activates automatically when distance &lt; 200cm
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colors.primary}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.primary}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} domain={[0, "dataMax + 50"]} />
              <ReferenceLine
                y={200}
                stroke={colors.threshold}
                strokeDasharray="5 5"
                label={{
                  value: "Motor Threshold (200cm)",
                  position: "topRight",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: any, name: string) => {
                  if (name === "Motor Status") {
                    return [value === 100 ? "ON" : "OFF", name];
                  }
                  if (name === "Distance (cm)") {
                    return [`${value}cm`, name];
                  }
                  return [value, name];
                }}
              />
              <Area
                type="monotone"
                dataKey="distance"
                stroke={colors.primary}
                fillOpacity={1}
                fill="url(#colorDistance)"
                strokeWidth={2}
                name="Distance (cm)"
              />
              <Line
                type="step"
                dataKey="motorState"
                stroke={colors.secondary}
                strokeWidth={2}
                dot={false}
                name="Motor Status"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
