export const CENTER_CITIES = [
  "Jeddah",
  "Yanbu",
  "Dammam",
  "Al Khobar",
  "NEOM",
  "Jazan",
] as const;

export type CenterCity = (typeof CENTER_CITIES)[number];
