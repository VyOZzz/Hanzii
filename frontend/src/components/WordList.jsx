import { convertPinyin } from '../utils/pinyin'
import { formatMeaning } from '../utils/meaning'

export default function WordList({ items, onSelectWord }) {
  if (!items.length) return <p className="muted">No words found.</p>

  return (
    <ul className="word-list">
      {items.map((word) => (
        <li key={word.id}>
          <button type="button" className="word-item" onClick={() => onSelectWord(word.id)}>
            <strong>{word.hanzi}</strong>
            <span>{convertPinyin(word.pinyin)}</span>
            <span>{formatMeaning(word.meaning)}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
