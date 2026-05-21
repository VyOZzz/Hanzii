import { useMemo, useState } from 'react'

export default function QuizMode({ questions, onExit, onSubmitAnswer }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const current = questions[index]
  const progress = useMemo(() => {
    if (!questions.length) return 0
    return Math.round((index / questions.length) * 100)
  }, [index, questions.length])

  async function handleNext() {
    if (!current || !selected) return
    const isCorrect = selected === current.correctAnswer
    if (isCorrect) setScore((s) => s + 1)
    await onSubmitAnswer(current.wordId, isCorrect)

    if (index + 1 >= questions.length) {
      setDone(true)
      return
    }

    setIndex((i) => i + 1)
    setSelected('')
  }

  if (done) {
    return (
      <article className="card card-accent fade-in">
        <h2>Kết quả bài quiz</h2>
        <p>
          Bạn đúng <strong>{score}</strong> / <strong>{questions.length}</strong> câu.
        </p>
        <button type="button" className="btn-primary" onClick={onExit}>Quay lại sổ tay</button>
      </article>
    )
  }

  if (!current) return null

  return (
    <article className="card card-accent fade-in">
      <div className="row between" style={{ marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>Quiz từ vựng</h2>
        <button type="button" className="btn-ghost" onClick={onExit}>Thoát</button>
      </div>

      <div className="review-progress-bar" style={{ marginBottom: 16 }}>
        <div className="review-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="section-eyebrow">Câu {index + 1} / {questions.length}</p>
      <h3 style={{ fontSize: 42, margin: '6px 0 12px' }}>{current.hanzi}</h3>
      <p className="muted" style={{ marginTop: 0 }}>{current.pinyin}</p>

      <div className="stack">
        {current.choices.map((choice) => (
          <button
            key={choice}
            type="button"
            className={selected === choice ? 'btn-primary' : 'btn-ghost'}
            style={{ textAlign: 'left' }}
            onClick={() => setSelected(choice)}
          >
            {choice}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn-primary"
        style={{ marginTop: 14, width: '100%' }}
        onClick={handleNext}
        disabled={!selected}
      >
        {index + 1 === questions.length ? 'Hoàn thành' : 'Câu tiếp theo'}
      </button>
    </article>
  )
}
