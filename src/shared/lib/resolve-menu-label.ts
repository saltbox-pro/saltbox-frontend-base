export type MenuLabel = string | Record<string, string>;

export const resolveMenuLabel = (label: MenuLabel, locale: string): string =>
  typeof label === "object" ? (label[locale] ?? Object.values(label)[0] ?? "") : label;
