import { useSearchParams } from "react-router-dom";

// Campaign source for the /at-home landing page.
// Every flyer carries a different ?src= (e.g. ?src=toorak-flyer) so enquiries
// can be traced back to the card they came from.
export const DEFAULT_AT_HOME_SOURCE = "athome";

// Keeps whatever arrives in the URL safe to print into an email/record:
// no newlines, no angle brackets, capped length, and a fallback if empty.
export function sanitizeSource(value: string | null | undefined): string {
  const cleaned = (value ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 64)
    .trim();
  return cleaned || DEFAULT_AT_HOME_SOURCE;
}

export function useAtHomeSource(): string {
  const [searchParams] = useSearchParams();
  return sanitizeSource(searchParams.get("src"));
}
