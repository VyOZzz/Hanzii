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

**Những kiến thức học được trong tuần này:**
- Hiểu được tác động nghiêm trọng của việc chạy các tác vụ nặng trên quy mô data lớn (hundreds of thousands of records) trong quá trình khởi động ứng dụng (Application Startup).
- Nắm được sự khác biệt về hiệu năng khi sử dụng native SQL queries: việc dùng hàm xử lý chuỗi trên các cột trong mệnh đề WHERE có thể vô hiệu hóa Index và gây sụt giảm tốc độ nghiêm trọng.
- Nâng cao kỹ năng Debug Full-stack: Học cách trace lỗi từ giao diện React (truyền sai kiểu dữ liệu), theo dõi qua Network tab, và đọc hiểu Stack trace trong log của Spring Boot để tìm đúng nguyên nhân gốc rễ thay vì đoán mò.
- Học cách tiếp cận sáng tạo bằng AI: Thay vì phải tự cào (crawl) hoặc nhập liệu hàng ngàn cấu trúc ngữ pháp khô khan, việc tích hợp LLM (Gemini) giúp cung cấp giải pháp động, linh hoạt và thông minh cho bài tập lớn.

---

### Tuần 9 — 9/5/2026 đến 12/5/2026
- **Cải thiện trải nghiệm học từ ngay trên trang Từ điển:** Bổ sung khu vực "Học nhanh" hiển thị nhanh số thẻ SRS đến hạn, số sổ tay, và các truy vấn tra cứu gần đây; cho phép bấm 1 chạm để tra lại và học tiếp.
- **Tối ưu gợi ý & tìm kiếm theo Pinyin:** Chuẩn hóa pinyin khi so khớp (bỏ khoảng trắng, không phân biệt hoa/thường), đồng thời ưu tiên thứ tự gợi ý theo mức độ khớp (khớp tuyệt đối → khớp tiền tố → khớp chứa).
- **Mở rộng Notebook theo hướng "có số liệu để học":** Thêm thống kê hàng chờ ôn tập theo từng sổ (từ mới cần học / cần ôn lại / tổng đến hạn) và tự cập nhật lại sau khi ôn xong hoặc xoá từ.
- **Tự động phân loại HSK cho dữ liệu còn thiếu:** Xây dựng luồng batch phân loại HSK (có `limit` và `batchSize`), bổ sung endpoint `/api/ai/classify-missing-hsk` và cấu hình Security để gọi được từ bên ngoài.
- **Tinh chỉnh UI đồng bộ hơn:** Bổ sung các class trạng thái bất đồng bộ (skeleton/loading, state message), thêm hiệu ứng `fade-in` và tối ưu responsive cho layout 2 cột.

**Những kiến thức học được trong tuần này:**
- Hiểu rõ hơn cách thiết kế một batch job chạy an toàn: chia nhỏ theo `batchSize`, giới hạn số lượng xử lý mỗi lần (`limit`), và trả về báo cáo tổng kết để dễ theo dõi.
- Rút kinh nghiệm về chất lượng gợi ý tìm kiếm: thứ tự ưu tiên (exact/prefix/contains) giúp kết quả "đúng ý" hơn nhiều so với chỉ `LIKE '%...%'`.
- Nâng cao kỹ năng quản lý state React: tránh reset lựa chọn của người dùng khi reload dữ liệu, và dùng `useMemo` để tối ưu các danh sách hiển thị phụ (ví dụ: lịch sử tra gần đây).

---

### Tuần 10 — 13/5/2026 đến 19/5/2026
- **Refactor kiến trúc AI theo Strategy Pattern:** Tách interface `AIAssistantService` dùng chung cho các luồng AI, giữ nguyên `GeminiService` và bổ sung `OpenAIService` để hỗ trợ chuyển đổi nhà cung cấp mà không phá vỡ code cũ.
- **Bổ sung cơ chế bật/tắt provider qua cấu hình:** Thêm `ai.provider` trong `application.properties` và dùng `@ConditionalOnProperty` để nạp đúng bean AI theo giá trị `gemini` hoặc `openai`.
- **Chuẩn hoá điểm gọi AI trong hệ thống:** Cập nhật các thành phần gọi AI (`AIController`, `NotebookService`, `HskClassificationService`) sang inject interface thay vì phụ thuộc cứng vào một implementation.
- **Tự động hoá gán HSK bằng script độc lập:** Tạo script trong thư mục `scratch` để đọc cấu hình DB, truy vấn các từ chưa có `hsk_level`, gọi API AI để phân loại và cập nhật ngược vào MySQL.
- **Kiểm chứng thực thi batch trên dữ liệu thật:** Chạy thử quy trình 100 bản ghi; hệ thống cập nhật thành công một phần và ghi nhận rõ nguyên nhân còn lại do giới hạn quota/rate-limit của API, giúp xác định bước tối ưu tiếp theo (retry/backoff hoặc chuyển provider).

**Những kiến thức học được trong tuần này:**
- Hiểu rõ lợi ích của Strategy Pattern trong bối cảnh tích hợp dịch vụ AI: giảm coupling, tăng khả năng thay thế provider nhanh khi có rủi ro chi phí hoặc quota.
- Nắm chắc cách dùng `@ConditionalOnProperty` để điều khiển vòng đời bean theo cấu hình runtime thay vì hard-code trong business logic.
- Củng cố kinh nghiệm vận hành batch job thực tế: luôn cần logging tiến độ, thống kê kết quả (updated/failed), và cơ chế chịu lỗi tốt khi gặp API rate-limit.
