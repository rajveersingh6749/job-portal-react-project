import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  // clsx accepts varargs or arrays; use spread so callers can pass multiple args or arrays
  return twMerge(clsx(...inputs));
}
