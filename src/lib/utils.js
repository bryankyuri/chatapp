import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const debugVariant = (name, params, result) => {
  console.group(`Variant Debug: ${name}`);
  console.log("Parameters:", params);
  console.log("Generated Classes:", result);
  console.groupEnd();
  return result;
};
