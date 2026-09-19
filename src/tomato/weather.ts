import { matchPlace } from "./places.js";

interface ForecastResponse {
  current?: {
    precipitation?: number;
    relative_humidity_2m?: number;
    temperature_2m?: number;
    weather_code?: number;
  };
  daily?: {
    precipitation_probability_max?: number[];
    precipitation_sum?: number[];
    time?: string[];
  };
}

interface GeoResponse {
  results?: GeoResult[];
}

interface GeoResult {
  admin1?: string;
  country_code?: string;
  latitude: number;
  longitude: number;
  name: string;
}

export async function lookupWeather(place: string): Promise<null | string> {
  const known = matchPlace(place);
  const queries = [...new Set(known ? [...placeQueries(place), known.capital] : placeQueries(place))];
  for (const query of queries) {
    const line = await lookupOne(query);
    if (line) return line;
  }
  return null;
}

// "Chikomba, chivhu" is searched as Chivhu first. Only a Zimbabwe match is used.
// A miss returns null. The caller still answers; it does not drop the photo.
export function placeQueries(place: string): string[] {
  const parts = place
    .split(/[,;/]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 1);
  const ordered = parts.length > 0 ? [...parts].reverse() : [place.trim()].filter(Boolean);
  return [...new Set(ordered)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function lookupOne(place: string): Promise<null | string> {
  const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geoUrl.searchParams.set("count", "5");
  geoUrl.searchParams.set("format", "json");
  geoUrl.searchParams.set("language", "en");
  geoUrl.searchParams.set("name", place);

  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) return null;
  const geo = (await geoResponse.json()) as GeoResponse;
  const results = geo.results ?? [];
  const hit = results.find((item) => item.country_code === "ZW");
  if (!hit) return null;

  const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
  forecastUrl.searchParams.set("current", "temperature_2m,relative_humidity_2m,precipitation,weather_code");
  forecastUrl.searchParams.set("daily", "precipitation_sum,precipitation_probability_max");
  forecastUrl.searchParams.set("forecast_days", "3");
  forecastUrl.searchParams.set("latitude", String(hit.latitude));
  forecastUrl.searchParams.set("longitude", String(hit.longitude));
  forecastUrl.searchParams.set("timezone", "auto");

  const forecastResponse = await fetch(forecastUrl);
  if (!forecastResponse.ok) return null;
  const forecast = (await forecastResponse.json()) as ForecastResponse;
  if (!isRecord(forecast.current) && !forecast.daily) return null;

  const placeName = [hit.name, hit.admin1].filter(Boolean).join(", ");
  const temperature = forecast.current?.temperature_2m;
  const humidity = forecast.current?.relative_humidity_2m;
  const rainNow = forecast.current?.precipitation;
  const days = (forecast.daily?.time ?? []).slice(0, 3).map((day, index) => {
    const chance = forecast.daily?.precipitation_probability_max?.[index];
    const sum = forecast.daily?.precipitation_sum?.[index];
    return `${day}: ${String(chance ?? "?")}% chance, ${String(sum ?? "?")} mm`;
  });

  return [
    `${placeName} (${hit.country_code ?? "unknown country"}).`,
    `Now ${String(temperature ?? "?")}°C, humidity ${String(humidity ?? "?")}%, ${sky(forecast.current?.weather_code)}, rain ${String(rainNow ?? "?")} mm.`,
    `Next days: ${days.join("; ")}.`,
  ].join(" ");
}

function sky(code: number | undefined): string {
  if (code === undefined) return "unknown sky";
  if (code === 0) return "clear";
  if (code <= 3) return "cloudy";
  if (code <= 48) return "fog";
  if (code <= 67) return "rain";
  if (code <= 77) return "snow";
  if (code <= 82) return "showers";
  return "storms";
}
