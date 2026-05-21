import { useRef, useState } from 'react'

export default function HandwritingCanvas({ onRecognize }) {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [strokes, setStrokes] = useState([])
  const strokesRef = useRef([])
  const currentStroke = useRef({ x: [], y: [] })
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function getSafeStrokes() {
    const canvas = canvasRef.current
    if (!canvas) return []

    const maxX = Math.max(0, canvas.width - 1)
    const maxY = Math.max(0, canvas.height - 1)
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

    const merged = [...strokesRef.current]
    if (drawing && currentStroke.current.x.length > 0 && currentStroke.current.y.length > 0) {
      merged.push({ ...currentStroke.current })
    }

    return merged
      .map((s) => {
        const len = Math.min(s.x.length, s.y.length)
        const safeX = []
        const safeY = []

        for (let i = 0; i < len; i += 1) {
          const x = Number(s.x[i])
          const y = Number(s.y[i])
          if (!Number.isFinite(x) || !Number.isFinite(y)) continue
          safeX.push(Math.round(clamp(x, 0, maxX)))
          safeY.push(Math.round(clamp(y, 0, maxY)))
        }

        return [safeX, safeY]
      })
      .filter(([x, y]) => x.length > 0 && y.length > 0)
  }

  function getPos(event) {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    if (!rect || rect.width <= 0 || rect.height <= 0) {
      return { x: 0, y: 0 }
    }

    const e = event.nativeEvent || event
    let clientX = rect.left
    let clientY = rect.top

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX
      clientY = e.changedTouches[0].clientY
    } else if (e.clientX !== undefined) {
      clientX = e.clientX
      clientY = e.clientY
    }

    const scaleX = rect.width > 0 ? (canvas.width / rect.width) : 1
    const scaleY = rect.height > 0 ? (canvas.height / rect.height) : 1

    const rawX = (clientX - rect.left) * scaleX
    const rawY = (clientY - rect.top) * scaleY

    const safeRawX = Number.isFinite(rawX) ? rawX : 0
    const safeRawY = Number.isFinite(rawY) ? rawY : 0

    const maxX = Math.max(0, canvas.width - 1)
    const maxY = Math.max(0, canvas.height - 1)

    const x = Math.round(Math.min(Math.max(safeRawX, 0), maxX))
    const y = Math.round(Math.min(Math.max(safeRawY, 0), maxY))

    return {
      x: Number.isFinite(x) ? x : 0,
      y: Number.isFinite(y) ? y : 0,
    }
  }

  function start(event) {
    event.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getPos(event)
    ctx.beginPath()
    ctx.moveTo(x, y)
    currentStroke.current = { x: [x], y: [y] }
    setDrawing(true)
    setSuggestions([])
    setError('')
  }

  function move(event) {
    event.preventDefault()
    if (!drawing) return
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getPos(event)
    ctx.lineWidth = 15 // Tăng độ dày nét vẽ
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1e293b'
    ctx.lineTo(x, y)
    ctx.stroke()
    currentStroke.current.x.push(x)
    currentStroke.current.y.push(y)
  }

  function end(event) {
    if (!drawing) return
    event.preventDefault()
    setDrawing(false)
    const strokeToSave = { ...currentStroke.current }
    setStrokes((prev) => {
      const next = [...prev, strokeToSave]
      strokesRef.current = next
      return next
    })
    currentStroke.current = { x: [], y: [] }
  }

  function clearCanvas() {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
    strokesRef.current = []
    setStrokes([])
    setSuggestions([])
    setError('')
  }

  async function recognize() {
    const safeInk = getSafeStrokes()
    if (safeInk.length === 0) {
      setError('Vui lòng vẽ ít nhất một nét')
      return
    }

    setLoading(true)
    setError('')

    try {
      const payload = {
        input_type: 0,
        requests: [
          {
            language: 'zh-CN',
            writing_guide: {
              writing_area_width: canvasRef.current.width,
              writing_area_height: canvasRef.current.height,
            },
            ink: safeInk,
          },
        ],
      }

      const res = await fetch('/api/proxy/handwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()
      let candidates = data?.[1]?.[0]?.[1] ?? []

      if (candidates.length === 0) {
        const fallbackPayload = {
          ...payload,
          requests: payload.requests.map((req) => ({ ...req, language: 'zh' })),
        }
        const fallbackRes = await fetch('/api/proxy/handwriting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fallbackPayload),
        })

        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json()
          candidates = fallbackData?.[1]?.[0]?.[1] ?? []
        }
      }

      if (candidates.length > 0) {
        setSuggestions(candidates.slice(0, 8))
      } else {
        setError('Không nhận diện được, hãy thử vẽ rõ hơn')
      }
    } catch (e) {
      setError(`Lỗi nhận diện: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        style={{ border: '2px solid #cbd5e1', borderRadius: 10, background: '#fff', width: '100%', aspectRatio: '1 / 1', touchAction: 'none' }}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <div className="row" style={{ marginTop: 8, gap: 8 }}>
        <button type="button" className="btn-ghost" onClick={clearCanvas}>Xóa</button>
        <button
          type="button"
          className="btn-primary"
          onClick={recognize}
          disabled={loading || (strokes.length === 0 && currentStroke.current.x.length === 0)}
          style={{ flex: 1 }}
        >
          {loading ? 'Đang nhận diện...' : 'Nhận diện chữ Hán'}
        </button>
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 6 }}>{error}</p>}
      {suggestions.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 6px 0' }}>Chọn ký tự phù hợp:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {suggestions.map((char) => (
              <button
                key={char}
                type="button"
                className="btn-ghost"
                style={{ fontSize: 28, padding: '8px 12px', minWidth: 48 }}
                onClick={() => onRecognize(char)}
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
