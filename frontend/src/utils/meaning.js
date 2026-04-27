/**
 * Format a raw meaning string from the backend.
 * Meanings may be separated by "|" — split them and join with ", ".
 */
export function formatMeaning(meaning) {
  if (!meaning) return '—'
  return meaning
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ')
}
