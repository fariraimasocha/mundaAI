// The ten Zimbabwe provinces, matched by the names farmers actually type.
// Chivhu and Chikomba are Mashonaland East. They are not capitals, but that is
// what Elvis sent, and Open-Meteo misses the combined string.
export interface KnownPlace {
  capital: string;
  label: string;
  names: string[];
}

export const PLACES: KnownPlace[] = [
  { capital: "Bulawayo", label: "Bulawayo", names: ["bulawayo"] },
  { capital: "Harare", label: "Harare", names: ["harare"] },
  { capital: "Mutare", label: "Manicaland", names: ["manicaland", "mutare"] },
  { capital: "Bindura", label: "Mashonaland Central", names: ["mashonaland central", "bindura"] },
  {
    capital: "Marondera",
    label: "Mashonaland East",
    names: ["mashonaland east", "marondera", "chivhu", "chikomba"],
  },
  { capital: "Chinhoyi", label: "Mashonaland West", names: ["mashonaland west", "chinhoyi"] },
  { capital: "Masvingo", label: "Masvingo", names: ["masvingo"] },
  { capital: "Lupane", label: "Matabeleland North", names: ["matabeleland north", "lupane"] },
  { capital: "Gwanda", label: "Matabeleland South", names: ["matabeleland south", "gwanda"] },
  { capital: "Gweru", label: "Midlands", names: ["midlands", "gweru"] },
];

export function matchPlace(input: string): KnownPlace | null {
  const text = input.toLowerCase();
  const names = PLACES.flatMap((place) => place.names.map((name) => ({ name, place }))).sort(
    (left, right) => right.name.length - left.name.length,
  );
  return names.find((item) => text.includes(item.name))?.place ?? null;
}
