import { ConvexError } from "convex/values";

export function errorMessage(error: unknown) {
  return error instanceof ConvexError && typeof error.data === "string"
    ? error.data
    : "Something went wrong. Your changes were not saved. Please try again.";
}
