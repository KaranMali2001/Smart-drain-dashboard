"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Cloud, Sun, CloudRain, Search, MapPin, DropletsIcon } from "lucide-react"
import { fetchWeatherData } from "@/lib/api"

interface WeatherData {
  city: string
  temperature: number
  humidity: number
  description: string
  icon: string
}

interface WeatherWidgetProps {
  designVariant: number
}

export function WeatherWidget({ designVariant }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [city, setCity] = useState("New York")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async (cityName: string) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("city name", cityName);
      const weatherData = await fetchWeatherData(cityName)

      console.log(weatherData, "w-data");
      if (weatherData) {
        setWeather(weatherData);
      } else {
        // Fallback to mock data if API fails
        const mockWeather: WeatherData = {
          city: cityName,
          temperature: Math.round(Math.random() * 30 + 10),
          description: ["clear sky", "few clouds", "light rain"][
            Math.floor(Math.random() * 3)
          ],
          humidity: Math.round(Math.random() * 40 + 40),
          icon: "01d",
        };
        setWeather(mockWeather);
        setError("Using mock data - Weather API not configured");
      }
    } catch (err) {
      setError("Failed to fetch weather data")
      console.log("[v0] Weather fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather(city)
  }, [])

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="h-8 w-8" />

    const iconCode = weather.icon
    if (iconCode.startsWith("01")) return <Sun className="h-8 w-8 text-yellow-500" />
    if (iconCode.startsWith("09") || iconCode.startsWith("10")) return <CloudRain className="h-8 w-8 text-blue-500" />
    return <Cloud className="h-8 w-8 text-gray-500" />
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

  const getDrainageImpact = () => {
    if (!weather) return null

    if (weather.description.includes("rain")) {
      return { level: "high", message: "Heavy drainage expected", color: "text-red-600" }
    } else if (weather.humidity > 80) {
      return { level: "medium", message: "Moderate drainage likely", color: "text-yellow-600" }
    } else {
      return { level: "low", message: "Low drainage expected", color: "text-green-600" }
    }
  }

  const drainageImpact = getDrainageImpact()

  return (
    <Card className="animate-slide-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Weather Impact Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && fetchWeather(city)}
          />
          <Button
            size="sm"
            onClick={() => fetchWeather(city)}
            disabled={isLoading}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
            {error}
          </div>
        )}

        {weather && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{weather.city}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {weather.description}
                </p>
              </div>
              {getWeatherIcon()}
            </div>

            <div className="text-center">
              <div className={`text-3xl font-bold ${getDesignAccent()}`}>
                {weather.temperature}°C
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DropletsIcon className="h-4 w-4 text-blue-500" />
                  <span>Humidity</span>
                </div>
                <span className="font-semibold">{weather.humidity}%</span>
              </div>
            </div>

            {drainageImpact && (
              <div className="pt-3 border-t">
                <div className="text-xs text-muted-foreground mb-1">
                  Drainage System Impact:
                </div>
                <div className={`text-sm font-medium ${drainageImpact.color}`}>
                  {drainageImpact.message}
                </div>
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
