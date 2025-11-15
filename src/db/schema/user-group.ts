const USER_GROUP = [
  "A",
  "B",
  "C",
  "D",
  "E",
] as const;

export type Groups = (typeof USER_GROUP)[number];