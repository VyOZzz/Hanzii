# Hanzii — Từ điển & Học tiếng Trung thông minh

Hanzii là nền tảng hỗ trợ học tiếng Trung thông minh, kết hợp giữa **Từ điển tra cứu chuyên sâu** và **Hệ thống lặp lại ngắt quãng (SRS)**. Dự án được phát triển nhằm giải quyết vấn đề nhanh quên từ vựng của người học thông qua việc cá nhân hóa lộ trình ôn tập dựa trên thuật toán ghi nhớ khoa học.

---

## Công nghệ sử dụng

| Layer | Công nghệ |
|---|---|
| Backend | Spring Boot, Spring Data JPA, Spring Security |
| Frontend | React (Vite), Vanilla CSS |
| Database | MySQL |
| Tài liệu API | Swagger UI |

---

## Báo cáo tiến độ theo tuần

### Tuần 1 — 9/3/2026 đến 15/3/2026
- Thiết kế sơ đồ Use Case tổng quan.
- Thiết kế sơ đồ thực thể ERD bao quát các tính năng: Tra từ, Học tập SRS, Ngữ pháp và Lịch sử dịch.

---

### Tuần 2 — 16/3/2026 đến 22/3/2026
- Khởi tạo project Spring Boot.
- Triển khai toàn bộ Entity cốt lõi (`Word`, `Writing`, `Grammar`) với quan hệ JPA chuẩn.
- Push code lên GitHub lần đầu.

---

### Tuần 3 — 23/3/2026 đến 29/3/2026
- Hoàn thành việc tạo database bằng JPA.
- Cài đặt `WordRepository` và các phương thức truy vấn cơ bản.

---

### Tuần 4 — 6/4/2026 đến 12/4/2026
- Hoàn thiện Repository cho các entity còn thiếu: `AIConfig`, `GrammarPoint`, `GrammarExample`, `SearchHistory`, `Translation`, `WordExample`, `WordGraphic`, `WordType`.
- Bổ sung method truy vấn cho `UserRepository` (`findByUsername`, `findByEmail`) và `NotebookRepository` (`findByUserIdOrderByCreatedAtDesc`).
- Nâng cấp `WordRepository` để hỗ trợ tìm kiếm theo hanzi, pinyin, meaning.
- Hoàn thiện DTO cho các module: User, Notebook, Grammar, SearchHistory, Translation, AIConfig, Word assets.
- Tạo `ApiResponse<T>` để chuẩn hóa format trả về thành công cho REST API.
- Hoàn thiện Service cho các module: `UserService`, `NotebookService`, `GrammarPointService`, `GrammarExampleService`, `SearchHistoryService`, `TranslationService`, `AIConfigService`, `WordExampleService`, `WordGraphicService`.
- Nâng cấp `WordService`: map dữ liệu chi tiết hơn, chuẩn hóa `wordTypes`, xử lý lỗi rõ ràng khi không tìm thấy dữ liệu.
- Hoàn thiện Controller cho các API còn thiếu: Users, Notebooks, GrammarPoints, GrammarExamples, SearchHistory, Translations, AIConfig, WordAssets.
- Cập nhật `WordController` để trả dữ liệu theo chuẩn `ApiResponse`.
- Xây dựng cơ chế xử lý lỗi tập trung: `NotFoundException`, `ApiError`, `GlobalExceptionHandler` (`@RestControllerAdvice`).
- Chuẩn hóa phản hồi lỗi cho các mã 404 / 400 / 500.
- Sửa lỗi encoding trong `application.properties` để quá trình build Maven ổn định.
- Tích hợp Swagger UI vào dự án.
- Xây dựng luồng Auth cơ bản (đăng ký, đăng nhập) phía backend.
- Triển khai luồng SRS review cơ bản.
- Thêm filter lọc từ theo `hskLevel` và `wordType` qua API mới.

---

### Tuần 5 — 7/4/2026 đến 10/4/2026
- Khởi tạo project React (Vite) cho frontend.
- Xây dựng giao diện cơ bản: layout, routing, các trang chính.
- Thiết lập kết nối API giữa frontend và backend (`api.js`).
- Triển khai luồng đăng nhập / đăng ký phía frontend.
- Xây dựng trang từ điển với tìm kiếm và xem chi tiết từ.
- Xây dựng trang Notebook quản lý từ vựng cá nhân.
- Redesign lại toàn bộ UI: màu sắc, typography, layout tổng thể.

---

### Tuần 6 — 20/4/2026 đến 27/4/2026
- Hoàn thiện `NotebookPage`: quản lý danh sách từ, thêm/xóa từ, phân trang, tìm kiếm nội bộ.
- Mở rộng `SrsService`: tích hợp thuật toán ôn tập, thêm endpoint lấy card theo session và submit kết quả review.
- Cải thiện `DictionaryPage`: bổ sung filter nâng cao và hiển thị chi tiết từ trực tiếp trên trang.
- Refactor `TranslationPage`: cải thiện luồng gọi API dịch, xử lý lỗi rõ hơn.
- Thêm `NotebookController` và mở rộng `SrsController` phía backend.
- Bổ sung query tìm kiếm trong `WordRepository` và `SrsReviewCardRepository`.
- Tách CSS thành `components.css` và `layout.css` để dễ bảo trì.
- Cập nhật `AppContext` và `AppLayout` theo luồng dữ liệu mới.
- Xóa `SrsPage` cũ, gộp logic SRS vào `NotebookPage`.

---

### Tuần 7 — 28/4/2026 đến 1/5/2026
- Thiết kế lại toàn bộ giao diện frontend theo phong cách của trang Hanzii.net (light theme, tông Navy Blue).
- Chuyển đổi cấu trúc layout từ **Sidebar** sang **Top Navigation Bar** (`AppLayout.jsx`, `layout.css`).
- Cập nhật `base.css`: loại bỏ Dark theme cũ, đổi bảng màu sang Light Theme (`#F8F9FC`, `#3498DB`, `#2C3E50`), chuẩn hóa bo góc và đổ bóng.
- Viết lại `DictionaryPage.jsx`: thêm Hero Search Section với thanh tìm kiếm bo tròn, Filter Chips nằm ngang, bố cục 2 cột (Main + Sidebar phụ).
- Bổ sung các class CSS mới trong `components.css`: `.hero-search-section`, `.search-input-wrapper`, `.hero-chip`, `.main-grid`, `.side-col`.
- Cải thiện logic hiển thị kết quả tìm kiếm: thêm trạng thái `hasSearched` trong `AppContext` để phân biệt giữa "chưa tìm" và "tìm nhưng không có kết quả".
- Thêm tính năng auto-suggest (gợi ý từ khi gõ) với debounce 400ms vào thanh tìm kiếm.
- Downgrade Vite và `@vitejs/plugin-react` để tương thích Node.js 20.14.0.
- Cấu hình `application.properties`: thêm kết nối MySQL, JWT secret, Hibernate dialect.
- Loại bỏ toàn bộ emoji/icon khỏi giao diện (tiêu đề, nút bấm, thông báo trạng thái) trên tất cả các trang: Dictionary, Notebook, Grammar, History, Translation, Account.
- Làm sạch thanh điều hướng Topbar: chỉ giữ lại text thuần, không còn icon emoji.

---

### Tuần 8 — 2/5/2026 đến 8/5/2026
- **Tối ưu hóa hiệu năng Database & Server:** Phân tích và vô hiệu hóa tiến trình `fixDictionaryMeanings` (quét hơn 120.000 từ) lúc khởi động server, khắc phục triệt để tình trạng ứng dụng bị treo và timeout do database lock.
- **Tối ưu SQL Queries:** Viết lại toàn bộ native query trong `WordRepository`, loại bỏ các hàm xử lý chuỗi đắt đỏ (`REPLACE`, `LOWER`) và thay bằng cấu trúc `LIKE` tối ưu. Tốc độ tìm kiếm giảm từ ~40s xuống chỉ còn ~0.05s.
- **Sửa lỗi API & Frontend:** Khắc phục lỗi nghiêm trọng ở giao diện tìm kiếm (truyền object thay vì ID khi nhấn từ gợi ý) gây ra lỗi `MethodArgumentTypeMismatchException` (500) ở Spring Boot.
- **Tinh chỉnh UI/UX:** Cập nhật CSS để dời Toast Notification (bảng thông báo) sang góc trái màn hình, tránh việc bị che khuất bởi nút floating Gia Sư AI.
- **Tích hợp "Phân tích ngữ pháp AI":** Xây dựng tính năng gọi trực tiếp API Gemini 2.5 để phân tích cấu trúc ngữ pháp và đưa ra ví dụ trực tiếp bên dưới mỗi từ vựng, giải quyết bài toán thiếu hụt dữ liệu ngữ pháp offline.


---

### Tuần 9 — 9/5/2026 đến 15/5/2026
- **Sửa lỗi Nhận diện chữ viết tay (HandwritingCanvas)**:
  - Khắc phục lỗi lệch tọa độ nét vẽ khi canvas hiển thị theo CSS `width: 100%` bằng cách scale chính xác.
  - Chuẩn hóa khung vẽ về dạng hình vuông và thêm `aspectRatio: '1 / 1'` để tránh méo nét.
  - Tăng độ dày nét vẽ (`lineWidth = 15`) để người dùng viết chữ đơn giản rõ ràng hơn.
  - Viết lại hàm `getPos(event)` hỗ trợ đầy đủ chuột/cảm ứng và chặn triệt để dữ liệu lỗi.
  - Bổ sung cơ chế làm sạch dữ liệu nét vẽ trước khi gửi API.
  - Sửa lỗi race condition khiến hệ thống báo sai "Vui lòng vẽ ít nhất một nét".

---

### Tuần 10 — 16/5/2026 đến 22/5/2026
- **Hoàn thiện tính năng nâng cao & Trang quản trị (Admin)**:
  - Xây dựng **Trang Quản trị (Admin Dashboard)**: Thêm chức năng Quản lý người dùng, Quản lý cấu hình AI, Thống kê hệ thống.
  - Nâng cấp **Hệ thống AI & Dịch thuật**: Tích hợp Dịch thuật AI nâng cao (Gemini) hỗ trợ OCR, phân tích ngữ pháp. Xây dựng hệ thống lưu vết (`AIUsageLog`).
  - Nâng cấp **Học tập & Ôn luyện (Flashcard/SRS)**: Bổ sung **Quiz Mode** và tích hợp **Animation Hán tự (Stroke Animation)**.
  - Cải thiện **Hạ tầng & API**: Thêm `ProxyController` hỗ trợ Text-to-Speech (Google TTS) để vượt rào cản CORS. Cập nhật phân quyền bảo mật chặt chẽ cho Admin.
  - **Tối ưu kiến trúc Database & Codebase**: Phân tích và gỡ bỏ hoàn toàn các bảng/module thừa (WordGraphic, WordExample) do đã được thay thế bằng công nghệ mới (SVG Rendering & AI Generation), giúp Clean Code và giảm tải Database.
  - **Công cụ Admin nâng cao**: Bổ sung tính năng "Phân loại HSK bằng AI" (chạy ngầm) trong Admin Dashboard để tự động chuẩn hóa dữ liệu từ vựng.
  - **Hoàn thiện API Ngữ pháp**: Nâng cấp `GrammarController` và `GrammarPointService` hỗ trợ filter theo cấp độ HSK (`GET /api/grammar-points?hskLevel=X`).

---

### Tuần 11 — 23/5/2026 đến 29/5/2026
- **Tối ưu hóa UI/UX & Sửa lỗi logic Frontend**:
  - Sửa lỗi hiển thị nút "Lưu vào sổ tay": Tự động hiển thị nút chuyển hướng "Tạo sổ tay mới" khi người dùng chưa có sổ tay nào, giúp luồng trải nghiệm không bị đứt gãy.
  - Xử lý triệt để lỗi "Thẻ SRS mồ côi": Thêm nút "Ôn tập tất cả" trong trang Sổ tay để gom nhóm và ôn luyện toàn bộ các thẻ flashcard bị kẹt.
  - Tinh giản giao diện: Gỡ bỏ các chức năng không còn phù hợp với mục tiêu dự án (nút "Phân loại HSK bằng AI" ở trang Admin và tính năng "Quiz 4 đáp án").
  - Sửa logic nút "Học qua thẻ SRS" ở trang từ điển: Chỉ điều hướng người dùng sang trang Sổ tay thay vì tự động tạo thẻ rác ẩn dưới nền.
