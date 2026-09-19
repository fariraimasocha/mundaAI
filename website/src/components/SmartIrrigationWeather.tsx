import React, { useState, useEffect } from "react";
import {
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  Compass,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Layers,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { WeatherInfo, SensorZone, Language, FarmerProfile } from "../types";
import { TRANSLATIONS } from "../data/translations";

interface SmartIrrigationWeatherProps {
  language: Language;
  farmer: FarmerProfile;
  onAskIrrigation: () => void;
}

export const SmartIrrigationWeather: React.FC<SmartIrrigationWeatherProps> = ({
  language,
  farmer,
  onAskIrrigation,
}) => {
  const t = TRANSLATIONS[language];

  const [selectedRegion, setSelectedRegion] = useState("Mashonaland West (Chinhoyi)");
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [zones, setZones] = useState<SensorZone[]>([]);
  const [dataMode, setDataMode] = useState<"SIMULATED" | "MANUAL">("SIMULATED");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWeather();
    fetchSensors();
  }, [selectedRegion]);

  const fetchWeather = async () => {
    try {
      const res = await fetch(`/api/weather?location=${encodeURIComponent(selectedRegion)}`);
      const json = await res.json();
      if (json.data) setWeather(json.data);
    } catch (err) {
      console.error("Weather fetch error:", err);
    }
  };

  const fetchSensors = async () => {
    try {
      const res = await fetch("/api/sensors");
      const json = await res.json();
      if (json.zones) setZones(json.zones);
    } catch (err) {
      console.error("Sensors fetch error:", err);
    }
  };

  const handleManualAdjust = (zoneId: string, delta: number) => {
    setDataMode("MANUAL");
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const newMoisture = Math.max(5, Math.min(100, z.soilMoisture + delta));
          let newStatus = "OPTIMAL";
          if (newMoisture < 25) newStatus = "CRITICAL";
          else if (newMoisture < 35) newStatus = "NEEDS ATTENTION";
          else if (newMoisture > 60) newStatus = "OPTIMAL (MULCHED)";
          return { ...z, soilMoisture: newMoisture, status: newStatus };
        }
        return z;
      })
    );
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header with Zimbabwe Region & Status */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <CloudRain className="w-3.5 h-3.5" />
            <span>Zimbabwe Meteorological Services & IoT Moisture Telemetry</span>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 mt-2 font-['Outfit',sans-serif]">
            Weather Intelligence & Smart Irrigation
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Synthesizing 48-hour convectional rainfall forecasts with field root-zone moisture to make informed irrigation decisions.
          </p>
        </div>

        {/* Region Selector & Mode */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 cursor-pointer"
          >
            <option value="Mashonaland West (Chinhoyi)">Mashonaland West (Chinhoyi) • Region IIa</option>
            <option value="Harare">Harare Metropolitan • Region IIa</option>
          </select>

          <span className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
            DATA STATUS: {dataMode === "SIMULATED" ? "SIMULATED SENSORS" : "MANUAL TEST OVERRIDE"}
          </span>
        </div>
      </div>

      {/* Weather Grid */}
      {weather && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-600" />
              Temperature
            </span>
            <div className="text-3xl font-black text-stone-900 font-['Outfit',sans-serif]">
              {weather.temperature}°C
            </div>
            <p className="text-xs text-stone-600 font-medium">{weather.condition}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-blue-600" />
              Rain Probability (48h)
            </span>
            <div className="text-3xl font-black text-blue-700 font-['Outfit',sans-serif]">
              {weather.rainProbability}%
            </div>
            <p className="text-xs text-blue-900 font-medium">Moderate to Heavy Showers</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-emerald-600" />
              Relative Humidity
            </span>
            <div className="text-3xl font-black text-stone-900 font-['Outfit',sans-serif]">
              {weather.humidity}%
            </div>
            <p className="text-xs text-stone-600 font-medium">Last 24h Rain: {weather.rainfallLast24h}mm</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-stone-600" />
              Wind Speed
            </span>
            <div className="text-3xl font-black text-stone-900 font-['Outfit',sans-serif]">
              {weather.windSpeed} km/h
            </div>
            <p className="text-xs text-stone-600 font-medium">Updated: {weather.timestamp}</p>
          </div>
        </div>
      )}

      {/* Agricultural Advisory Banner */}
      {weather && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900 uppercase">
                48-Hour Agricultural Advisory
              </span>
              <span className="text-xs text-blue-700 font-semibold">• Zimbabwe Met Services</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-blue-950">
              {weather.agriculturalAdvisory}
            </p>
          </div>

          <button
            onClick={onAskIrrigation}
            className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 whitespace-nowrap shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consult AI Agronomist</span>
          </button>
        </div>
      )}

      {/* Field Soil Moisture Zones (IoT Telemetry) */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-stone-900 font-['Outfit',sans-serif]">
              Field Zone Soil Moisture Gauges
            </h3>
            <p className="text-xs text-stone-500">
              Real-time capacitive sensor telemetry calibrated against field capacity and wilting points.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setDataMode("SIMULATED");
                fetchSensors();
              }}
              className="text-xs text-stone-600 hover:text-stone-900 underline font-medium"
            >
              Reset to Sensor Feed
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {zones.map((zone) => {
            const isCritical = zone.status === "CRITICAL";
            const isAttention = zone.status === "NEEDS ATTENTION";
            const isMulched = zone.status.includes("MULCHED");

            return (
              <div
                key={zone.id}
                className={`p-5 rounded-2xl border space-y-4 transition-all ${
                  isCritical
                    ? "border-rose-300 bg-rose-50/30"
                    : isAttention
                    ? "border-amber-300 bg-amber-50/30"
                    : "border-emerald-300 bg-emerald-50/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900">{zone.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCritical
                        ? "bg-rose-100 text-rose-800"
                        : isAttention
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {zone.status}
                  </span>
                </div>

                {/* Progress Bar Gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-stone-600">Soil Moisture</span>
                    <span className="text-stone-900 font-bold">{zone.soilMoisture}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCritical
                          ? "bg-rose-500"
                          : isAttention
                          ? "bg-amber-500"
                          : isMulched
                          ? "bg-emerald-600"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${zone.soilMoisture}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>Wilting Pt: 20%</span>
                    <span>Threshold: {zone.threshold}%</span>
                    <span>Saturation: 80%</span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-600 space-y-1 border-t border-stone-200/60 pt-3">
                  <div>Soil Temp: <strong>{zone.soilTemp}°C</strong></div>
                  <div>Last Irrigation: <strong>{zone.lastWatered}</strong></div>
                </div>

                {/* Interactive manual controls for demo simulation */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-200/60">
                  <span className="text-[10px] text-stone-400">Test Stress:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleManualAdjust(zone.id, -10)}
                      className="px-2 py-0.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 text-[10px] font-bold"
                    >
                      -10% Dry
                    </button>
                    <button
                      onClick={() => handleManualAdjust(zone.id, +15)}
                      className="px-2 py-0.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 text-[10px] font-bold"
                    >
                      +15% Wet
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
