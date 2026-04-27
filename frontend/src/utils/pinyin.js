/**
 * Convert numbered pinyin (wo3) to accented pinyin (wǒ)
 * Based on standard pinyin tone placement rules.
 */

const TONE_MARKS = {
  a: ['\u0101', '\u00e1', '\u01ce', '\u00e0'], // ā á ǎ à
  e: ['\u0113', '\u00e9', '\u011b', '\u00e8'], // ē é ě è
  i: ['\u012b', '\u00ed', '\u01d0', '\u00ec'], // ī í ǐ ì
  o: ['\u014d', '\u00f3', '\u01d2', '\u00f2'], // ō ó ǒ ò
  u: ['\u016b', '\u00fa', '\u01d4', '\u00f9'], // ū ú ǔ ù
  v: ['\u01d6', '\u01d8', '\u01da', '\u01dc'], // ǖ ǘ ǚ ǜ
  '\u00fc': ['\u01d6', '\u01d8', '\u01da', '\u01dc'], // ü → ǖ ǘ ǚ ǜ
}

/**
 * Convert a single pinyin syllable with tone number to accented form.
 * e.g. "wo3" → "wǒ", "nv3" → "nǚ", "lv4" → "lǜ"
 */
function convertSyllable(syllable) {
  const match = syllable.match(/^([a-zA-Z\u00fc]+)([1-5])$/)
  if (!match) return syllable

  let base = match[1]
  const tone = parseInt(match[2], 10)

  // Tone 5 = neutral, just return without number
  if (tone === 5) return base.replace(/v/g, '\u00fc').replace(/V/g, '\u00dc')

  // Replace v → ü
  base = base.replace(/v/g, '\u00fc').replace(/V/g, '\u00dc')

  const lower = base.toLowerCase()
  const vowels = 'aeiou\u00fc'

  let targetIdx = -1

  // Rule 1: If contains 'a' or 'e', that vowel gets the tone
  const aIdx = lower.indexOf('a')
  const eIdx = lower.indexOf('e')
  if (aIdx !== -1) {
    targetIdx = aIdx
  } else if (eIdx !== -1) {
    targetIdx = eIdx
  } else {
    // Rule 2: If contains 'ou', 'o' gets the tone
    const ouIdx = lower.indexOf('ou')
    if (ouIdx !== -1) {
      targetIdx = ouIdx
    } else {
      // Rule 3: Last vowel gets the tone
      for (let i = lower.length - 1; i >= 0; i--) {
        if (vowels.includes(lower[i])) {
          targetIdx = i
          break
        }
      }
    }
  }

  if (targetIdx === -1) return base

  const targetChar = lower[targetIdx]
  const marks = TONE_MARKS[targetChar]
  if (!marks) return base

  const replacement = marks[tone - 1]
  const isUpper = base[targetIdx] !== lower[targetIdx]
  const finalChar = isUpper ? replacement.toUpperCase() : replacement

  return base.substring(0, targetIdx) + finalChar + base.substring(targetIdx + 1)
}

/**
 * Convert a full pinyin string with tone numbers to accented form.
 * Handles multiple syllables separated by spaces.
 * e.g. "ni3 hao3" → "nǐ hǎo"
 * e.g. "Zhong1 guo2" → "Zhōng guó"
 *
 * Also handles already-accented pinyin (passes through unchanged).
 */
export function convertPinyin(text) {
  if (!text) return text

  // If text already contains tone marks, return as-is
  if (/[\u0101\u00e1\u01ce\u00e0\u0113\u00e9\u011b\u00e8\u012b\u00ed\u01d0\u00ec\u014d\u00f3\u01d2\u00f2\u016b\u00fa\u01d4\u00f9\u01d6\u01d8\u01da\u01dc]/.test(text)) {
    return text
  }

  // Replace each syllable+number pattern
  return text.replace(/[a-zA-Z\u00fc]+[1-5]/g, (match) => convertSyllable(match))
}

export default convertPinyin
