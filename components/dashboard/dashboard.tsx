"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LiveDataChart } from "./live-data-chart"
import { MotorStatus } from "./motor-status"
import { WeatherWidget } from "./weather-widget"
import { SystemStats } from "./system-stats"
import { AlertsPanel } from "./alerts-panel"
import { Activity, Droplets, Zap, Gauge, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface DashboardProps {
  user: User
}

interface SensorData {
  distance: number
  motor: "ON" | "OFF"
  ts: number
}

interface IoTDataResponse {
  count: number
  latest: {
    distance: number
    motor: "ON" | "OFF"
    ts: number
  }
}

export default function Dashboard({ user }: DashboardProps) {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [latestReading, setLatestReading] = useState<SensorData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [totalReadings, setTotalReadings] = useState(0);
  const [currentDesign, setCurrentDesign] = useState(1);
  const router = useRouter();
  const supabase = createClient();

  // Connect to backend server on port 8000 for real IoT data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch from your backend server
        const response = await fetch("http://localhost:8000/data");
        if (response.ok) {
          const iotData: IoTDataResponse = await response.json();
          console.log("[v0] Received IoT data:", iotData);

          if (
            iotData.latest &&
            iotData.latest.distance !== undefined &&
            iotData.latest.motor &&
            iotData.latest.ts
          ) {
            const newReading: SensorData = {
              distance: iotData.latest.distance,
              motor: iotData.latest.motor,
              ts: iotData.latest.ts,
            };
            setSensorData((prev) => [...prev.slice(-49), newReading]);
            setLatestReading(newReading);
            setTotalReadings(iotData.count); // Set total readings from count field
            setIsConnected(true);
          }
        } else {
          // Fallback to mock data if backend is not available
          const mockData: SensorData = {
            distance: Math.random() * 100 + 100,
            motor: Math.random() > 0.5 ? "ON" : "OFF",
            ts: Date.now(),
          };
          setSensorData((prev) => [...prev.slice(-49), mockData]);
          setLatestReading(mockData);
          setIsConnected(false);
        }
      } catch (error) {
        console.log("[v0] Backend connection failed, using mock data:", error);
        // Fallback to mock data
        const mockData: SensorData = {
          distance: Math.random() * 100 + 100,
          motor: Math.random() > 0.5 ? "ON" : "OFF",
          ts: Date.now(),
        };
        setSensorData((prev) => [...prev.slice(-49), mockData]);
        setLatestReading(mockData);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling every 3 seconds to match your backend
    // const interval = setInterval(fetchData, 3000)
    // return () => clearInterval(interval)
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const getDesignClasses = () => {
    switch (currentDesign) {
      case 2:
        return "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20";
      case 3:
        return "bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20";
      case 4:
        return "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20";
      case 5:
        return "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20";
      default:
        return "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20";
    }
  };

  return (
    <div
      className={`min-h-screen p-6 ${getDesignClasses()} transition-all duration-500`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Droplets className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Smart Drainage Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((design) => (
                <Button
                  key={design}
                  variant={currentDesign === design ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentDesign(design)}
                  className="w-8 h-8 p-0"
                >
                  {design}
                </Button>
              ))}
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="animate-slide-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Connection Status
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isConnected ? "default" : "destructive"}
                  className="animate-pulse"
                >
                  {isConnected ? "Backend Connected" : "Using Mock Data"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Water Level</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestReading
                  ? `${latestReading.distance.toFixed(1)}cm`
                  : "--"}
              </div>
              <p className="text-xs text-muted-foreground">
                Distance from sensor
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Motor Status
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestReading?.motor || "--"}
              </div>
              <p className="text-xs text-muted-foreground">
                {latestReading?.distance && latestReading.distance < 200
                  ? "Auto ON (< 200cm)"
                  : "Auto OFF (≥ 200cm)"}
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Readings
              </CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isConnected ? totalReadings : sensorData.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {isConnected ? "From IoT system" : "Local readings"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Data Chart */}
          <div className="lg:col-span-2">
            <LiveDataChart data={sensorData} designVariant={currentDesign} />
          </div>

          {/* Weather Widget */}
          <div className="space-y-6">
            <WeatherWidget designVariant={currentDesign} />
            <MotorStatus
              latestReading={latestReading}
              designVariant={currentDesign}
            />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemStats data={sensorData} designVariant={currentDesign} />
          <AlertsPanel designVariant={currentDesign} />
        </div>
      </div>
    </div>
  );
}
