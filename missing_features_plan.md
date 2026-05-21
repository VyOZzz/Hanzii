# 🗺️ Kế hoạch Implement Tính Năng Còn Thiếu — Hanzii

## Tổng quan

| # | Tính năng | Độ khó | Ước lượng thời gian |
|---|---|---|---|
| 1 | Tra cứu bằng Giọng nói (Look up by Voice) | ⭐⭐ Dễ-TB | 2–3 giờ |
| 2 | Dịch bằng Giọng nói (Translate by Voice) | ⭐⭐ Dễ-TB | 1–2 giờ |
| 3 | Admin Panel (Manage User + Thống kê AI) | ⭐⭐⭐ Trung bình | 4–6 giờ |
| 4 | Bài kiểm tra Từ vựng (Take Vocabulary Quiz) | ⭐⭐⭐ Trung bình | 4–6 giờ |
| 5 | Tra cứu bằng Nét vẽ (Look up by Handwriting) | ⭐⭐⭐⭐ Khó | 8–12 giờ |

---

## 1. 🎤 Tra cứu bằng Giọng nói (Look up by Voice)

> Người dùng nói từ tiếng Trung → hệ thống nhận diện → tự động điền vào ô tìm kiếm.

**Cách làm: Dùng Web Speech API của trình duyệt (không cần backend)**

### Frontend — `DictionaryPage.jsx`
```jsx
// Thêm nút microphone cạnh ô tìm kiếm
function startVoiceSearch(setKeyword) {
  const recognition = new window.webkitSpeechRecognition() // hoặc SpeechRecognition
  recognition.lang = 'zh-CN' // Nhận diện tiếng Trung
  recognition.onresult = (event) => {
    setKeyword(event.results[0][0].transcript)
  }
  recognition.start()
}
```

### Bước thực hiện:
1. Thêm nút 🎤 trong `DictionaryPage.jsx` cạnh ô search
2. Khi click → gọi `SpeechRecognition` với `lang='zh-CN'`
3. Lấy kết quả transcript → set vào state keyword → trigger search

> ✅ **Không cần thay đổi backend gì cả!**

---

## 2. 🎤 Dịch bằng Giọng nói (Translate by Voice)

> Tương tự #1 nhưng trong trang Dịch thuật.

### Frontend — `TranslationPage.jsx`
```jsx
// Thêm nút 🎤 cạnh textarea nguồn
// lang tùy theo sourceLang user chọn:
const langMap = {
  'Tiếng Trung': 'zh-CN',
  'Tiếng Việt': 'vi-VN',
  'English': 'en-US'
}
recognition.lang = langMap[sourceLang]
recognition.onresult = (e) => setSourceText(e.results[0][0].transcript)
```

### Bước thực hiện:
1. Tạo custom hook `useVoiceInput(lang)` dùng chung cho cả 2 tính năng #1 và #2
2. Tích hợp vào `TranslationPage.jsx`

> ✅ **Không cần thay đổi backend gì cả!**

---

## 3. 🛡️ Admin Panel (Manage User + View Usage Statistics)

> Admin xem danh sách user, block/delete user, xem thống kê lượt dùng AI.

### Backend

#### 3a. Manage User — `UserController.java`
```java
// Thêm endpoint DELETE và UPDATE (hiện chỉ có GET)
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) { ... }

@PutMapping("/{id}/block")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ApiResponse<String>> blockUser(@PathVariable Long id) { ... }
```
*Cần thêm field `isBlocked` vào entity `User.java`*

#### 3b. View Usage Statistics — `AIUsageLog.java` (Entity mới)
```java
// Entity ghi log mỗi lần AI được gọi
@Entity
public class AIUsageLog {
    private Long id;
    private Long userId;
    private String feature; // "CHAT", "TRANSLATE", "CLASSIFY"
    private LocalDateTime calledAt;
    private int tokenCount; // optional
}
```
```java
// Controller
@GetMapping("/ai/stats")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ApiResponse<Map<String,Object>>> getAiStats() { ... }
// Trả về: tổng lượt gọi, lượt gọi theo ngày, top user dùng nhiều nhất
```

#### 3c. Admin Login — Tạo trang riêng `/admin`
- Kiểm tra `Role == ADMIN` sau khi login → redirect sang `/admin`
- Bảo vệ route `/admin` bằng guard trên frontend

### Frontend — `AdminPage.jsx` (trang mới)
- Tab 1: Danh sách users (có nút Block/Delete)
- Tab 2: Thống kê AI usage (dùng thư viện Chart.js hoặc Recharts)
- Tab 3: Quản lý AI Config (Update API Key, Adjust Prompt — đã có API)

---

## 4. 📝 Bài kiểm tra Từ vựng (Take Vocabulary Quiz)

> Từ sổ tay → sinh ra bài trắc nghiệm 4 đáp án.

### Backend — Không cần thêm nhiều
```java
// Endpoint mới trong SrsController hoặc NotebookController:
@GetMapping("/notebooks/{id}/quiz")
public ResponseEntity<ApiResponse<List<QuizQuestionDTO>>> generateQuiz(
    @PathVariable Long notebookId,
    @RequestParam(defaultValue = "10") int count
) {
    // 1. Lấy danh sách từ trong notebook
    // 2. Với mỗi từ, lấy thêm 3 từ ngẫu nhiên làm đáp án sai
    // 3. Xáo trộn đáp án → trả về List<QuizQuestionDTO>
}
```

**DTO mới:**
```java
public class QuizQuestionDTO {
    private Long wordId;
    private String hanzi;
    private String pinyin;
    private List<String> choices; // 4 đáp án (1 đúng, 3 sai)
    private String correctAnswer;
}
```

### Frontend — `QuizMode.jsx` (component mới trong NotebookPage)
- Hiển thị câu hỏi từng cái: Hán tự → chọn nghĩa đúng trong 4 lựa chọn
- Có thanh tiến trình, hiển thị kết quả cuối cùng
- Sau khi làm xong → cập nhật SRS rating dựa trên kết quả (đúng = rating 3, sai = rating 1)

---

## 5. ✍️ Tra cứu bằng Nét vẽ (Look up by Handwriting)

> Người dùng vẽ chữ Hán trên Canvas → nhận diện → tra cứu.

> [!WARNING]
> Tính năng này **khó nhất** vì cần tích hợp thư viện OCR chữ Hán. Chỉ nên làm nếu có đủ thời gian.

### Cách tiếp cận đề xuất: Dùng thư viện `HanziWriter` + OCR API

**Phương án 1 (Dễ hơn): Dùng Google Cloud Vision API**
```
Frontend: Vẽ trên Canvas → toBase64 → gọi backend
Backend: Gọi Google Vision API với image → trích xuất text Trung → trả về từ
```

**Phương án 2 (Khó hơn): Dùng thư viện JS thuần**
- Dùng thư viện `tegaki-js` hoặc `handwriting.js` (offline, chạy trên browser)
- Không cần backend

### Backend (nếu dùng Phương án 1)
```java
// Endpoint mới
@PostMapping("/words/recognize-image")
public ResponseEntity<ApiResponse<String>> recognizeHandwriting(
    @RequestBody RecognizeImageRequestDTO request // base64 image
) {
    String hanzi = visionService.recognizeChineseText(request.getBase64Image());
    return ResponseEntity.ok(ApiResponse.success("Recognized", hanzi));
}
```

### Frontend — `HandwritingCanvas.jsx` (component mới)
```jsx
// Canvas để vẽ, nút Clear, nút Nhận diện
// Sau khi nhận diện → set keyword vào ô tìm kiếm
```

---

## 🗓️ Thứ tự khuyên thực hiện

```
Tuần 1: ①②  → Voice Search + Voice Translate (nhanh, dễ, không cần backend)
Tuần 2: ③   → Admin Panel (backend cần thêm DELETE user + AIUsageLog entity)
Tuần 3: ④   → Vocabulary Quiz (backend thêm /quiz endpoint, frontend thêm QuizMode)
Tuần 4: ⑤   → Handwriting (chỉ làm nếu còn thời gian, dùng handwriting.js phía frontend)
```

> [!TIP]
> Nếu thời gian hạn chế, **chỉ cần làm ① ② ④** là đủ để use case diagram khớp hoàn toàn với code, lại có tính năng nổi bật để demo trong buổi bảo vệ.
