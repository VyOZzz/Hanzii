import { convertPinyin } from '../utils/pinyin'
import { formatMeaning } from '../utils/meaning'

export default function WordList({ items, onSelectWord }) {
  // Lọc bỏ các từ vô nghĩa (như %, A, v.v.) bằng cách yêu cầu có ít nhất 1 chữ Hán hoặc 〇
  const validItems = items.filter(word => /[\u4E00-\u9FA5\u3007]/.test(word.hanzi))

  if (!validItems.length) return <p className="muted">Không tìm thấy từ phù hợp.</p>

  return (
    <ul className="word-list">
      {validItems.map((word) => (
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
