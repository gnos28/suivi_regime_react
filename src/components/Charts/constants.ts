export const timeRanges = ["7D", "1M", "6M"] as const;
export type TimeRange = (typeof timeRanges)[number];
