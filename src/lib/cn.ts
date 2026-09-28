export function cn(...parts: Array<string | false | undefined | null>): string {
  return parts.filter((part): part is string => Boolean(part)).join(' ');
}
