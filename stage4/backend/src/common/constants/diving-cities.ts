export const DIVING_CITIES = [
  "Jeddah",
  "Yanbu",
  "Dammam",
  "Khobar",
  "NEOM",
  "Jazan",
] as const;

export type DivingCity = (typeof DIVING_CITIES)[number];
