"use client";

import { useEffect, useState } from "react";
import { place } from "../now";

// Open-Meteo weather codes → short labels (https://open-meteo.com/en/docs)
function describe(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Storms";
}

function formatTime() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: place.timeZone,
  }).format(new Date());
}

export default function LocalInfo() {
  const [time, setTime] = useState<string | null>(null);
  const [weather, setWeather] = useState<{ temp: number; label: string } | null>(null);

  // Live clock, refreshed every 15 seconds.
  useEffect(() => {
    const tick = () => setTime(formatTime());
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  // Current weather from Open-Meteo (free, no API key). Refreshed every 15 minutes.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
          `&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.current) {
          setWeather({ temp: Math.round(data.current.temperature_2m), label: describe(data.current.weather_code) });
        }
      } catch {
        /* weather is a nice-to-have; stay quiet if it fails */
      }
    };
    load();
    const id = setInterval(load, 15 * 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 whitespace-nowrap text-[#888890] font-mono text-xs tabular-nums">
      <span className="text-white font-sans text-sm font-medium">{place.label}</span>
      <span className="min-w-[8ch] whitespace-nowrap" suppressHydrationWarning>
        {time ?? "—"}
      </span>
      {weather && (
        <span className="hidden min-[375px]:inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-white/20">·</span>
          <span>{weather.temp}°F</span>
          <span className="hidden sm:inline">{weather.label}</span>
        </span>
      )}
    </div>
  );
}
