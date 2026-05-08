/**
 * Format a raw meaning string from the backend.
 * Cleans up leftover Chinese chars/pinyin and truncates to maxItems for neatness.
 */
export function formatMeaning(meaning, maxItems = 2) {
  if (!meaning) return '—'
  
  // Remove Chinese characters and [pinyin] brackets that leak into translations
  let cleaned = meaning
    .replace(/[\u4E00-\u9FA5]+/g, '')
    .replace(/\s*\[[a-zA-Z0-9\s]*\]/g, '')
    .trim()

  // Split by newlines, pipes, semicolons, or commas
  let parts = cleaned
    .split(/[|\r\n;,]+/)
    .map((part) => part.trim())
    .filter(Boolean)

  // Truncate to maxItems
  if (parts.length > maxItems) {
    parts = parts.slice(0, maxItems)
    // Add ellipsis if we truncated
    if (parts.length > 0) {
      parts[parts.length - 1] = parts[parts.length - 1] + '...'
    }
  }

  return parts.join('; ')
}
