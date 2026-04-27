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
