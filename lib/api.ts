export interface IoTDataResponse {
  count: number;
  latest: {
    distance: number;
    motor: "ON" | "OFF";
    ts: number;
  };
}

export interface SensorReading {
  distance: number;
  motor: "ON" | "OFF";
  ts: number;
}

export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
}

export async function fetchSensorData(): Promise<SensorReading | null> {
  try {
    const response = await fetch("http://localhost:8000/data");
    if (response.ok) {
      const data: IoTDataResponse = await response.json();
      // Return the latest reading from the response
      return data.latest;
    }
  } catch (error) {
    console.log("[v0] Failed to fetch sensor data:", error);
  }
  return null;
}

export async function fetchWeatherData(
  city: string
): Promise<WeatherData | null> {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    
    if (!API_KEY) {
      console.log("[v0] Weather API key not found in environment variables");
      return null;
    }

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?q=${city}&key=${API_KEY}&aqi=no`
    );

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      city: data.location.name,
      temperature: Math.round(data.current.temp_c),
      humidity: data.current.humidity,
      description: data.current.condition.text,
      icon: data.current.condition.icon.split('/').pop()?.split('.')[0] || "01d",
    };
  } catch (error) {
    console.log("[v0] Failed to fetch weather data:", error);
  }
  return null;
}

export async function fetchIoTData(): Promise<IoTDataResponse | null> {
  try {
    const response = await fetch("http://localhost:8000/data");
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log("[v0] Failed to fetch IoT data:", error);
  }
  return null;
}
