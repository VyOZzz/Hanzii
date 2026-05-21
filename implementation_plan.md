# Kịch bản triển khai: Stroke Animation & Handwriting Recognition

Bổ sung 2 tính năng còn thiếu để báo cáo khớp hoàn toàn với sơ đồ Use Case.

---

## Tổng quan

| Tính năng | Công nghệ | Ước tính thời gian |
|---|---|---|
| **View Stroke Animation** | `hanzi-writer` (npm) | ~20 phút |
| **Look up by Handwriting** | Google Input Tools API (miễn phí) | ~30 phút |

> [!IMPORTANT]
> **Không cần thay đổi bất kỳ file Backend nào.** Toàn bộ 2 tính năng đều chạy hoàn toàn ở Frontend (trình duyệt).
> Nút "Nét vẽ" và `HandwritingCanvas.jsx` đã **có sẵn trong code**, chỉ cần bổ sung logic.

---

## Phần 1: View Stroke Animation (hanzi-writer)

### Bối cảnh

Hiện tại trang Chi tiết từ vựng (`DictionaryPage.jsx` dòng 282) đang chỉ hiển thị **số nét** (`strokeCount`) dưới dạng text. Chúng ta sẽ thêm một nút **"Xem animation nét chữ"** ngay bên cạnh, khi bấm sẽ hiện animation vẽ chữ Hán từng nét một.

### Công nghệ

**`hanzi-writer`** — thư viện JavaScript mã nguồn mở, tự động kéo dữ liệu nét từ CDN của `hanzi-writer-data` (bộ dữ liệu SVG cho hơn 9000 chữ Hán phổ biến).

- Không cần lưu dữ liệu ở server
- Không cần API key
- Hỗ trợ animation từng nét, tô màu, quiz nét vẽ

### Những thứ cần làm

#### Bước 1: Cài thư viện
```bash
# Chạy trong thư mục frontend/
npm install hanzi-writer
```

#### Bước 2: Tạo component mới `StrokeAnimation.jsx`

**File:** `frontend/src/components/StrokeAnimation.jsx`

```jsx
import { useEffect, useRef } from 'react'
import HanziWriter from 'hanzi-writer'

export default function StrokeAnimation({ hanzi }) {
  const containerRef = useRef(null)
  const writerRef = useRef(null)

  useEffect(() => {
    if (!hanzi || !containerRef.current) return

    // Xóa nội dung cũ
    containerRef.current.innerHTML = ''

    // Lấy ký tự đầu tiên nếu là từ nhiều chữ
    const char = hanzi[0]

    writerRef.current = HanziWriter.create(containerRef.current, char, {
      width: 200,
      height: 200,
      padding: 10,
      showOutline: true,
      strokeColor: '#1e293b',
      outlineColor: '#e2e8f0',
      drawingColor: '#6366f1',
      animationSpeed: 1,
      delayBetweenStrokes: 300,
    })

    writerRef.current.animateCharacter()

    return () => {
      // Cleanup khi unmount
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [hanzi])

  function handleReplay() {
    writerRef.current?.animateCharacter()
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div ref={containerRef} style={{ margin: '0 auto', display: 'inline-block' }} />
      <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button type="button" className="btn-ghost" onClick={handleReplay}>
          ▶ Phát lại
        </button>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
        * Hiển thị animation cho ký tự đầu tiên
      </p>
    </div>
  )
}
```

#### Bước 3: Tích hợp vào `DictionaryPage.jsx`

**Thêm import** (dòng 11):
```jsx
import StrokeAnimation from '../components/StrokeAnimation'
```

**Thêm state** (sau dòng 56):
```jsx
const [showStroke, setShowStroke] = useState(false)
```

**Thêm nút và component** vào phần chi tiết từ vựng (sau phần hiển thị strokeCount, dòng ~282):
```jsx
{/* Thay thế dòng chỉ hiển thị strokeCount bằng: */}
<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
  {wordDetail.strokeCount > 0 && (
    <span><strong>Số nét:</strong> {wordDetail.strokeCount}</span>
  )}
  <button
    type="button"
    className="btn-ghost"
    style={{ fontSize: 13, padding: '4px 10px' }}
    onClick={() => setShowStroke(v => !v)}
  >
    {showStroke ? 'Ẩn nét chữ' : '✏️ Xem animation nét chữ'}
  </button>
</div>

{showStroke && (
  <div className="fade-in" style={{ margin: '16px 0', padding: 16,
    background: 'var(--bg-glass)', borderRadius: 12 }}>
    <StrokeAnimation hanzi={wordDetail.hanzi} />
  </div>
)}
```

**Reset khi chọn từ mới** (trong `useEffect` dòng ~69):
```jsx
setShowStroke(false)  // thêm dòng này
setGrammarAnalysis(null)
```

---

## Phần 2: Look up by Handwriting (Google Input Tools)

### Bối cảnh

File `HandwritingCanvas.jsx` đã có sẵn:
- ✅ Canvas vẽ tay bằng mouse/touch
- ✅ Nút "Xóa nét" 
- ❌ Nút "Nhận diện" đang trả về cố định chữ `'你'` (mock)

Chúng ta sẽ thay hàm `recognizeMock()` bằng logic gọi thực đến **Google Input Tools API**.

### Công nghệ

**Google Input Tools API** — API miễn phí, không cần API key, nhận tọa độ các nét vẽ và trả về danh sách chữ Hán gợi ý.

- Endpoint: `https://www.google.com/inputtools/request`
- Gửi: mảng tọa độ `[x[], y[]]` cho mỗi nét vẽ
- Nhận: danh sách tối đa 10 ký tự khớp nhất

> [!WARNING]
> API này là của Google, gọi trực tiếp từ trình duyệt sẽ bị CORS.
> **Giải pháp:** Tạo một endpoint proxy nhỏ ở Spring Boot Backend để forward request.

### Những thứ cần làm

#### Bước 1: Thêm proxy endpoint ở Backend

**File:** `backend/.../controller/ProxyController.java` *(file mới)*

```java
@RestController
@RequestMapping("/api/proxy")
public class ProxyController {

    @PostMapping("/handwriting")
    public ResponseEntity<String> recognizeHandwriting(@RequestBody Map<String, Object> body) {
        try {
            // Tái tạo URL Google Input Tools
            String url = "https://www.google.com/inputtools/request" +
                "?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8";

            HttpClient client = HttpClient.newHttpClient();
            String json = new ObjectMapper().writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

            HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

            return ResponseEntity.ok(response.body());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
```

#### Bước 2: Cập nhật `HandwritingCanvas.jsx`

Thay toàn bộ file bằng version mới có:
- Ghi lại tọa độ từng nét vẽ (`strokes`)
- Gọi Backend proxy khi nhấn Nhận diện
- Hiển thị danh sách gợi ý để người dùng chọn

```jsx
import { useRef, useState } from 'react'

export default function HandwritingCanvas({ onRecognize }) {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [strokes, setStrokes] = useState([])          // mảng các nét [{x:[],y:[]}]
  const currentStroke = useRef({ x: [], y: [] })
  const [suggestions, setSuggestions] = useState([])  // kết quả từ Google
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function getPos(event) {
    const rect = canvasRef.current.getBoundingClientRect()
    const point = event.touches ? event.touches[0] : event
    return {
      x: Math.round(point.clientX - rect.left),
      y: Math.round(point.clientY - rect.top),
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
    setSuggestions([])  // reset gợi ý khi vẽ mới
    setError(null)
  }

  function move(event) {
    event.preventDefault()
    if (!drawing) return
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getPos(event)
    ctx.lineWidth = 8
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
    // Lưu nét vừa vẽ
    setStrokes(prev => [...prev, { ...currentStroke.current }])
    currentStroke.current = { x: [], y: [] }
  }

  function clearCanvas() {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
    setStrokes([])
    setSuggestions([])
    setError(null)
  }

  async function recognize() {
    if (strokes.length === 0) {
      setError('Vui lòng vẽ ít nhất một nét!')
      return
    }
    setLoading(true)
    setError(null)
    try {
      // Format dữ liệu theo chuẩn Google Input Tools
      const inkArray = strokes.map(s => [s.x, s.y])
      const canvasSize = [canvasRef.current.width, canvasRef.current.height]
      const payload = {
        input_type: 0,
        requests: [{
          language: 'zh',
          writing_guide: { writing_area_width: canvasSize[0], writing_area_height: canvasSize[1] },
          ink: inkArray,
        }]
      }

      const res = await fetch('/api/proxy/handwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      // Parse kết quả từ Google: [["SUCCESS", [["word", ["候选1","候选2",...]]]]
      const candidates = data?.[1]?.[0]?.[1] ?? []
      if (candidates.length > 0) {
        setSuggestions(candidates.slice(0, 8))
      } else {
        setError('Không nhận diện được. Hãy vẽ rõ hơn.')
      }
    } catch (e) {
      setError('Lỗi kết nối: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <canvas
        ref={canvasRef}
        width={320}
        height={200}
        style={{
          border: '2px solid #cbd5e1',
          borderRadius: 10,
          background: '#fff',
          width: '100%',
          touchAction: 'none',  // quan trọng cho mobile
        }}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button type="button" className="btn-ghost" onClick={clearCanvas}>
          Xóa
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={recognize}
          disabled={loading || strokes.length === 0}
          style={{ flex: 1 }}
        >
          {loading ? 'Đang nhận diện...' : 'Nhận diện chữ Hán'}
        </button>
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: 13, marginTop: 6 }}>{error}</p>
      )}

      {suggestions.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 6px 0' }}>
            Chọn ký tự phù hợp:
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {suggestions.map((char, i) => (
              <button
                key={i}
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
```

---

## Tóm tắt file cần tạo / sửa

| File | Hành động | Nội dung thay đổi |
|---|---|---|
| `frontend/package.json` | Cài npm | Thêm `hanzi-writer` |
| `frontend/src/components/StrokeAnimation.jsx` | **TẠO MỚI** | Component animation nét chữ |
| `frontend/src/components/HandwritingCanvas.jsx` | **SỬA** | Thay mock → gọi Google API proxy |
| `frontend/src/pages/DictionaryPage.jsx` | **SỬA** | Thêm import, state, nút và `<StrokeAnimation>` |
| `backend/.../controller/ProxyController.java` | **TẠO MỚI** | Proxy endpoint tránh CORS |

---

## Kế hoạch kiểm thử

| Test case | Đầu vào | Kết quả mong đợi |
|---|---|---|
| Xem animation nét chữ | Click "Xem animation nét chữ" khi đang xem từ "你好" | Animation vẽ chữ "你" từng nét, nút "Phát lại" hoạt động |
| Nhận diện tay viết | Vẽ chữ "你" lên canvas | Hiển thị danh sách gợi ý: 你, 妳, ... |
| Chọn ký tự gợi ý | Click "你" trong danh sách | Ô tìm kiếm điền "你", tự động tìm kiếm |
| Trình duyệt không hỗ trợ | Safari cũ / không có mạng | Hiển thị thông báo lỗi rõ ràng |
