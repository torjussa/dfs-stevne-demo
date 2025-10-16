import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Shooter class taxonomies
export const BASE_CLASSES = [
  "NU",
  "ER",
  "R",
  "J",
  "EJ",
  "1",
  "2",
  "3",
  "4",
  "5",
  "v55",
  "v65",
  "v75",
] as const;

export const SPECIAL_CLASSES = ["JEG", "KIK", "Å", "HK416"] as const;

// Deterministic demo helper: decide allowed classes per date+time
// This simulates rules that apply to an entire time, not per slot
export function getAllowedClassesForTime(
  time: string,
  date: string
): string[] | undefined {
  // Hash a simple number from date+time string for determinism
  const seed = Array.from(`${date}-${time}`).reduce(
    (acc, ch) => acc + ch.charCodeAt(0),
    0
  );

  // 95% of times are available to all classes (return undefined)
  // 5% have restrictions
  if (seed % 20 !== 0) {
    return undefined; // Available to all classes
  }

  // For the remaining 5%, apply restrictions to special classes
  const restrictedPresets: string[][] = [["JEG"], ["HK416"], ["Å"], ["KIK"]];
  return restrictedPresets[seed % restrictedPresets.length];
}
