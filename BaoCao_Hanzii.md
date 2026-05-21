> **HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG KHOA CÔNG NGHỆ THÔNG TIN 1**
>
> **o0o**

<!-- [BẠN CẦN VẼ: Logo Học viện Bưu chính Viễn thông - giống file mẫu] -->

> **Hệ thống từ điển và học tiếng Trung thông minh - Hanzii**
>
> **Môn học: Thực tập cơ sở**

**Phạm Mạnh Vy B21DCCNxxx**

> **Giảng viên hướng dẫn: [Tên giảng viên]**
>
> ***HÀ NỘI - 2026***

# Mục lục

[**Chương 1: Giới thiệu đề tài**](#chương-1-giới-thiệu-đề-tài)

[**1. Đặt vấn đề**](#1-đặt-vấn-đề)

[**2. Yêu cầu**](#2-yêu-cầu)

[**3. Phạm vi đề tài**](#3-phạm-vi-đề-tài)

[**4. Công nghệ sử dụng**](#4-công-nghệ-sử-dụng)

[**Chương 2: Tài liệu đặc tả của hệ thống**](#chương-2-tài-liệu-đặc-tả-của-hệ-thống)

[**1. Miêu tả hệ thống bằng ngôn ngữ tự nhiên**](#1-miêu-tả-hệ-thống-bằng-ngôn-ngữ-tự-nhiên)

[**2. Sơ đồ usecase tổng quan cho hệ thống**](#2-sơ-đồ-usecase-tổng-quan-cho-hệ-thống)

[**3. Sơ đồ usecase chi tiết**](#3-sơ-đồ-usecase-chi-tiết)

[**Chương 3: Tài liệu pha phân tích**](#chương-3-tài-liệu-pha-phân-tích)

[**1. Scenario**](#1-scenario)

[**2. Các lớp thực thể trong hệ thống**](#2-các-lớp-thực-thể-trong-hệ-thống)

[**3. Trích các lớp biên, lớp điều khiển**](#3-trích-các-lớp-biên-lớp-điều-khiển)

[**4. Thẻ CRC cho lớp điều khiển**](#4-thẻ-crc-cho-lớp-điều-khiển)

[**5. Sơ đồ hoạt động (statechart)**](#5-sơ-đồ-hoạt-động)

[**6. Scenario chuẩn cho từng module**](#6-scenario-chuẩn-cho-từng-module)

[**7. Sequence diagram**](#7-sequence-diagram)

[**Chương 4: Pha thiết kế**](#chương-4-pha-thiết-kế)

[**1. Sơ đồ lớp thực thể toàn hệ thống**](#1-sơ-đồ-lớp-thực-thể-toàn-hệ-thống)

[**2. Sơ đồ quan hệ giữa các bảng**](#2-sơ-đồ-quan-hệ-giữa-các-bảng)

[**3. Sơ đồ MVC**](#3-sơ-đồ-mvc)

[**4. Dùng thẻ CRC để gán phương thức cho các lớp**](#4-dùng-thẻ-crc-để-gán-phương-thức)

[**5. Định nghĩa khuôn mẫu cho từng phương thức**](#5-định-nghĩa-khuôn-mẫu)

[**6. Sơ đồ tuần tự sau pha thiết kế**](#6-sơ-đồ-tuần-tự)

[**Chương 5: Pha cài đặt**](#chương-5-pha-cài-đặt)

[**1. Các thành phần trong chức năng Tra từ điển**](#1-chức-năng-tra-từ-điển)

[**2. Các thành phần trong chức năng Sổ tay & Ôn tập SRS**](#2-chức-năng-sổ-tay-ôn-tập)

[**3. Các thành phần trong chức năng Ngữ pháp**](#3-chức-năng-ngữ-pháp)

[**4. Các thành phần trong chức năng Dịch thuật**](#4-chức-năng-dịch-thuật)

[**5. Các thành phần trong chức năng Xác thực**](#5-chức-năng-xác-thực)

[**Chương 6: Pha kiểm thử**](#chương-6-pha-kiểm-thử)

[**1. CSDL ban đầu**](#1-csdl-ban-đầu)

[**2. Các test case kiểm thử**](#2-các-test-case-kiểm-thử)

---

## **Chương 1: Giới thiệu đề tài**

1. **Đặt vấn đề**

> Nhu cầu học tiếng Trung Quốc ngày càng tăng cao tại Việt Nam do sự phát triển mạnh mẽ của giao thương kinh tế và văn hóa giữa hai nước. Tuy nhiên, một trong những khó khăn lớn nhất mà người học gặp phải là vấn đề **nhanh quên từ vựng** — người học thường quên phần lớn từ mới chỉ sau vài ngày nếu không có phương pháp ôn tập khoa học.
>
> Các ứng dụng từ điển hiện tại chỉ cung cấp chức năng tra cứu đơn thuần mà thiếu cơ chế hỗ trợ ghi nhớ lâu dài. Trong khi đó, thuật toán **Spaced Repetition System (SRS)** — hệ thống lặp lại ngắt quãng — đã được chứng minh qua nhiều nghiên cứu là phương pháp hiệu quả nhất để ghi nhớ từ vựng dài hạn, được áp dụng thành công trong các ứng dụng nổi tiếng như Anki.
>
> Vì vậy, đề tài này xây dựng hệ thống **Hanzii** — nền tảng kết hợp giữa **Từ điển tra cứu chuyên sâu** và **Hệ thống ôn tập SRS**, nhằm giúp người học tiếng Trung ghi nhớ từ vựng hiệu quả hơn thông qua việc cá nhân hóa lộ trình ôn tập dựa trên thuật toán ghi nhớ khoa học.

2. **Yêu cầu**

Hệ thống cần phải cung cấp được các yêu cầu cơ bản như:

- Tra cứu từ vựng tiếng Trung (theo Hanzi, Pinyin, nghĩa tiếng Việt)
- Xem chi tiết từ vựng (nét chữ, cách viết, ví dụ, loại từ, cấp HSK)
- **Tra cứu từ vựng bằng giọng nói** (nhận diện tiếng Trung, Việt, Anh)
- Quản lý sổ tay từ vựng cá nhân
- Ôn tập từ vựng theo thuật toán SRS (Spaced Repetition System)
- **Kiểm tra từ vựng bằng bài trắc nghiệm Quiz Mode** (4 đáp án, tích hợp SRS)
- Tra cứu ngữ pháp tiếng Trung
- Dịch văn bản Trung - Việt
- **Dịch văn bản bằng giọng nói** (hỗ trợ 3 ngôn ngữ)
- Lưu lịch sử tìm kiếm
- Đăng nhập, đăng ký, quản lý tài khoản
- Tích hợp AI (Gemini) phân tích ngữ pháp
- **Quản trị hệ thống (Admin)**: Quản lý người dùng, thống kê sử dụng AI, cấu hình AI

3. **Phạm vi đề tài**

- Phân tích yêu cầu hệ thống từ điển và học tiếng Trung thông minh.
- Lựa chọn giải pháp công nghệ phù hợp (Spring Boot + React).
- Thiết kế và xây dựng hệ thống web full-stack.
- Tích hợp Web Speech API cho chức năng nhận diện giọng nói trên trình duyệt.
- Xây dựng Quiz Mode kết hợp với hệ thống SRS hiện có.
- Xây dựng trang quản trị Admin với thống kê sử dụng AI.
- Thử nghiệm và đánh giá hệ thống.

| Actor | Số Use Case |
|---|---|
| Người dùng (Guest) | 3 |
| Người dùng (Đăng nhập) | 19 |
| Admin | 8 |

4. **Công nghệ sử dụng**

> Hệ thống Hanzii được xây dựng theo kiến trúc **Client-Server**, sử dụng các công nghệ hiện đại:

| Layer | Công nghệ |
|---|---|
| Backend | Spring Boot 4.0.3, Spring Data JPA, Spring Security |
| Frontend | React (Vite), Vanilla CSS |
| Database | MySQL |
| Tài liệu API | Swagger UI |
| AI Integration | Google Gemini API |
| Authentication | JWT (JSON Web Token) |

> **Spring Boot** là một framework mạnh mẽ của Java giúp đơn giản hóa việc phát triển ứng dụng web. Spring Boot cung cấp các tính năng như auto-configuration, embedded server, và starter dependencies giúp lập trình viên tập trung vào logic nghiệp vụ thay vì cấu hình.
>
> **React** là thư viện JavaScript phổ biến nhất để xây dựng giao diện người dùng, được phát triển bởi Facebook. React sử dụng Virtual DOM và component-based architecture giúp xây dựng UI tương tác, hiệu năng cao.
>
> **MySQL** là hệ quản trị CSDL quan hệ mã nguồn mở phổ biến, phù hợp cho việc lưu trữ dữ liệu từ điển với hơn 120.000 từ.

Một số ưu điểm của stack công nghệ:

- Spring Boot: Hệ sinh thái Java mạnh mẽ, bảo mật tốt với Spring Security, ORM mạnh với JPA/Hibernate
- React + Vite: Hot Module Replacement nhanh, component tái sử dụng, cộng đồng lớn
- MySQL: Hiệu năng cao với indexing, hỗ trợ Full-text search, ổn định với dữ liệu lớn
- JWT: Xác thực stateless, phù hợp cho RESTful API

---

## **Chương 2: Tài liệu đặc tả của hệ thống**

1. **Miêu tả hệ thống bằng ngôn ngữ tự nhiên**

Hệ thống Hanzii là một ứng dụng web hỗ trợ học tiếng Trung thông minh, bao gồm các chức năng chính:

- **Tra từ điển**: Tìm kiếm từ vựng theo Hanzi (chữ Hán), Pinyin (phiên âm), hoặc nghĩa tiếng Việt. Hỗ trợ auto-suggest gợi ý từ khi gõ, lọc theo cấp HSK và loại từ, xem chi tiết từ vựng.

- **Tra từ bằng giọng nói**: Người dùng nhấn nút microphone, hệ thống kích hoạt Web Speech API trên trình duyệt để nhận diện giọng nói tiếng Trung (zh-CN), tiếng Việt (vi-VN) hoặc tiếng Anh (en-US), sau đó tự động điền từ nhận diện được vào ô tìm kiếm.

- **Sổ tay & Ôn tập SRS**: Người dùng tạo sổ tay từ vựng cá nhân, thêm từ vào sổ tay. Hệ thống tự động tạo thẻ ôn tập SRS theo thuật toán lặp lại ngắt quãng (lấy cảm hứng từ Anki) với 4 mức đánh giá: Học lại, Khó, Tốt, Dễ.

- **Quiz Mode (Kiểm tra từ vựng)**: Từ bất kỳ sổ tay nào, người dùng có thể bắt đầu bài kiểm tra trắc nghiệm. Hệ thống tự động sinh câu hỏi (Hán tự → chọn nghĩa đúng trong 4 đáp án). Kết quả Quiz ảnh hưởng trực tiếp đến rating SRS: đúng = rating 3 (Tốt), sai = rating 1 (Học lại).

- **Ngữ pháp**: Tra cứu các điểm ngữ pháp tiếng Trung theo cấp HSK, xem cấu trúc, giải thích và ví dụ minh họa.

- **Dịch thuật**: Dịch văn bản giữa tiếng Trung và tiếng Việt, hỗ trợ nhập liệu bằng giọng nói, lưu lại lịch sử bản dịch.

- **Lịch sử tìm kiếm**: Lưu và hiển thị lịch sử các từ đã tra cứu.

- **Tài khoản**: Đăng ký, đăng nhập, đổi mật khẩu. Hỗ trợ chế độ khách (Guest) cho tra từ cơ bản.

- **Gia sư AI**: Tích hợp Google Gemini API để phân tích ngữ pháp câu tiếng Trung trực tiếp.

- **Quản trị Admin**: Trang quản trị dành riêng cho Admin (role = ADMIN), cho phép xem danh sách người dùng, khóa/xóa tài khoản, cập nhật API Key và System Prompt của AI, xem thống kê lượt sử dụng AI theo ngày.

2. **Sơ đồ usecase tổng quan cho hệ thống**

> Các usecase:

**Người dùng (Guest — chưa đăng nhập):**
- Tra từ điển: Tìm kiếm từ vựng theo văn bản hoặc giọng nói
- Tra ngữ pháp: Xem danh sách và chi tiết các điểm ngữ pháp
- Đăng ký / Đăng nhập

**Người dùng (Đã đăng nhập):**
- Tra từ điển: Tìm kiếm từ vựng, xem chi tiết, lọc theo HSK và loại từ
- **Tra từ bằng giọng nói**: Nhấn mic → nhận diện tiếng Trung/Việt/Anh → tự động tìm kiếm
- Quản lý sổ tay: Tạo sổ tay, thêm/xóa từ vựng vào sổ tay cá nhân
- Ôn tập SRS (Flashcard): Ôn tập từ vựng theo thuật toán lặp lại ngắt quãng
- **Quiz Mode**: Làm bài kiểm tra trắc nghiệm từ vựng trong sổ tay
- Tra ngữ pháp: Xem danh sách và chi tiết các điểm ngữ pháp
- Dịch thuật: Dịch văn bản Trung-Việt bằng văn bản hoặc giọng nói
- Xem lịch sử: Xem lại lịch sử tìm kiếm
- Quản lý tài khoản: Đổi mật khẩu, xem thông tin cá nhân
- Chat với Gia sư AI: Hỏi đáp ngữ pháp tiếng Trung

**Admin:**
- Đăng nhập Admin
- Quản lý người dùng: Xem danh sách, khóa/xóa tài khoản
- Quản lý cấu hình AI: Cập nhật API Key, điều chỉnh System Prompt
- Xem thống kê sử dụng AI: Số lượt gọi theo ngày/tính năng

<!-- [BẠN CẦN VẼ: Sơ đồ Use Case tổng quan cho hệ thống Hanzii.
- Actor: Người dùng (Guest), Người dùng (Đã đăng nhập)
- Các use case: Tra từ điển, Xem chi tiết từ, Lọc từ theo HSK, Đăng ký, Đăng nhập, Quản lý sổ tay, Ôn tập SRS, Tra ngữ pháp, Dịch thuật, Xem lịch sử, Đổi mật khẩu, Hỏi Gia sư AI
- Guest chỉ truy cập: Tra từ điển, Tra ngữ pháp
- Người dùng đăng nhập truy cập tất cả] -->

3. **Sơ đồ usecase chi tiết**

a. **Chức năng Tra từ điển**

- Module tìm kiếm từ

<!-- [BẠN CẦN VẼ: Sơ đồ Use Case chi tiết cho "Tra từ điển"
- Actor: Người dùng
- Các use case: Nhập từ khóa, Xem gợi ý auto-suggest, Chọn từ gợi ý, Xem danh sách kết quả, Xem chi tiết từ, Lọc theo HSK Level, Lọc theo loại từ, Phân trang kết quả
- Quan hệ include/extend phù hợp] -->

- Module xem chi tiết từ

<!-- [BẠN CẦN VẼ: Sơ đồ Use Case chi tiết cho "Xem chi tiết từ"
- Actor: Người dùng (đã đăng nhập)
- Các use case: Xem Hanzi/Pinyin/Nghĩa, Xem ví dụ, Xem loại từ, Xem cấp HSK, Thêm vào sổ tay, Thêm vào SRS, Phân tích ngữ pháp AI] -->

b. **Chức năng Ôn tập SRS**

<!-- [BẠN CẦN VẼ: Sơ đồ Use Case chi tiết cho "Ôn tập SRS"
- Actor: Người dùng (đã đăng nhập)
- Các use case: Xem thẻ cần ôn, Đánh giá "Học lại" (rating=1), Đánh giá "Khó" (rating=2), Đánh giá "Tốt" (rating=3), Đánh giá "Dễ" (rating=4), Xem lịch ôn tiếp theo] -->
## **Chương 3: Tài liệu pha phân tích**

1. **Scenario**

Hệ thống Hanzii bao gồm các kịch bản (Scenario) sử dụng chính sau:

---

**Scenario chuẩn: Tra từ — Xem chi tiết — Thêm vào sổ tay — Ôn tập SRS**

| Trường | Nội dung |
|---|---|
| **Use Case** | Tra cứu từ vựng, Xem chi tiết, Quản lý Sổ tay, Ôn tập SRS |
| **Actor** | Người dùng (đã đăng nhập) |
| **Tiền điều kiện** | Người dùng đã đăng nhập và đang ở giao diện trang chủ Từ điển |
| **Hậu điều kiện** | Người dùng hoàn thành phiên ôn tập SRS, hệ thống cập nhật lịch ôn tiếp theo |

**Kịch bản chính:**

1. Người dùng nhập từ khóa "学习" vào ô tìm kiếm trên giao diện trang chủ và nhấn Enter.
2. Hệ thống gọi API `/api/words/search?keyword=学习` và hiển thị danh sách kết quả, mỗi mục gồm Hanzi, Pinyin và nghĩa tiếng Việt.
3. Người dùng click vào từ "学习" trong danh sách kết quả.
4. Hệ thống gọi API `/api/words/{id}` và hiển thị chi tiết từ vựng: Hanzi "学习", Pinyin "xuéxí", Hán Việt "Học tập", nghĩa "Học hành, nghiên cứu", câu ví dụ "我喜欢学习中文", loại từ Động từ, cấp HSK 2, số nét 8.
5. Người dùng click nút "Thêm vào sổ tay".
6. Hệ thống hiển thị danh sách sổ tay của người dùng: "HSK 1 - Cơ bản", "HSK 2 - Nâng cao".
7. Người dùng chọn sổ tay "HSK 2 - Nâng cao".
8. Hệ thống gọi API `POST /api/notebooks/{id}/words`, lưu từ "学习" vào sổ tay và hiển thị thông báo "Đã thêm vào sổ tay! Thẻ SRS đã được tạo tự động."
9. Người dùng click vào mục "Sổ tay & Ôn tập" trên thanh điều hướng và chọn sổ tay "HSK 2 - Nâng cao".
10. Hệ thống gọi API `GET /api/srs/due` và hiển thị thông tin: 1 thẻ Mới cần học, kèm nút "Bắt đầu ôn tập".
11. Người dùng click nút "Bắt đầu ôn tập".
12. Hệ thống hiển thị mặt trước thẻ Flashcard: Hanzi "学习" ở giữa và dòng chữ "Nhấn để xem đáp án" bên dưới.
13. Người dùng click vào thẻ để lật xem mặt sau.
14. Hệ thống lật thẻ và hiển thị mặt sau: Pinyin "xuéxí", nghĩa "Học hành, nghiên cứu", câu ví dụ AI "Mỗi ngày tôi dành 2 tiếng để 学习 tiếng Trung" và thông tin "Lần ôn: 1 · Chu kỳ: 1 ngày".
15. Người dùng click nút "Tốt" để đánh giá trí nhớ ở mức 3.
16. Hệ thống gọi API `POST /api/srs/review` với rating=3, tính toán intervalDays mới = 4 ngày, cập nhật nextReviewAt vào Database và hiển thị màn hình tổng kết "Hoàn thành phiên ôn tập! ✅ Đã nhớ: 1 từ."

**Kịch bản ngoại lệ:**

2.1. Hệ thống không tìm thấy từ phù hợp với từ khóa "学习":
- 2.1.1. Hệ thống hiển thị thông báo "Không tìm thấy từ nào phù hợp với từ khóa của bạn."
- 2.1.2. Người dùng xóa từ khóa cũ, nhập lại từ khóa mới và nhấn Enter.
- → Quay lại bước 2.

5.1. Người dùng chưa đăng nhập khi click nút "Thêm vào sổ tay":
- 5.1.1. Hệ thống hiển thị thông báo "Vui lòng đăng nhập để sử dụng tính năng này." kèm nút "Đăng nhập ngay".
- 5.1.2. Người dùng click nút "Đăng nhập ngay".
- 5.1.3. Hệ thống chuyển hướng sang trang Đăng nhập.

10.1. Không có thẻ nào đến hạn ôn tập hôm nay:
- 10.1.1. Hệ thống hiển thị thông báo "Bạn đã hoàn thành tất cả thẻ ôn tập hôm nay! 🎉 Hẹn gặp lại vào ngày mai."
- 10.1.2. Người dùng click OK.
- 10.1.3. Hệ thống quay về giao diện Sổ tay.

15.1. Lỗi kết nối khi gửi kết quả đánh giá lên server:
- 15.1.1. Hệ thống hiển thị thông báo "Không thể lưu kết quả. Vui lòng kiểm tra kết nối mạng."
- 15.1.2. Người dùng click nút "Thử lại".
- 15.1.3. Hệ thống gửi lại request thành công và hiển thị màn hình tổng kết.

---

**Scenario phụ 1: Đăng ký tài khoản (Register)**

| Trường | Nội dung |
|---|---|
| **Actor** | Khách (Guest) |
| **Tiền điều kiện** | Người dùng chưa có tài khoản và truy cập trang Đăng ký |
| **Hậu điều kiện** | Tài khoản mới được tạo thành công |

**Kịch bản chính:**

1. Người dùng điền đầy đủ form: Tên đăng nhập "hanzii_user", Email "user@example.com", Mật khẩu "Pass@1234", Xác nhận mật khẩu "Pass@1234" và click nút "Đăng ký".
2. Hệ thống kiểm tra dữ liệu hợp lệ, gọi API `POST /api/auth/register`, tạo tài khoản mới và hiển thị thông báo "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục."
3. Người dùng click nút "Đăng nhập ngay".
4. Hệ thống chuyển hướng sang trang Đăng nhập.

**Kịch bản ngoại lệ:**

2.1. Dữ liệu không hợp lệ (email sai định dạng hoặc hai mật khẩu không khớp):
- 2.1.1. Hệ thống hiển thị thông báo lỗi ngay dưới trường bị lỗi: "Email không đúng định dạng."
- 2.1.2. Người dùng sửa lại dữ liệu và click nút "Đăng ký".
- → Quay lại bước 2.

2.2. Tên đăng nhập "hanzii_user" đã tồn tại trong hệ thống:
- 2.2.1. Hệ thống hiển thị thông báo "Tên đăng nhập đã được sử dụng. Vui lòng chọn tên khác."
- 2.2.2. Người dùng sửa Tên đăng nhập và click nút "Đăng ký".
- → Quay lại bước 2.

---

**Scenario phụ 2: Đăng nhập (Login)**

| Trường | Nội dung |
|---|---|
| **Actor** | Người dùng đã có tài khoản |
- 9.1.1. Hệ thống hiển thị thông báo "Không thể lưu kết quả. Vui lòng kiểm tra kết nối mạng và thử lại."
- 9.1.2. Người dùng click "Thử lại".
- 9.1.3. Hệ thống gửi lại request. Nếu thành công, tiếp tục từ bước 10.

---

**Scenario 6: Quản lý Sổ tay (Notebook Management)**

| Trường | Nội dung |
|---|---|
| **Use Case** | Quản lý Sổ tay |
| **Actor** | Người dùng (đã đăng nhập) |
| **Tiền điều kiện** | Người dùng đã đăng nhập vào hệ thống Hanzii |
| **Hậu điều kiện** | Sổ tay mới được tạo thành công và sẵn sàng để người dùng thêm từ vựng |

**Kịch bản chính:**

1. Người dùng truy cập trang "Sổ tay & Ôn tập".
2. Hệ thống hiển thị danh sách các sổ tay hiện có của người dùng.
3. Người dùng click nút "+ Tạo sổ tay mới".
4. Hệ thống hiển thị ô nhập tên sổ tay.
5. Người dùng nhập tên sổ tay (ví dụ: "HSK 2 - Từ vựng quan trọng") và click "Xác nhận".
6. Hệ thống gọi API `POST /notebooks`, lưu sổ tay mới vào Database.
7. Hệ thống hiển thị thông báo "Đã tạo sổ tay thành công!" và sổ tay mới xuất hiện trong danh sách.
8. Người dùng truy cập trang Từ điển, tra một từ, click "Thêm vào sổ tay".
9. Hệ thống hiển thị danh sách sổ tay để người dùng chọn.
10. Người dùng chọn sổ tay vừa tạo, hệ thống lưu từ vào sổ tay và thông báo "Đã thêm vào sổ tay!".

**Kịch bản ngoại lệ:**

5.1. Tên sổ tay bị trống hoặc trùng với sổ tay đã có:
- 5.1.1. Hệ thống hiển thị thông báo "Tên sổ tay đã tồn tại hoặc không được để trống."
- 5.1.2. Người dùng click OK.
- 5.1.3. Hệ thống giữ nguyên ô nhập tên để người dùng sửa lại.

---

**Scenario 7: Dịch thuật văn bản (Translation)**

| Trường | Nội dung |
|---|---|
| **Use Case** | Dịch thuật văn bản |
| **Actor** | Người dùng (Guest hoặc đã đăng nhập) |
| **Tiền điều kiện** | Người dùng truy cập trang Dịch thuật |
| **Hậu điều kiện** | Hệ thống hiển thị bản dịch chính xác cho văn bản đầu vào |

**Kịch bản chính:**

1. Người dùng truy cập trang "Dịch thuật" của hệ thống Hanzii.
2. Người dùng chọn ngôn ngữ nguồn là "Tiếng Trung" và ngôn ngữ đích là "Tiếng Việt".
3. Người dùng nhập văn bản cần dịch vào ô bên trái (ví dụ: "你好，很高兴认识你").
4. Người dùng click nút "Dịch".
5. Hệ thống gọi API dịch thuật AI, xử lý và trả về bản dịch.
6. Hệ thống hiển thị kết quả dịch vào ô bên phải: "Xin chào, rất vui được gặp bạn."
7. Hệ thống lưu cặp văn bản gốc — bản dịch vào lịch sử dịch thuật của người dùng.

**Kịch bản thay thế:**

3a. Người dùng click nút "Giọng nói" để nhập văn bản bằng âm thanh:
- 3a.1. Hệ thống kích hoạt microphone.
- 3a.2. Người dùng đọc câu tiếng Trung vào microphone.
- 3a.3. Hệ thống chuyển giọng nói thành văn bản và điền vào ô nhập.
- 3a.4. Tiếp tục từ bước 4.

**Kịch bản ngoại lệ:**

5.1. Lỗi kết nối hoặc hết quota API AI:
- 5.1.1. Hệ thống hiển thị thông báo "Dịch vụ dịch thuật tạm thời không khả dụng. Vui lòng thử lại sau."
- 5.1.2. Người dùng click OK.
- 5.1.3. Hệ thống giữ nguyên văn bản đầu vào để người dùng thử lại.

---

**Scenario 8: Quản lý người dùng (Admin — Manage Users)**

| Trường | Nội dung |
|---|---|
| **Use Case** | Quản lý người dùng |
| **Actor** | Admin |
| **Tiền điều kiện** | Admin đã đăng nhập với tài khoản có quyền ADMIN |
| **Hậu điều kiện** | Tài khoản người dùng vi phạm được khóa thành công |

**Kịch bản chính:**

1. Admin đăng nhập vào hệ thống với tài khoản có role ADMIN.
2. Admin truy cập trang "Quản trị" → tab "Quản lý người dùng".
3. Hệ thống hiển thị danh sách toàn bộ người dùng gồm: Tên đăng nhập, Email, Vai trò, Trạng thái (Active/Blocked).
4. Admin nhập tên người dùng cần tìm vào ô tìm kiếm.
5. Hệ thống lọc và hiển thị người dùng tương ứng.
6. Admin click nút "Khóa tài khoản" bên cạnh tên người dùng vi phạm.
7. Hệ thống hiển thị hộp thoại xác nhận "Bạn có chắc muốn khóa tài khoản này không?" kèm nút "Xác nhận" và "Hủy".
8. Admin click "Xác nhận".
9. Hệ thống gọi API `PUT /users/{id}/block`, cập nhật `isBlocked = true` trong Database.
10. Hệ thống hiển thị thông báo "Đã khóa tài khoản thành công." Trạng thái người dùng chuyển sang "Blocked".

**Kịch bản thay thế:**

6a. Admin muốn mở khóa tài khoản đã bị khóa trước đó:
- 6a.1. Admin click nút "Mở khóa" bên cạnh người dùng có trạng thái "Blocked".
- 6a.2. Hệ thống gọi API `PUT /users/{id}/unblock`, cập nhật `isBlocked = false`.
- 6a.3. Hệ thống hiển thị thông báo "Đã mở khóa tài khoản thành công."

**Kịch bản ngoại lệ:**

6.1. Admin cố gắng khóa tài khoản của một Admin khác:
- 6.1.1. Hệ thống từ chối và hiển thị thông báo "Không thể khóa tài khoản có quyền Admin."
- 6.1.2. Admin click OK.
- 6.1.3. Hệ thống giữ nguyên giao diện danh sách người dùng.

2. **Các lớp thực thể trong hệ thống**

Hệ thống bao gồm các lớp thực thể (Entity) sau:

| STT | Lớp thực thể | Bảng CSDL | Mô tả |
|-----|--------------|-----------|-------|
| 1 | Word | words | Từ vựng tiếng Trung (hanzi, pinyin, meaning, sinoVietnamese, hskLevel, strokeCount, audioUrl) |
| 2 | User | users | Người dùng (username, password, email, role, **isBlocked**) |
| 3 | Notebook | notebook | Sổ tay từ vựng cá nhân (title, createdAt, userId) |
| 4 | SrsReviewCard | srs_review_card | Thẻ ôn tập SRS (repetition, intervalDays, nextReviewAt, lastReviewedAt) |
| 5 | GrammarPoint | grammar_points | Điểm ngữ pháp (title, structure, explanation, hskLevel) |
| 6 | GrammarExample | grammar_examples | Ví dụ ngữ pháp |
| 7 | Translation | translations | Bản dịch (sourceText, translatedText, sourceLanguage, targetLanguage) |
| 8 | SearchHistory | search_history | Lịch sử tìm kiếm (queryText, createdAt) |
| 9 | WordType | word_types | Loại từ (Danh từ, Động từ, Tính từ...) |
| 10 | WordExample | word_examples | Ví dụ sử dụng từ vựng |
| 11 | WordGraphic | word_graphics | Hình ảnh minh họa nét viết chữ Hán |
| 12 | AIConfig | AI_config | Cấu hình AI (apiKey, model, systemPrompt) |
| 13 | **AIUsageLog** | **ai_usage_log** | **Nhật ký sử dụng AI (userId, feature, calledAt, tokenCount)** |
| 14 | Role | (enum) | Vai trò người dùng: USER, ADMIN |

> **Bổ sung so với thiết kế ban đầu:**
> - Entity `User` được thêm trường `isBlocked` (Boolean) để Admin có thể khóa tài khoản người dùng vi phạm.
> - Entity `AIUsageLog` là entity mới, ghi lại mỗi lần người dùng gọi AI (chat, dịch thuật, phân loại HSK). Dữ liệu này phục vụ cho tính năng thống kê sử dụng AI của Admin.

3. **Trích các lớp biên, lớp điều khiển**

- Các lớp biên (Boundary - Frontend Forms):

  - DictionaryFrm — Trang tra từ điển (có thêm nút Voice Search 🎤)
  - NotebookFrm — Trang sổ tay & ôn tập SRS (có thêm Quiz Mode)
  - GrammarFrm — Trang ngữ pháp
  - TranslationFrm — Trang dịch thuật (có thêm nút Voice Input 🎤)
  - HistoryFrm — Trang lịch sử tìm kiếm
  - AccountFrm — Trang tài khoản
  - **AdminFrm** — **Trang quản trị Admin** (Quản lý User + Thống kê AI + Cấu hình AI)
  - AppLayoutFrm — Layout chung (Topbar navigation)
  - AITutorFrm — Widget gia sư AI

- Các lớp điều khiển (Control - Backend):

  - WordCtr — Xử lý API từ vựng (search, suggest, detail, filter)
  - AuthCtr — Xử lý đăng ký, đăng nhập, đổi mật khẩu
  - SrsCtr — Xử lý ôn tập SRS **(thêm endpoint /quiz để sinh câu hỏi trắc nghiệm)**
  - GrammarCtr — Xử lý ngữ pháp
  - TranslationCtr — Xử lý dịch thuật
  - AIConfigCtr — Quản lý cấu hình AI
  - WordAssetCtr — Xử lý tài nguyên từ (ví dụ, hình ảnh)
  - **UserCtr** — **Xử lý API người dùng (thêm DELETE /users/{id}, PUT /users/{id}/block)**
  - **AdminCtr** — **Xử lý thống kê sử dụng AI (GET /admin/ai-stats)**

<!-- [BẠN CẦN VẼ: Sơ đồ các lớp biên và lớp điều khiển
- Hiển thị mối quan hệ giữa các lớp biên (Frontend Pages) <-> các lớp điều khiển (Backend Controllers) <-> các lớp thực thể
- Tương tự hình image5.png trong file mẫu] -->

4. **Thẻ CRC cho lớp điều khiển**

**Thẻ CRC 1 — WordCtr**

| **Trách nhiệm (Responsibility)** | **Cộng tác viên (Collaborator)** |
|---|---|
| Tìm kiếm từ vựng theo từ khóa | WordService, SearchHistoryService |
| Gợi ý từ tự động (auto-suggest) | WordService |
| Xem chi tiết từ vựng | WordService, SearchHistoryService |
| Lọc từ theo cấp HSK và loại từ | WordService |
| Gợi ý từ cá nhân hoá cho người dùng | WordService, CurrentUserService |

---

**Thẻ CRC 2 — AuthCtr**

| **Trách nhiệm (Responsibility)** | **Cộng tác viên (Collaborator)** |
|---|---|
| Đăng ký tài khoản mới | AuthService |
| Đăng nhập và cấp JWT token | AuthService |
| Đổi mật khẩu | AuthService, CurrentUserService |

---

**Thẻ CRC 3 — SrsCtr**

| **Trách nhiệm (Responsibility)** | **Cộng tác viên (Collaborator)** |
|---|---|
| Thêm từ vào hệ thống ôn tập SRS | SrsService, CurrentUserService |
| Lấy danh sách thẻ cần ôn hôm nay | SrsService, CurrentUserService |
| Gửi kết quả đánh giá (Again/Hard/Good/Easy) | SrsService, CurrentUserService |
| Sinh câu hỏi trắc nghiệm (Quiz Mode) | SrsService, CurrentUserService |

---

**Thẻ CRC 4 — GrammarCtr**

| **Trách nhiệm (Responsibility)** | **Cộng tác viên (Collaborator)** |
|---|---|
| Lấy danh sách điểm ngữ pháp | GrammarPointService |
| Xem chi tiết một điểm ngữ pháp | GrammarPointService, GrammarExampleService |

---

**Thẻ CRC 5 — TranslationCtr**

| **Trách nhiệm (Responsibility)** | **Cộng tác viên (Collaborator)** |
|---|---|
| Dịch văn bản (Trung → Việt / Việt → Trung) | TranslationService |
| Lấy lịch sử dịch của người dùng | TranslationService, CurrentUserService |

---

**Thẻ CRC 6 — AIConfigCtr**

| **Trách nhiệm (Responsibility)** | **Cộng tác viên (Collaborator)** |
|---|---|
| Lấy cấu hình AI hiện tại (model, systemPrompt) | AIConfigService |
| Cập nhật cấu hình AI | AIConfigService |
| Ghi nhật ký lượt sử dụng AI | AIUsageLogService |

---

**Thẻ CRC 7 — WordAssetCtr**

| **Trách nhiệm (Responsibility)** | **Cộng tác viên (Collaborator)** |
|---|---|
| Lấy ví dụ câu cho một từ vựng | WordAssetService |
| Lấy hình ảnh minh hoạ từ vựng | WordAssetService |

---

**Thẻ CRC 8 — UserCtr**

| **Trách nhiệm (Responsibility)** | **Cộng tác viên (Collaborator)** |
|---|---|
| Lấy thông tin profile người dùng | UserService, CurrentUserService |
| Cập nhật thông tin profile | UserService, CurrentUserService |
| Xoá tài khoản người dùng (Admin) | UserService |
| Khoá / mở khoá tài khoản người dùng (Admin) | UserService |

---

**Thẻ CRC 9 — AdminCtr**

| **Trách nhiệm (Responsibility)** | **Cộng tác viên (Collaborator)** |
|---|---|
| Lấy thống kê lượt sử dụng AI | AIUsageLogService |
| Lấy danh sách người dùng | UserService |
| Xem báo cáo hoạt động hệ thống | AIUsageLogService, UserService |

5. **Scenario chuẩn cho từng module**

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th>Use case</th>
<th>Tra cứu từ vựng</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Actor</td>
<td>Người dùng (Guest hoặc đã đăng nhập)</td>
</tr>
<tr class="even">
<td>Tiền điều kiện</td>
<td>Người dùng truy cập trang Từ điển của hệ thống Hanzii</td>
</tr>
<tr class="odd">
<td>Hậu điều kiện</td>
<td>Hệ thống hiển thị kết quả tìm kiếm và chi tiết từ vựng</td>
</tr>
<tr class="even">
<td>Kịch bản chính</td>
<td><ol type="1">
<li><p>Người dùng nhập từ khóa "你好" vào thanh tìm kiếm</p></li>
<li><p>Sau 400ms debounce, hệ thống gọi API /suggest và hiển thị danh sách gợi ý bên dưới</p></li>
<li><p>Người dùng nhấn Enter hoặc click nút tìm kiếm</p></li>
<li><p>Hệ thống gọi API /search, hiển thị danh sách kết quả (hanzi, pinyin, nghĩa) có phân trang</p></li>
<li><p>Người dùng click vào từ "你好" trong kết quả</p></li>
<li><p>Hệ thống gọi API /words/{id}, hiển thị chi tiết: Hanzi, Pinyin, Hán Việt, nghĩa, ví dụ, loại từ, cấp HSK</p></li>
</ol></td>
</tr>
<tr class="odd">
<td>Ngoại lệ</td>
<td><ol start="4" type="1">
<li><p>Không tìm thấy kết quả: Hệ thống hiển thị thông báo "Không tìm thấy kết quả"</p></li>
</ol></td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<thead>
<tr class="header">
<th>Use case</th>
<th>Ôn tập SRS</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Actor</td>
<td>Người dùng (đã đăng nhập)</td>
</tr>
<tr class="even">
<td>Tiền điều kiện</td>
<td>Người dùng đã đăng nhập, có từ vựng trong sổ tay và đã thêm vào SRS</td>
</tr>
<tr class="odd">
<td>Hậu điều kiện</td>
<td>Người dùng ôn tập được từ vựng, hệ thống cập nhật lịch ôn tập tiếp theo</td>
</tr>
<tr class="even">
<td>Kịch bản chính</td>
<td><ol type="1">
<li><p>Người dùng mở trang "Sổ tay & Ôn tập"</p></li>
<li><p>Hệ thống hiển thị số thẻ cần ôn hôm nay và danh sách thẻ</p></li>
<li><p>Người dùng xem thẻ: hiển thị Hanzi, Pinyin, Nghĩa</p></li>
<li><p>Người dùng chọn đánh giá "Tốt" (rating = 3)</p></li>
<li><p>Hệ thống tính toán: intervalDays = intervalDays * 2.5, cập nhật nextReviewAt</p></li>
<li><p>Hệ thống hiển thị thông báo: "你好: Tốt · ôn tiếp 25/05/2026"</p></li>
</ol></td>
</tr>
<tr class="odd">
<td>Ngoại lệ</td>
<td><ol start="2" type="1">
<li><p>Không có thẻ cần ôn: Hệ thống hiển thị "Chưa có thẻ nào đến hạn ôn tập"</p></li>
</ol></td>
</tr>
</tbody>
</table>

### **7. Sequence diagram**

- Module "Tra cứu từ vựng"

<!-- [BẠN CẦN VẼ: Sequence Diagram cho module Tra cứu từ vựng:
Các đối tượng: Người dùng -> DictionaryPage -> api.js -> WordController -> WordService -> WordRepository -> Database

1. Người dùng nhập từ khóa
2. DictionaryPage gọi api.searchWords(keyword, page)
3. api.js gửi GET /api/words/search?keyword=...&page=0&size=10
4. WordController nhận request, gọi wordService.searchWords()
5. WordService gọi wordRepository.searchByKeyword() (Native Query)
6. WordRepository truy vấn MySQL
7. Database trả kết quả
8. WordService map sang WordResponseDTO
9. WordController wrap trong ApiResponse, trả ResponseEntity
10. api.js parse JSON, trả về {items, page, totalPages}
11. DictionaryPage cập nhật searchState, render kết quả
] -->

- Module "Tra cứu từ bằng giọng nói" *(Mới)*

<!-- [BẠN CẦN VẼ: Sequence Diagram cho module Voice Search:
Các đối tượng: Người dùng -> DictionaryPage -> Web Speech API (Browser) -> WordController -> Database

1. Người dùng click nút 🎤
2. DictionaryPage kiểm tra window.SpeechRecognition, nếu không có thì hiển thị thông báo "Trình duyệt không hỗ trợ"
3. DictionaryPage tạo SpeechRecognition instance với lang='zh-CN'
4. Web Speech API kích hoạt microphone, hiện trạng thái "Đang nghe..."
5. Người dùng nói: "你好"
6. Web Speech API trả về event.results[0][0].transcript = "你好"
7. DictionaryPage gọi setKeyword("你好")
8. DictionaryPage trigger searchWords() -> api.js gửi GET /api/words/search?keyword=你好
9. WordController -> WordService -> WordRepository -> Database
10. Kết quả hiển thị lên màn hình
] -->

- Module "Ôn tập SRS"

<!-- [BẠN CẦN VẼ: Sequence Diagram cho module Ôn tập SRS:
Các đối tượng: Người dùng -> NotebookPage -> api.js -> SrsController -> SrsService -> SrsReviewCardRepository -> Database

1. Người dùng mở trang Ôn tập
2. NotebookPage gọi api.getSrsDueCards(token)
3. api.js gửi GET /api/srs/due
4. SrsController gọi srsService.getDueCards(userId)
5. SrsService query cards có nextReviewAt <= now
6. Database trả danh sách cards
7. SrsService map sang SrsReviewCardResponseDTO
8. Trả về cho frontend, hiển thị các thẻ

9. Người dùng đánh giá thẻ (rating = 3)
10. NotebookPage gọi api.submitSrsReview(wordId, rating, token)
11. api.js gửi POST /api/srs/review
12. SrsController gọi srsService.submitReview()
13. SrsService tính toán: repetition++, intervalDays = intervalDays * 2.5, nextReviewAt = now + intervalDays
14. SrsReviewCardRepository save card
15. Trả về card đã cập nhật
16. NotebookPage hiển thị thông báo thành công
] -->

- Module "Quiz Mode (Kiểm tra trắc nghiệm)" *(Mới)*

<!-- [BẠN CẦN VẼ: Sequence Diagram cho module Quiz Mode:
Các đối tượng: Người dùng -> NotebookPage -> api.js -> SrsController -> SrsService -> WordRepository -> Database

1. Người dùng nhấn nút "Kiểm tra" trong Notebook
2. NotebookPage gọi api.getNotebookQuiz(notebookId, count=10, token)
3. api.js gửi GET /api/srs/quiz/notebook/{notebookId}?count=10
4. SrsController gọi srsService.generateQuiz(userId, notebookId, count)
5. SrsService lấy danh sách từ trong notebook
6. Với mỗi từ: wordRepository lấy thêm 3 từ ngẫu nhiên làm đáp án sai
7. SrsService xáo trộn 4 đáp án, trả về List<QuizQuestionDTO>
8. NotebookPage render câu hỏi đầu tiên: hiển thị Hanzi + 4 lựa chọn
9. Người dùng chọn đáp án
10. Nếu đúng: NotebookPage gọi api.submitSrsReview(wordId, rating=3, token)
    Nếu sai: NotebookPage gọi api.submitSrsReview(wordId, rating=1, token)
11. SrsController -> SrsService cập nhật intervalDays theo rating
12. Chuyển sang câu hỏi tiếp theo
13. Sau câu cuối: hiển thị kết quả (điểm số, % đúng, nút Làm lại)
] -->

- Module "Admin - Xem thống kê AI" *(Mới)*

<!-- [BẠN CẦN VẼ: Sequence Diagram cho Admin Stats:
Các đối tượng: Admin -> AdminPage -> api.js -> AdminController -> SecurityConfig -> AIUsageLogRepository -> Database

1. Admin truy cập /admin
2. AdminPage kiểm tra role từ AppContext: nếu không phải ADMIN thì redirect về /dictionary
3. Admin click tab "Thống kê AI"
4. AdminPage gọi api.getAiStats(token)
5. api.js gửi GET /api/admin/ai-stats với header Authorization: Bearer {adminToken}
6. AdminController -> SecurityConfig kiểm tra hasRole('ADMIN')
7. AdminController gọi aiUsageLogRepository.findStats()
8. Database trả về: tổng lượt, theo ngày, theo feature
9. AdminController trả về Map<String, Object>
10. AdminPage render biểu đồ cột theo ngày
] -->
## **Chương 4: Pha thiết kế**

1. **Sơ đồ lớp thực thể toàn hệ thống**

<!-- [BẠN CẦN VẼ: Class Diagram cho toàn bộ các Entity trong hệ thống. Bao gồm:

1. Word (id, hanzi, pinyin, meaning, sinoVietnamese, hskLevel, strokeCount, audioUrl, createdAt)
   - OneToMany -> WordGraphic
   - ManyToMany -> GrammarPoint (qua bảng word_grammar)
   - ManyToMany -> Notebook (qua bảng notebook_items)
   - OneToMany -> SearchHistory
   - ManyToMany -> WordType (qua bảng word_has_type)
   - OneToMany -> WordExample

2. User (id, username, password, email, role)
   - OneToMany -> Notebook
   - OneToMany -> SearchHistory
   - OneToMany -> Translation

3. Notebook (id, title, createdAt)
   - ManyToOne -> User
   - ManyToMany -> Word

4. SrsReviewCard (id, repetition, intervalDays, nextReviewAt, lastReviewedAt, customExamples)
   - ManyToOne -> User
   - ManyToOne -> Word

5. GrammarPoint (id, title, structure, explanation, hskLevel)
   - ManyToMany -> Word
   - OneToMany -> GrammarExample

6. GrammarExample (id, ...)
   - ManyToOne -> GrammarPoint

7. Translation (id, sourceText, translatedText, sourceLanguage, targetLanguage, createdAt)
   - ManyToOne -> User

8. SearchHistory (id, queryText, createdAt)
   - ManyToOne -> Word
   - ManyToOne -> User

9. WordType (id, name)
   - ManyToMany -> Word

10. WordExample (id, ...)
    - ManyToOne -> Word

11. WordGraphic (id, gifOrder, ...)
    - ManyToOne -> Word

12. AIConfig (id, apiKey, model, systemPrompt, is_active)

13. Role (enum: USER, ADMIN)
] -->

2. **Trình bày sơ đồ quan hệ giữa các bảng trong hệ thống**

- Entity Word -> bảng `words`
- Entity User -> bảng `users` *(thêm cột `is_blocked` Boolean)*
- Entity Notebook -> bảng `notebook`
- Entity SrsReviewCard -> bảng `srs_review_card`
- Entity GrammarPoint -> bảng `grammar_points`
- Entity GrammarExample -> bảng `grammar_examples`
- Entity Translation -> bảng `translations`
- Entity SearchHistory -> bảng `search_history`
- Entity WordType -> bảng `word_types`
- Entity WordExample -> bảng `word_examples`
- Entity WordGraphic -> bảng `word_graphics`
- Entity AIConfig -> bảng `AI_config`
- **Entity AIUsageLog -> bảng `ai_usage_log`** *(Mới)*
- Bảng trung gian `word_grammar` (word_id, grammar_point_id)
- Bảng trung gian `notebook_items` (word_id, notebook_id)
- Bảng trung gian `word_has_type` (word_id, word_type_id)

**Mô tả bảng `ai_usage_log` (Mới):**

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Khóa chính |
| user_id | BIGINT | FK -> users(id) | Người dùng gọi AI |
| feature | VARCHAR(50) | NOT NULL | Tính năng: CHAT / TRANSLATE / CLASSIFY |
| called_at | DATETIME | NOT NULL | Thời điểm gọi API |
| token_count | INT | NULL | Số token ước tính (tùy chọn) |

**Quan hệ bổ sung:**
- `users` 1--N `ai_usage_log`: Một người dùng có thể gọi AI nhiều lần

> Hình ảnh thiết kế CSDL:

<!-- [BẠN CẦN VẼ: Sơ đồ ERD (Entity Relationship Diagram) cho CSDL MySQL.
Thể hiện các bảng trên và quan hệ giữa chúng:
- users 1--N notebook
- users 1--N search_history
- users 1--N translations
- users 1--N srs_review_card
- words 1--N word_graphics
- words 1--N word_examples
- words 1--N search_history
- words N--N grammar_points (qua word_grammar)
- words N--N notebook (qua notebook_items)
- words N--N word_types (qua word_has_type)
- words 1--N srs_review_card
- grammar_points 1--N grammar_examples
- notebook N--1 users
] -->

3. **Sơ đồ MVC**

> Hệ thống Hanzii được xây dựng theo kiến trúc MVC mở rộng (Layered Architecture):

<!-- [BẠN CẦN VẼ: Sơ đồ kiến trúc MVC của hệ thống:

**View (Frontend - React)**:
DictionaryPage (+ Voice Search), NotebookPage (+ Quiz Mode), GrammarPage, TranslationPage (+ Voice Input), HistoryPage, AccountPage, AdminPage (Mới)
  |
  | (HTTP REST API qua api.js + Web Speech API trực tiếp trên Browser)
  v
**Controller (Spring Boot REST Controllers)**:
WordController, AuthController, SrsController (+ /quiz endpoint), GrammarController, TranslationController, AIConfigController, WordAssetController, UserController (+ block/delete), AdminController (Mới)
  |
  v
**Service (Business Logic)**:
WordService, AuthService, SrsService (+ generateQuiz), GrammarPointService, TranslationService, NotebookService, SearchHistoryService, GeminiService, AIAssistantService, AIUsageLogService (Mới)
  |
  v
**Repository (Data Access - Spring Data JPA)**:
WordRepository, UserRepository, NotebookRepository, SrsReviewCardRepository, GrammarPointRepository, TranslationRepository, SearchHistoryRepository, AIUsageLogRepository (Mới)
  |
  v
**Model (Entity / Database - MySQL)**:
Word, User (+ isBlocked), Notebook, SrsReviewCard, GrammarPoint, Translation, SearchHistory, WordType, AIUsageLog (Mới)
] -->

4. **Dùng thẻ CRC để gán phương thức cho các lớp**

<!-- [BẠN CẦN VẼ: Các thẻ CRC có gán phương thức. Tạo 1 bảng cho mỗi Service:

**WordService:**
| Phương thức | Mô tả |
| searchWords(keyword, pageable) | Tìm kiếm từ vựng theo keyword (native query) |
| suggestWords(keyword, pageable) | Gợi ý từ vựng khi gõ |
| getDetail(id) | Lấy chi tiết 1 từ |
| getWordsByHskAndTypes(hskLevel, types) | Lọc từ theo HSK và loại từ |
| getWordsByHskAndTypesPaged(...) | Lọc từ có phân trang |
| getRecommendedWordsByUser(userId) | Gợi ý từ dựa trên lịch sử người dùng |
| fixDictionaryMeanings() | Sửa dữ liệu nghĩa từ trong CSDL |

**SrsService:**
| Phương thức | Mô tả |
| addWordToSrs(request) | Thêm từ vào hệ thống SRS |
| getDueCards(userId) | Lấy thẻ cần ôn hôm nay |
| getAllCards(userId) | Lấy tất cả thẻ SRS |
| getDueCardsByNotebook(userId, notebookId) | Lấy thẻ cần ôn theo notebook |
| submitReview(request) | Gửi kết quả đánh giá, tính interval mới |
| ensureNotebookWordsInSrs(userId, notebookId) | Đảm bảo tất cả từ trong notebook có thẻ SRS |

**AuthService:**
| Phương thức | Mô tả |
| register(request) | Đăng ký tài khoản mới |
| login(request) | Đăng nhập, trả về JWT token |
| changePassword(userId, request) | Đổi mật khẩu |

**NotebookService:**
| Phương thức | Mô tả |
| getMyNotebooks(userId) | Lấy danh sách sổ tay |
| createNotebook(title, userId) | Tạo sổ tay mới |
| addWordToNotebook(notebookId, wordId) | Thêm từ vào sổ tay |
] -->

5. **Định nghĩa khuôn mẫu cho từng phương thức**

- Với **DictionaryPage**: Có phương thức hiển thị thanh tìm kiếm Hero Search với auto-suggest (debounce 400ms), phương thức xử lý sự kiện nhập từ khóa và tìm kiếm, phương thức hiển thị danh sách kết quả tìm kiếm với phân trang, phương thức hiển thị chi tiết từ vựng khi click, phương thức lọc từ theo HSK Level và loại từ qua Filter Chips.

- Với **NotebookPage**: Có phương thức hiển thị danh sách sổ tay và từ vựng trong sổ tay, phương thức tạo sổ tay mới, phương thức thêm/xóa từ trong sổ tay, phương thức hiển thị thẻ SRS cần ôn, phương thức xử lý đánh giá SRS (4 nút: Học lại, Khó, Tốt, Dễ), phương thức tìm kiếm từ trong sổ tay.

- Với **GrammarPage**: Có phương thức hiển thị danh sách điểm ngữ pháp, phương thức xem chi tiết ngữ pháp (cấu trúc, giải thích, ví dụ).

- Với **TranslationPage**: Có phương thức nhập văn bản cần dịch, phương thức gọi API dịch và hiển thị kết quả, phương thức hiển thị lịch sử bản dịch.

- Với **AccountPage**: Có phương thức đăng nhập/đăng ký (form chuyển đổi), phương thức đổi mật khẩu, phương thức đăng xuất, phương thức hiển thị thông tin tài khoản.

- Với **WordController**: Có các endpoint REST: GET /search, GET /suggest, GET /{id}, GET /filter, GET /filter/paged, GET /recommended/me/paged. Mỗi endpoint trả về ApiResponse chuẩn hóa.

- Với **SrsService**: Có phương thức tính toán interval SRS theo rating (1=Again: reset interval=1, 2=Hard: interval*1.2, 3=Good: interval*2.5, 4=Easy: interval*4.0). Cập nhật repetition, intervalDays, nextReviewAt, lastReviewedAt.

6. **Sơ đồ tuần tự sau pha thiết kế**

- Module "Thêm từ vào Sổ tay & SRS"

<!-- [BẠN CẦN VẼ: Sequence Diagram sau pha thiết kế cho "Thêm từ vào Sổ tay":
Các đối tượng: Người dùng -> DictionaryPage -> AppContext -> api.js -> NotebookController -> NotebookService -> NotebookRepository -> SrsController -> SrsService -> SrsReviewCardRepository -> Database

1. Người dùng click "Thêm vào sổ tay" ở chi tiết từ
2. DictionaryPage gọi AppContext.addCurrentWordToNotebook()
3. AppContext gọi api.addWordToNotebook(notebookId, wordId, token)
4. api.js gửi POST /api/notebooks/{id}/words
5. NotebookController -> NotebookService.addWord()
6. NotebookRepository save
7. AppContext gọi tiếp api.addWordToSrs(wordId, token) (tự động thêm SRS)
8. api.js gửi POST /api/srs/add
9. SrsController -> SrsService.addWordToSrs()
10. SrsReviewCardRepository save (repetition=0, intervalDays=0, nextReviewAt=now)
11. Trả về thành công
12. AppContext reload notebooks + reload srsDueCards
13. Hiển thị thông báo: Đã thêm "你好" vào sổ và bắt đầu lộ trình học (SRS)!
] -->
## **Chương 5: Pha cài đặt**

1. **Các thành phần trong chức năng Tra từ điển**

- Các thành phần khai báo (DictionaryPage.jsx):

<!-- [BẠN CẦN VẼ: Screenshot code các state declarations trong DictionaryPage:
- searchKeyword, searchState, wordDetail, filterForm, filterState
- Các hooks: useAppContext(), useEffect
- Hero Search Section với thanh tìm kiếm bo tròn
] -->

- Phương thức tìm kiếm với auto-suggest (debounce 400ms):

> Khi người dùng gõ từ khóa vào thanh tìm kiếm, hệ thống sử dụng kỹ thuật debounce 400ms để giảm số lần gọi API. Sau khi ngừng gõ 400ms, hệ thống gọi API `/api/words/suggest` để lấy danh sách gợi ý và hiển thị dropdown bên dưới thanh tìm kiếm.

<!-- [BẠN CẦN VẼ: Screenshot code phần auto-suggest trong DictionaryPage.jsx, bao gồm:
- useEffect với debounce setTimeout 400ms
- Gọi API suggest
- Hiển thị dropdown gợi ý
] -->

- Phương thức tìm kiếm chính (loadSearch):

> Khi người dùng nhấn Enter hoặc click nút tìm kiếm, AppContext gọi `searchWords()` từ api.js. API gửi GET request đến `/api/words/search?keyword=...&page=0&size=10`. Backend sử dụng Native Query tối ưu với `LIKE` để tìm kiếm trong bảng `words` (120.000+ bản ghi), trả về kết quả phân trang.

<!-- [BẠN CẦN VẼ: Screenshot code hàm loadSearch trong AppContext.jsx (dòng 161-178)] -->

- Giao diện hiển thị trang Tra từ điển:

<!-- [BẠN CẦN VẼ: Screenshot giao diện trang Dictionary với:
- Hero Search Section (thanh tìm kiếm lớn bo tròn)
- Filter Chips (HSK Level, loại từ)
- Danh sách kết quả tìm kiếm (bố cục 2 cột)
- Chi tiết từ vựng ở cột phải
] -->

- Hiển thị chi tiết từ vựng:

> Khi người dùng click vào một từ trong kết quả, hệ thống gọi `handleSelectWord(wordId)` -> API GET `/api/words/{id}` -> WordService map dữ liệu chi tiết (hanzi, pinyin, meaning, sinoVietnamese, hskLevel, examples, wordTypes, graphics) sang WordResponseDTO -> hiển thị ở panel chi tiết bên phải.

<!-- [BẠN CẦN VẼ: Screenshot giao diện chi tiết từ vựng hiển thị:
- Hanzi lớn, Pinyin, Hán Việt
- Nghĩa tiếng Việt
- Loại từ (tags)
- Cấp HSK
- Ví dụ sử dụng
- Nút "Thêm vào sổ tay"
] -->

- Phương thức lọc từ theo HSK Level và loại từ:

> Người dùng chọn HSK Level (1-6) qua Filter Chips và chọn loại từ. Hệ thống gọi API `/api/words/filter/paged` với params hskLevel và types, trả về danh sách từ phân trang.

<!-- [BẠN CẦN VẼ: Screenshot code hàm loadFilter trong AppContext.jsx (dòng 193-209)] -->

---

2. **Các thành phần trong chức năng Sổ tay & Ôn tập SRS**

- Các thành phần khai báo (NotebookPage.jsx):

<!-- [BẠN CẦN VẼ: Screenshot code state declarations trong NotebookPage:
- notebooks, selectedNotebookId, srsDueCards
- Các section: Quản lý sổ tay, Danh sách từ, Ôn tập SRS
] -->

- Giao diện hiển thị trang Sổ tay:

<!-- [BẠN CẦN VẼ: Screenshot giao diện trang Notebook gồm:
- Dropdown chọn sổ tay + nút tạo sổ tay mới
- Danh sách từ vựng trong sổ tay (có phân trang, tìm kiếm)
- Section "Ôn tập SRS" với các thẻ cần ôn
] -->

- Thuật toán SRS (Spaced Repetition System):

> Hệ thống SRS trong Hanzii lấy cảm hứng từ thuật toán SM-2 của Anki. Khi người dùng đánh giá một thẻ, hệ thống tính toán khoảng cách ôn tập tiếp theo:

| Rating | Ý nghĩa | Công thức tính intervalDays mới |
|--------|---------|-------------------------------|
| 1 (Again/Học lại) | Quên hoàn toàn | repetition = 0, intervalDays = 1 |
| 2 (Hard/Khó) | Nhớ mang máng | intervalDays = max(1, intervalDays × 1.2) |
| 3 (Good/Tốt) | Nhớ được | repetition++, intervalDays = intervalDays × 2.5 |
| 4 (Easy/Dễ) | Nhớ rất rõ | repetition++, intervalDays = intervalDays × 4.0 |

<!-- [BẠN CẦN VẼ: Screenshot code thuật toán SRS trong SrsService.java (dòng 165-217) - phần submitReview với switch-case rating 1-4] -->

- Xử lý sự kiện đánh giá thẻ SRS:

> Khi người dùng nhấn một trong 4 nút đánh giá, AppContext gọi `handleSrsReview(card, rating)` -> api.js gửi POST `/api/srs/review` -> SrsService tính toán interval mới -> cập nhật nextReviewAt = now + intervalDays -> trả về thẻ đã cập nhật -> hiển thị thông báo với thời gian ôn tiếp.

<!-- [BẠN CẦN VẼ: Screenshot code hàm handleSrsReview trong AppContext.jsx (dòng 309-330)] -->

<!-- [BẠN CẦN VẼ: Screenshot giao diện thẻ SRS đang ôn tập với 4 nút đánh giá: Học lại, Khó, Tốt, Dễ] -->

---

8. **Các thành phần trong chức năng Tìm kiếm bằng Giọng nói** *(Mới)*

> Chức năng tìm kiếm bằng giọng nói sử dụng **Web Speech API** — một API có sẵn trên các trình duyệt hiện đại (Chrome, Edge) mà không cần cài đặt thêm thư viện hay gọi về server. Toàn bộ quá trình nhận diện giọng nói diễn ra trực tiếp trên trình duyệt của người dùng.

- Custom hook `useVoiceInput(lang)` tái sử dụng cho cả Dictionary và Translation:

```javascript
// hooks/useVoiceInput.js
export function useVoiceInput(lang = 'zh-CN') {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  function startListening(onResult) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Trình duyệt không hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome hoặc Edge.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = lang
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => setListening(true)
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setTranscript(text)
      onResult(text)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.start()
  }

  return { listening, transcript, startListening }
}
```

- Tích hợp vào DictionaryPage — nút Voice Search:

```jsx
// Trong DictionaryPage.jsx
const { listening, startListening } = useVoiceInput('zh-CN')

<button
  type="button"
  className={`btn-ghost btn-icon voice-btn ${listening ? 'listening' : ''}`}
  onClick={() => startListening((text) => {
    setKeyword(text)
    handleSearch(text) // trigger search ngay
  })}
  title="Tìm kiếm bằng giọng nói"
>
  {listening ? '🔴 Đang nghe...' : '🎤'}
</button>
```

- Tích hợp vào TranslationPage — nút Voice Input:

```jsx
// Ngôn ngữ nhận diện thay đổi theo sourceLang đã chọn
const langMap = { 'Tiếng Trung': 'zh-CN', 'Tiếng Việt': 'vi-VN', 'English': 'en-US' }
const { listening, startListening } = useVoiceInput(langMap[sourceLang])
```

<!-- [BẠN CẦN VẼ: Screenshot giao diện DictionaryPage với nút 🎤 bên cạnh ô tìm kiếm, trạng thái "Đang nghe..." khi đang nhận diện] -->

---

9. **Các thành phần trong chức năng Quiz Mode** *(Mới)*

> Quiz Mode là chế độ kiểm tra từ vựng trắc nghiệm, được tích hợp trực tiếp vào trang Sổ tay. Hệ thống tự động sinh 4 đáp án cho mỗi câu hỏi (1 đúng, 3 sai ngẫu nhiên) và cập nhật rating SRS dựa trên kết quả.

- Backend — Endpoint sinh câu hỏi Quiz trong `SrsController`:

```java
// GET /api/srs/quiz/notebook/{notebookId}?count=10
@GetMapping("/quiz/notebook/{notebookId}")
public ResponseEntity<ApiResponse<List<QuizQuestionDTO>>> generateQuiz(
    @PathVariable Long notebookId,
    @RequestParam(defaultValue = "10") int count
) {
    Long userId = currentUserService.requireUserId();
    List<QuizQuestionDTO> questions = srsService.generateQuiz(userId, notebookId, count);
    return ResponseEntity.ok(ApiResponse.success("Quiz generated", questions));
}
```

- DTO `QuizQuestionDTO`:

```java
public class QuizQuestionDTO {
    private Long wordId;
    private String hanzi;       // Câu hỏi hiển thị
    private String pinyin;
    private List<String> choices;      // 4 lựa chọn (đã xáo trộn)
    private String correctAnswer;      // Đáp án đúng
}
```

- Thuật toán sinh Quiz trong `SrsService`:

> 1. Lấy danh sách từ trong notebook (tối đa `count` từ, ưu tiên từ đến hạn ôn).
> 2. Với mỗi từ, lấy thêm 3 từ ngẫu nhiên từ DB (không trùng với từ đang hỏi) làm đáp án sai.
> 3. Gộp 4 đáp án vào mảng `choices`, xáo trộn thứ tự bằng `Collections.shuffle()`.
> 4. Trả về `QuizQuestionDTO` với `correctAnswer` = meaning của từ gốc.

- Frontend — Component Quiz trong NotebookPage:

```jsx
// State quiz
const [quizMode, setQuizMode] = useState(false)
const [quizQuestions, setQuizQuestions] = useState([])
const [quizIndex, setQuizIndex] = useState(0)
const [quizScore, setQuizScore] = useState({ correct: 0, wrong: 0 })
const [selectedAnswer, setSelectedAnswer] = useState(null)

async function startQuiz() {
  const questions = await getNotebookQuiz({ notebookId: activeNotebookId, count: 10, token })
  setQuizQuestions(questions)
  setQuizIndex(0)
  setQuizScore({ correct: 0, wrong: 0 })
  setQuizMode(true)
}

async function handleQuizAnswer(choice) {
  setSelectedAnswer(choice)
  const question = quizQuestions[quizIndex]
  const isCorrect = choice === question.correctAnswer
  // Cập nhật SRS rating ngay: đúng = 3 (Tốt), sai = 1 (Học lại)
  await submitSrsReview({ wordId: question.wordId, rating: isCorrect ? 3 : 1, token })
  setQuizScore(prev => ({ ...prev,
    correct: prev.correct + (isCorrect ? 1 : 0),
    wrong: prev.wrong + (isCorrect ? 0 : 1)
  }))
  // Tự động chuyển câu sau 1.5 giây
  setTimeout(() => {
    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex(prev => prev + 1)
      setSelectedAnswer(null)
    } else {
      setQuizMode(false) // Hiển thị kết quả
    }
  }, 1500)
}
```

<!-- [BẠN CẦN VẼ: Screenshot giao diện Quiz Mode với câu hỏi Hanzi ở giữa, 4 nút đáp án bên dưới, thanh tiến trình ở trên] -->

<!-- [BẠN CẦN VẼ: Screenshot màn hình kết quả Quiz: "Hoàn thành! Đúng: 8/10 (80%). Kết quả đã được cập nhật vào lịch SRS của bạn."] -->

---

10. **Trang Quản trị Admin** *(Mới)*

> Trang Admin chỉ dành cho tài khoản có `role = ADMIN`. Frontend kiểm tra role sau khi đăng nhập và chỉ hiển thị mục "Admin" trong navigation khi là Admin. Tất cả API `/api/admin/**` được bảo vệ bằng `@PreAuthorize("hasRole('ADMIN')")` ở backend.

- Backend — Endpoint quản lý User:

```java
// PUT /api/users/{id}/block — Khóa tài khoản
@PutMapping("/{id}/block")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ApiResponse<String>> blockUser(@PathVariable Long id) {
    userService.blockUser(id);
    return ResponseEntity.ok(ApiResponse.success("User blocked successfully", null));
}

// DELETE /api/users/{id} — Xóa tài khoản
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
    return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
}
```

- Backend — Endpoint thống kê AI (AdminController mới):

```java
// GET /api/admin/ai-stats — Thống kê lượt dùng AI
@GetMapping("/ai-stats")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ApiResponse<Map<String, Object>>> getAiStats() {
    Map<String, Object> stats = Map.of(
        "totalCalls", aiUsageLogRepository.count(),
        "byFeature", aiUsageLogRepository.countGroupByFeature(),
        "byDate", aiUsageLogRepository.countGroupByDate(LocalDate.now().minusDays(7))
    );
    return ResponseEntity.ok(ApiResponse.success("Stats retrieved", stats));
}
```

- Frontend — AdminPage với 3 tab:

> - **Tab 1: Quản lý Người dùng** — Bảng danh sách users (username, email, role, trạng thái), nút Khóa/Mở khóa, nút Xóa.
> - **Tab 2: Thống kê AI** — Biểu đồ cột theo ngày (7 ngày gần nhất), phân loại theo Feature (CHAT / TRANSLATE / CLASSIFY).
> - **Tab 3: Cấu hình AI** — Form cập nhật API Key và System Prompt (gọi API `/api/ai-config/update`).

<!-- [BẠN CẦN VẼ: Screenshot trang Admin - Tab Quản lý User với bảng danh sách và nút khóa/xóa] -->

<!-- [BẠN CẦN VẼ: Screenshot trang Admin - Tab Thống kê AI với biểu đồ cột lượt gọi theo ngày] -->

---

3. **Các thành phần trong chức năng Ngữ pháp**

- Giao diện hiển thị trang Ngữ pháp:

<!-- [BẠN CẦN VẼ: Screenshot giao diện trang Grammar:
- Danh sách điểm ngữ pháp (sidebar)
- Chi tiết ngữ pháp: tiêu đề, cấu trúc, giải thích, ví dụ
] -->

- Phương thức load ngữ pháp:

> Khi mở trang Ngữ pháp, AppContext tự động gọi `loadGrammarPoints()` -> API GET `/api/grammar` -> trả về danh sách GrammarPoint. Khi chọn 1 điểm ngữ pháp, gọi song song `getGrammarPointDetail()` và `getGrammarExamplesByPointId()` bằng `Promise.all()`.

<!-- [BẠN CẦN VẼ: Screenshot code hàm loadGrammarPoints và loadGrammarDetail trong AppContext.jsx (dòng 332-362)] -->

---

4. **Các thành phần trong chức năng Dịch thuật**

- Giao diện hiển thị trang Dịch thuật:

<!-- [BẠN CẦN VẼ: Screenshot giao diện trang Translation:
- Ô nhập văn bản nguồn
- Ô hiển thị bản dịch
- Nút dịch
- Lịch sử bản dịch bên dưới
] -->

- Phương thức dịch văn bản:

> Người dùng nhập văn bản cần dịch, chọn ngôn ngữ nguồn/đích, nhấn nút dịch. AppContext gọi `translateText()` -> API POST `/api/translations` -> lưu bản dịch vào CSDL -> reload danh sách bản dịch.

<!-- [BẠN CẦN VẼ: Screenshot code hàm translateText trong AppContext.jsx (dòng 142-159)] -->

---

5. **Các thành phần trong chức năng Xác thực (Authentication)**

- Giao diện Đăng nhập / Đăng ký (AccountPage):

<!-- [BẠN CẦN VẼ: Screenshot giao diện trang Account:
- Form đăng nhập (username, password, nút Đăng nhập)
- Form đăng ký (username, email, password, nút Đăng ký)
- Khi đã đăng nhập: hiển thị thông tin tài khoản + form đổi mật khẩu + nút Đăng xuất
] -->

- Luồng xác thực JWT:

> Hệ thống sử dụng JWT (JSON Web Token) cho xác thực. Khi đăng nhập thành công, backend trả về accessToken. Frontend lưu token vào localStorage/sessionStorage và gửi kèm header `Authorization: Bearer {token}` trong mỗi request.

<!-- [BẠN CẦN VẼ: Screenshot code hàm authenticate trong AppContext.jsx (dòng 94-116)] -->

- Security Filter Chain (Backend):

> Spring Security được cấu hình với JwtAuthenticationFilter để xác thực token trước mỗi request. Các endpoint công khai (search, grammar) không yêu cầu token, trong khi các endpoint cá nhân (notebook, srs, history) yêu cầu đăng nhập.

<!-- [BẠN CẦN VẼ: Screenshot code SecurityConfig.java - phần cấu hình filterChain] -->

---

6. **Tầng API (api.js)**

- Phương thức kết nối API:

> File `api.js` đóng vai trò là tầng trung gian giữa Frontend và Backend. Tất cả các hàm gọi API đều sử dụng `fetch()` với base URL `http://localhost:8080/api`, tự động đính kèm JWT token trong header Authorization khi có.

<!-- [BẠN CẦN VẼ: Screenshot code phần cấu hình base và các hàm helper trong api.js] -->

---

7. **Tích hợp AI Gia sư (AITutorWidget)**

- Giao diện widget AI:

<!-- [BẠN CẦN VẼ: Screenshot giao diện widget Gia sư AI:
- Nút floating ở góc màn hình
- Popup chat AI khi click
- Kết quả phân tích ngữ pháp từ Gemini API
] -->

> Widget Gia sư AI tích hợp Google Gemini 2.5 API để phân tích cấu trúc ngữ pháp câu tiếng Trung. Người dùng nhập câu, AI trả về phân tích chi tiết về cấu trúc, thành phần câu và ví dụ tương tự.
## **Chương 6: Pha kiểm thử**

1. **CSDL ban đầu:**

- Bảng words (trích 1 số bản ghi tiêu biểu từ hơn 120.000 từ):

<!-- [BẠN CẦN VẼ: Screenshot bảng words trong MySQL, hiển thị các cột: id, hanzi, pinyin, meaning, sino_vietnamese, hsk_level, stroke_count. Lấy khoảng 5-10 dòng mẫu] -->

- Bảng users:

<!-- [BẠN CẦN VẼ: Screenshot bảng users trong MySQL: id, username, password (đã hash), email, role] -->

- Bảng notebook:

<!-- [BẠN CẦN VẼ: Screenshot bảng notebook: id, title, created_at, user_id] -->

- Bảng srs_review_card:

<!-- [BẠN CẦN VẼ: Screenshot bảng srs_review_card: id, user_id, word_id, repetition, interval_days, next_review_at, last_reviewed_at] -->

- Bảng grammar_points:

<!-- [BẠN CẦN VẼ: Screenshot bảng grammar_points: id, title, structure, explanation, hsk_level] -->

- Bảng translations:

<!-- [BẠN CẦN VẼ: Screenshot bảng translations: id, source_text, translated_text, source_language, target_language, created_at, user_id] -->

---

- Bảng ai_usage_log (Mới):

<!-- [BẠN CẦN VẼ: Screenshot bảng ai_usage_log trong MySQL: id, user_id, feature (CHAT/TRANSLATE/CLASSIFY), called_at, token_count] -->

---

2. **Các test case kiểm thử**

- **Test case 1**: Module "Tra cứu từ vựng" — Tìm kiếm từ "你好" (xin chào)

<table>
<colgroup>
<col style="width: 46%" />
<col style="width: 53%" />
</colgroup>
<thead>
<tr class="header">
<th>Các bước thực hiện</th>
<th>Kết quả mong đợi</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><ol type="1">
<li><p>Người dùng truy cập trang Từ điển</p></li>
</ol></td>
<td><p>Giao diện Hero Search hiện ra với thanh tìm kiếm lớn bo tròn, Filter Chips HSK</p>
<!-- [BẠN CẦN VẼ: Screenshot trang Dictionary ban đầu] --></td>
</tr>
<tr class="even">
<td><ol start="2" type="1">
<li><p>Người dùng gõ "你好" vào thanh tìm kiếm</p></li>
</ol></td>
<td><p>Sau 400ms, dropdown gợi ý hiện ra với các từ chứa "你好"</p>
<!-- [BẠN CẦN VẼ: Screenshot dropdown auto-suggest] --></td>
</tr>
<tr class="odd">
<td><ol start="3" type="1">
<li><p>Người dùng nhấn Enter để tìm kiếm</p></li>
</ol></td>
<td><p>Danh sách kết quả hiện ra với các từ khớp, có phân trang</p>
<!-- [BẠN CẦN VẼ: Screenshot danh sách kết quả] --></td>
</tr>
<tr class="even">
<td><ol start="4" type="1">
<li><p>Người dùng click vào từ "你好" trong kết quả</p></li>
</ol></td>
<td><p>Panel chi tiết hiện ra: Hanzi 你好, Pinyin nǐ hǎo, Nghĩa "xin chào", HSK 1</p>
<!-- [BẠN CẦN VẼ: Screenshot chi tiết từ 你好] --></td>
</tr>
</tbody>
</table>

---

- **Test case 2**: Module "Thêm từ vào Sổ tay & Ôn tập SRS"

<table>
<colgroup>
<col style="width: 46%" />
<col style="width: 53%" />
</colgroup>
<thead>
<tr class="header">
<th>Các bước thực hiện</th>
<th>Kết quả mong đợi</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><ol type="1">
<li><p>Người dùng đăng nhập hệ thống và tra từ "学习"</p></li>
</ol></td>
<td><p>Đăng nhập thành công, chi tiết từ "学习" hiện ra</p>
<!-- [BẠN CẦN VẼ: Screenshot đã đăng nhập + chi tiết từ 学习] --></td>
</tr>
<tr class="even">
<td><ol start="2" type="1">
<li><p>Người dùng nhấn nút "Thêm vào sổ tay"</p></li>
</ol></td>
<td><p>Thông báo: Đã thêm "学习" vào sổ và bắt đầu lộ trình học (SRS)!</p>
<!-- [BẠN CẦN VẼ: Screenshot thông báo thêm thành công] --></td>
</tr>
<tr class="odd">
<td><ol start="3" type="1">
<li><p>Người dùng chuyển sang trang "Sổ tay & Ôn tập"</p></li>
</ol></td>
<td><p>Từ "学习" xuất hiện trong danh sách sổ tay và trong section SRS cần ôn</p>
<!-- [BẠN CẦN VẼ: Screenshot trang Notebook với từ 学习] --></td>
</tr>
<tr class="even">
<td><ol start="4" type="1">
<li><p>Người dùng nhấn "Tốt" để đánh giá thẻ SRS</p></li>
</ol></td>
<td><p>Thông báo: "学习: Tốt · ôn tiếp [ngày tiếp theo]". Thẻ biến mất khỏi danh sách cần ôn.</p>
<!-- [BẠN CẦN VẼ: Screenshot thông báo đánh giá SRS thành công] --></td>
</tr>
</tbody>
</table>

CSDL sau khi thêm từ và đánh giá SRS:

<!-- [BẠN CẦN VẼ: Screenshot bảng srs_review_card sau khi đánh giá, hiển thị:
- repetition = 1
- interval_days đã thay đổi (ví dụ = 3 nếu ban đầu = 1 và rating = 3)
- next_review_at đã cập nhật
- last_reviewed_at đã cập nhật
] -->

---

- **Test case 3**: Module "Đăng ký & Đăng nhập"

<table>
<colgroup>
<col style="width: 46%" />
<col style="width: 53%" />
</colgroup>
<thead>
<tr class="header">
<th>Các bước thực hiện</th>
<th>Kết quả mong đợi</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><ol type="1">
<li><p>Người dùng mở trang Tài khoản và chọn "Đăng ký"</p></li>
</ol></td>
<td><p>Form đăng ký hiện ra: username, email, password</p>
<!-- [BẠN CẦN VẼ: Screenshot form đăng ký] --></td>
</tr>
<tr class="even">
<td><ol start="2" type="1">
<li><p>Nhập username: "testuser", email: "test@email.com", password: "123456" rồi nhấn Đăng ký</p></li>
</ol></td>
<td><p>Thông báo: "Đăng ký thành công!" Tự động đăng nhập, topbar hiển thị avatar và tên "testuser"</p>
<!-- [BẠN CẦN VẼ: Screenshot đăng ký thành công + topbar hiển thị user] --></td>
</tr>
<tr class="odd">
<td><ol start="3" type="1">
<li><p>Người dùng đăng xuất rồi đăng nhập lại với username: "testuser", password: "123456"</p></li>
</ol></td>
<td><p>Thông báo: "Đăng nhập thành công!" Hệ thống load notebooks, SRS cards, lịch sử.</p>
<!-- [BẠN CẦN VẼ: Screenshot đăng nhập thành công] --></td>
</tr>
</tbody>
</table>

CSDL sau khi đăng ký:

<!-- [BẠN CẦN VẼ: Screenshot bảng users với bản ghi mới: id, username=testuser, password (bcrypt hash), email=test@email.com, role=USER] -->

---

- **Test case 4**: Module "Tìm kiếm bằng Giọng nói" *(Mới)*

<table>
<colgroup>
<col style="width: 46%" />
<col style="width: 53%" />
</colgroup>
<thead>
<tr class="header">
<th>Các bước thực hiện</th>
<th>Kết quả mong đợi</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><ol type="1">
<li><p>Người dùng truy cập trang Từ điển (dùng Chrome/Edge)</p></li>
</ol></td>
<td><p>Giao diện hiển thị nút 🎤 bên cạnh ô tìm kiếm</p>
<!-- [BẠN CẦN VẼ: Screenshot ô tìm kiếm với nút mic] --></td>
</tr>
<tr class="even">
<td><ol start="2" type="1">
<li><p>Người dùng nhấn nút 🎤</p></li>
</ol></td>
<td><p>Nút chuyển thành "🔴 Đang nghe...", trình duyệt yêu cầu quyền microphone</p></td>
</tr>
<tr class="odd">
<td><ol start="3" type="1">
<li><p>Người dùng nói "你好" vào microphone</p></li>
</ol></td>
<td><p>Web Speech API nhận diện, ô tìm kiếm tự điền "你好", hệ thống tự động tìm kiếm và hiển thị kết quả</p>
<!-- [BẠN CẦN VẼ: Screenshot ô search đã điền "你好" và có kết quả] --></td>
</tr>
<tr class="even">
<td><ol start="4" type="1">
<li><p>Người dùng dùng Safari hoặc Firefox không hỗ trợ</p></li>
</ol></td>
<td><p>Hệ thống hiển thị thông báo: "Trình duyệt không hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome hoặc Edge."</p></td>
</tr>
</tbody>
</table>

---

- **Test case 5**: Module "Quiz Mode - Kiểm tra từ vựng" *(Mới)*

<table>
<colgroup>
<col style="width: 46%" />
<col style="width: 53%" />
</colgroup>
<thead>
<tr class="header">
<th>Các bước thực hiện</th>
<th>Kết quả mong đợi</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><ol type="1">
<li><p>Người dùng đã đăng nhập, mở sổ tay có 10 từ, nhấn nút "Kiểm tra"</p></li>
</ol></td>
<td><p>Frontend gọi GET /api/srs/quiz/notebook/{id}?count=10, hệ thống trả về 10 câu hỏi</p>
<!-- [BẠN CẦN VẼ: Screenshot bắt đầu Quiz] --></td>
</tr>
<tr class="even">
<td><ol start="2" type="1">
<li><p>Câu hỏi 1: Hiển thị Hanzi "你好" với 4 lựa chọn: A.Xin chào B.Cảm ơn C.Tạm biệt D.Xin lỗi</p></li>
</ol></td>
<td><p>Giao diện rõ ràng, có thanh tiến trình Câu 1/10</p></td>
</tr>
<tr class="odd">
<td><ol start="3" type="1">
<li><p>Người dùng chọn đáp án đúng "A. Xin chào"</p></li>
</ol></td>
<td><p>Đáp án A chuyển màu xanh lá, sau 1.5 giây tự chuyển câu tiếp. Hệ thống gửi POST /api/srs/review với rating=3</p>
<!-- [BẠN CẦN VẼ: Screenshot đáp án đúng được highlight xanh] --></td>
</tr>
<tr class="even">
<td><ol start="4" type="1">
<li><p>Người dùng chọn sai một câu</p></li>
</ol></td>
<td><p>Đáp án sai chuyển màu đỏ, đáp án đúng highlight xanh. Hệ thống gửi POST /api/srs/review với rating=1 (Học lại)</p>
<!-- [BẠN CẦN VẼ: Screenshot đáp án sai highlight đỏ, đúng highlight xanh] --></td>
</tr>
<tr class="odd">
<td><ol start="5" type="1">
<li><p>Hoàn thành hết 10 câu</p></li>
</ol></td>
<td><p>Màn hình kết quả: "Đúng: 8/10 (80%)". SRS của các từ đã được cập nhật theo kết quả.</p>
<!-- [BẠN CẦN VẼ: Screenshot màn hình kết quả Quiz] --></td>
</tr>
</tbody>
</table>

---

- **Test case 6**: Module "Admin - Quản lý Người dùng" *(Mới)*

<table>
<colgroup>
<col style="width: 46%" />
<col style="width: 53%" />
</colgroup>
<thead>
<tr class="header">
<th>Các bước thực hiện</th>
<th>Kết quả mong đợi</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><ol type="1">
<li><p>Admin đăng nhập bằng tài khoản có role=ADMIN</p></li>
</ol></td>
<td><p>Sau đăng nhập, navigation hiển thị thêm mục "Admin". Truy cập /admin thành công.</p>
<!-- [BẠN CẦN VẼ: Screenshot trang Admin với navigation] --></td>
</tr>
<tr class="even">
<td><ol start="2" type="1">
<li><p>Admin vào tab "Quản lý User", nhấn nút "Khóa" của user có id=5</p></li>
</ol></td>
<td><p>Gọi PUT /api/users/5/block (với Bearer adminToken). Bảng users: trường is_blocked của user id=5 chuyển thành TRUE</p>
<!-- [BẠN CẦN VẼ: Screenshot bảng users trong DB với is_blocked=true] --></td>
</tr>
<tr class="odd">
<td><ol start="3" type="1">
<li><p>User id=5 cố đăng nhập sau khi bị khóa</p></li>
</ol></td>
<td><p>Backend trả về lỗi 401: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin."</p></td>
</tr>
<tr class="even">
<td><ol start="4" type="1">
<li><p>Admin xem tab "Thống kê AI"</p></li>
</ol></td>
<td><p>Biểu đồ cột hiển thị số lượt gọi AI theo ngày trong 7 ngày gần nhất, phân loại theo CHAT/TRANSLATE/CLASSIFY</p>
<!-- [BẠN CẦN VẼ: Screenshot biểu đồ thống kê AI] --></td>
</tr>
</tbody>
</table>

CSDL sau khi Admin khóa user:

<!-- [BẠN CẦN VẼ: Screenshot bảng users với cột is_blocked=1 cho user bị khóa] -->
