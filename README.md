Đây là một nền tảng hỗ trợ học tiếng Trung thông minh, kết hợp giữa Từ điển tra cứu chuyên sâu và Hệ thống lặp lại ngắt quãng. Dự án được phát triển nhằm giải quyết vấn đề nhanh quên từ vựng của người học thông qua việc cá nhân hóa lộ trình ôn tập dựa trên thuật toán ghi nhớ khoa học.

Báo cáo tiến độ tuần số 1(9/3/2026 - 15/3/2026):
Thiết kế xong sơ đồ Use Case tổng quan và sơ đồ thực thể ERD (bao quát các tính năng: Tra từ, Học tập SRS, Ngữ pháp và Lịch sử dịch).

Báo cáo tiến độ tuần số 2(16/3/2026 - 22/3/2026):
Khởi tạo Project Spring Boot; triển khai toàn bộ Entity cốt lõi (Word, Writing, Grammar) với quan hệ JPA chuẩn và đã Push code lên GitHub.

Báo cáo tiến độ tuần số 3(23/3/2026 - 29/3/2026):
Hoàn thành nốt việc tạo db bằng jpa.

Báo cáo tiến độ tuần số 4(6/4/2026 - 12/4/2026):
- Hoàn thiện tầng Repository cho các entity còn thiếu: AIConfig, GrammarPoint, GrammarExample, SearchHistory, Translation, WordExample, WordGraphic, WordType.                 
- Bổ sung method truy vấn cho UserRepository (findByUsername, findByEmail) và NotebookRepository (findByUserIdOrderByCreatedAtDesc).
- Nâng cấp WordRepository để hỗ trợ tìm kiếm theo hanzi, pinyin, meaning.
- Hoàn thiện tầng DTO cho các module: User, Notebook, Grammar, SearchHistory, Translation, AIConfig, Word assets.
- Tạo ApiResponse<T> để chuẩn hóa format trả về thành công cho REST API.
- Hoàn thiện tầng Service cho các module: UserService, NotebookService, GrammarPointService, GrammarExampleService, SearchHistoryService, TranslationService, AIConfigService, WordExampleService, WordGraphicService.
- Nâng cấp WordService: map dữ liệu chi tiết hơn, chuẩn hóa wordTypes, xử lý lỗi rõ ràng khi không tìm thấy dữ liệu.
- Hoàn thiện tầng Controller cho các API còn thiếu: Users, Notebooks, GrammarPoints, GrammarExamples, SearchHistory, Translations, AIConfig, WordAssets.
- Cập nhật WordController để trả dữ liệu theo chuẩn ApiResponse.
- Xây dựng cơ chế xử lý lỗi tập trung gồm: NotFoundException, ApiError, GlobalExceptionHandler (@RestControllerAdvice).
- Chuẩn hóa phản hồi lỗi cho các mã 404 / 400 / 500.
- Sửa lỗi encoding trong application.properties để quá trình build Maven ổn định.
- Tích hợp Swagger UI vào dự án.

