# MOCK GUI CHI TIẾT
## Ứng dụng ECargo Customer App là ứng dụng dành cho khách hàng (Forwarding Agents) của kho hàng sân bay, cho phép theo dõi và quản lý vận chuyển hàng hóa hàng không theo thời gian thực.

---

## 📱 TỔNG QUAN CẤU TRÚC APP

**Tên app:** ECargo  
**Nguyên tắc thiết kế:** Đơn giản, dễ sử dụng, tập trung vào phép theo dõi và quản lý hàng hóa hàng không theo thời gian thực.
**Nền tảng:** iOS, Android, Web

**Note** Tài liệu này có thể dùng trực tiếp cho **designer** để vẽ màn hình chi tiết (Figma/Sketch/XD) và cho **developer** hiểu rõ các state & component cần implement cho chức năng AWB Tracking.
---

## 🔐 PHẦN 1: MÀN HÌNH CHỨC NĂNG **AWB Tracking

Gồm 3 nhóm chính:
- Màn hình **Nhập & tra cứu AWB**
- Màn hình **Chi tiết lô hàng (Import/Export)**
- Các **trạng thái lỗi / empty / history**

---

### 1. Screen: AWB Search – Nhập & tra cứu AWB

**Mã screen:** `AWB_Search_Screen`  
**Mục tiêu:** Cho phép người dùng nhập **Prefix (3 số) + Serial (8 số)** và tra cứu lô hàng.

#### 1.1. Layout tổng thể (Mobile)

- **Header (App Bar / Top Bar)**
  - **Title:** `Theo dõi lô hàng`
  - **Left:** Icon Back (nếu đi từ menu con) hoặc không có nếu là màn chính.
  - **Right (optional):** Icon “Lịch sử” (đi tới màn Recent AWB).

- **Content (Body)**
  - **Section 1 – Mô tả ngắn:**
    - Text:  
      - `Nhập số AWB để tra cứu trạng thái lô hàng (nhập/xuất) theo thời gian thực.`
  - **Section 2 – Form nhập AWB:**
    - Dạng **2 ô input nằm trên cùng một hàng** (trên mobile có thể là 2 ô chiếm 1 dòng hoặc 2 dòng tuỳ width).
    - **Field 1: AWB Prefix**
      - Label: `Prefix`
      - Placeholder: `3 số đầu (VD: 123)`
      - Loại bàn phím: Numeric
      - Max length: 3
      - Validation: chỉ cho nhập số; auto-move sang field Serial khi đủ 3 ký tự (optional).
      - (Optional) Icon dropdown ở bên phải để chọn trong danh sách prefix hay dùng.
    - **Field 2: AWB Serial**
      - Label: `Serial`
      - Placeholder: `8 số còn lại (VD: 45678901)`
      - Loại bàn phím: Numeric
      - Max length: 8
      - Validation: chỉ cho nhập số.
  - **Section 3 – Nút hành động:**
    - **Primary Button:** `Tra cứu`
      - State:
        - **Disabled** khi:
          - Prefix < 3 ký tự **hoặc**
          - Serial < 8 ký tự.
        - **Enabled** khi:
          - Prefix = 3 ký tự số **và**
          - Serial = 8 ký tự số.
    - (Optional) Checkbox / Switch:
      - Label: `Lưu AWB này vào lịch sử tra cứu`
      - Mặc định: ON.
  - **Section 4 – Lịch sử AWB (nếu có – optional)**
    - Title: `Đã tra cứu gần đây`
    - Dạng list các item:
      - `123-45678901` – Thời gian tra cứu lần cuối.
      - Khi bấm vào 1 item:
        - Auto-fill vào form Prefix + Serial
        - Auto-trigger tra cứu **hoặc** yêu cầu bấm lại nút `Tra cứu` (quy ước rõ).

- **Footer**
  - Text nhỏ hướng dẫn:  
    - `Lưu ý: AWB phải thuộc quyền truy cập của bạn. Nếu không tìm thấy, vui lòng liên hệ kho để được hỗ trợ.`

#### 1.2. State chi tiết

- **Normal State**
  - Prefix & Serial rỗng.
  - Nút `Tra cứu` disable.
  - Không hiển thị lỗi.

- **Typing State**
  - Khi user đang nhập:
    - Nút `Tra cứu` bật khi điều kiện đủ.
    - Không hiển thị lỗi cho đến khi bấm nút hoặc blur field.

- **Loading State** (sau khi bấm `Tra cứu`)
  - Nút `Tra cứu` chuyển sang:
    - Loading spinner nhỏ bên trong, text `Đang tra cứu...`.
    - Disable, không cho bấm nhiều lần.
  - Có thể overlay spinner toàn màn hình (dim nhẹ) nếu API mất vài giây.

- **Error State – Sai định dạng**
  - Prefix không đủ 3 số:
    - Text lỗi dưới field Prefix: `Vui lòng nhập đủ 3 số Prefix.`
  - Serial không đủ 8 số:
    - Text lỗi dưới field Serial: `Vui lòng nhập đủ 8 số Serial.`
  - Tone màu lỗi: đỏ nhạt + icon cảnh báo nhỏ bên trái text.

- **Error State – Không tìm thấy AWB**
  - Hiển thị **banner lỗi** ở phía trên form hoặc dưới header:
    - Icon cảnh báo.
    - Text chính:  
      - `Không tìm thấy lô hàng với AWB 123-45678901.`
    - Text phụ:  
      - `Vui lòng kiểm tra lại số AWB hoặc liên hệ kho để được hỗ trợ.`
  - Button trong banner (optional):
    - `Liên hệ hỗ trợ` → deep-link sang màn Chat/Support Ticket.

---

### 2. Screen: Shipment Detail – Chi tiết lô hàng (Import/Export)

**Mã screen:** `Shipment_Detail_Screen`  
**Mục tiêu:** Hiển thị đầy đủ thông tin & trạng thái lô hàng sau khi tra cứu theo AWB.

#### 2.1. Layout tổng thể (Mobile)

- **Header**
  - Title: `Chi tiết lô hàng`
  - Left: Icon Back → quay lại `AWB_Search_Screen`.
  - Right (optional): Icon “⋮” (More) để mở menu:
    - `Đăng ký lấy/gửi hàng`
    - `Chat với kho`
    - `Chia sẻ thông tin AWB`

- **Content (scrollable)**

  **Block A – Thông tin tổng quan (Header Card)**
  - Card nền sáng, có border radius.
  - Thành phần:
    - Dòng 1:
      - Text lớn: `AWB 123-45678901`
    - Dòng 2:
      - Badge: `Hàng Nhập` (màu xanh dương nhạt) hoặc `Hàng Xuất` (màu cam).
    - Dòng 3:
      - Label nhỏ: `Trạng thái hiện tại:`
      - Text trạng thái chính (ví dụ: `Lưu kho`, `Khai thác xong`, `Thông quan xong`…).

  **Block B – Thông tin chuyến bay (Flight Info Section)**
  - Title: `Thông tin chuyến bay`
  - Các dòng thông tin:
    - `Chuyến bay:` VN123
    - `Giờ cất cánh dự kiến:` 10:30 20/03/2026
    - `Giờ hạ cánh dự kiến:` 14:15 20/03/2026
    - `Trạng thái chuyến bay:` Normal / Delay / Cancel (badge màu tương ứng).

  **Block C – Thông tin hàng hóa (Cargo Details Section)**
  - Title: `Thông tin hàng hóa`
  - Các dòng:
    - `Số kiện:` 10
    - `Trọng lượng:` 500 kg
    - `Loại hàng / mô tả:` (nếu có)

  **Block D – Timeline trạng thái (Import / Export Timeline)**
  - Title: `Trạng thái lô hàng`
  - Dạng **vertical timeline** hoặc **stepper**:
    - Mỗi bước gồm:
      - Icon tròn (fill khi đã hoàn thành, outline khi chưa).
      - Tên trạng thái (VD: `Hạ cánh`, `Khai thác xong`, `Lưu kho`, `Bất thường`, `Chi phí dự kiến` …).
      - Thời gian hoàn thành (nếu đã có): `Hoàn thành lúc 15:20 20/03/2026`.
      - Mô tả ngắn (optional).
    - Bước hiện tại:
      - Icon & text đậm màu hơn, có thể có nhãn `Hiện tại`.
  - **Luồng Hàng Nhập (Import):**
    - Thứ tự bước:
      1. `Hạ cánh`
      2. `Khai thác xong`
      3. `Lưu kho`
      4. `Bất thường` (chỉ hiển thị/nhấn mạnh nếu có)
      5. `Chi phí dự kiến`
  - **Luồng Hàng Xuất (Export):**
    - Thứ tự bước:
      1. `Lưu kho`
      2. `Cân đo xong`
      3. `Thông quan xong`
      4. `Chất xếp xong`
      5. `Lên máy bay`
      6. `Theo dõi tại sân bay đến`

  **Block E – Trạng thái hải quan (Customs Status Section)**
  - Title: `Trạng thái hải quan`
  - Nội dung:
    - Badge:
      - `Thông quan xong` – màu xanh, icon check.
      - `Chưa thông quan` – màu xám/vàng.
    - Nếu đã thông quan:
      - Text nhỏ: `Thời gian thông quan: 16:00 20/03/2026`.

  **Block F – Vị trí hàng trong kho (Warehouse Location Section)**
  - Title: `Vị trí hàng trong kho`
  - Nội dung:
    - `Kho:` Kho sân bay / Kho kéo dài
    - `Khu vực:` Zone A / B / C...
    - `Vị trí chi tiết:` Kệ 3, Hàng 2 (nếu có).
  - (Optional) Thêm **mini-map / sơ đồ kho** đơn giản.

  **Block G – Chi phí dự kiến (Estimated Costs Section)**
  - Title: `Chi phí dự kiến`
  - Nội dung:
    - `Tổng chi phí dự kiến:` 5,000,000 VND
    - (Optional) Nút `Xem chi tiết` → mở bottom sheet / màn con hiển thị breakdown nếu API có.

- **Footer actions**
  - Button 1 (Primary): `Đăng ký lấy hàng` (nếu Hàng Nhập) hoặc `Đăng ký gửi hàng` (nếu Hàng Xuất).
  - Button 2 (Secondary): `Chat với kho` / `Yêu cầu hỗ trợ`.

#### 2.2. State chi tiết

- **Normal State**
  - Tất cả block hiển thị bình thường, timeline có highlight bước hiện tại.

- **Partial Data State (chưa đủ bước)**
  - Các bước tương lai trong timeline:
    - Icon & text mờ/xám, không có timestamp.

- **Exception State (Bất thường)**
  - Trong timeline:
    - Bước `Bất thường` hiển thị:
      - Icon màu đỏ/cam.
      - Text mô tả ngắn (VD: “Hàng bị rách bao bì”, “Thiếu 1 kiện”…).
  - Có thể có banner cảnh báo trên cùng:
    - `Có bất thường liên quan đến lô hàng này. Vui lòng xem chi tiết hoặc liên hệ kho.`

---

### 3. Screen: Error / Empty / No Result States

Những state này dùng chung pattern trên `AWB_Search_Screen` và có thể reuse ở `Shipment_Detail_Screen` nếu API lỗi sau khi vào.

#### 3.1. AWB không tìm thấy (No Result)

- Vị trí: Trên `AWB_Search_Screen`.
- Thành phần:
  - Icon: dấu chấm than trong vòng tròn nền vàng.
  - Title (bold): `Không tìm thấy lô hàng`
  - Subtitle: `Không tìm thấy lô hàng với AWB 123-45678901. Vui lòng kiểm tra lại số AWB hoặc liên hệ kho để được hỗ trợ.`
  - Buttons:
    - Primary: `Thử lại`
    - Secondary: `Liên hệ hỗ trợ` (deep-link).

#### 3.2. Lỗi kết nối / lỗi hệ thống (System Error)

- Vị trí: Cả trên `AWB_Search_Screen` và `Shipment_Detail_Screen`.
- Thành phần:
  - Icon: cloud/broken connection.
  - Title: `Không thể kết nối tới hệ thống`
  - Subtitle: `Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.`
  - Button: `Thử lại`

#### 3.3. Empty History (Lịch sử trống)

- Vị trí: `Recent_AWB_History_Screen` hoặc phần lịch sử trong `AWB_Search_Screen`.
- Thành phần:
  - Icon: clock/history.
  - Text: `Chưa có AWB nào được tra cứu gần đây.`
  - Gợi ý: `Hãy nhập AWB ở phía trên để bắt đầu theo dõi.`

---

### 4. Screen (Optional): Recent AWB History – Lịch sử AWB đã tra cứu

**Mã screen:** `Recent_AWB_History_Screen`  
**Mục tiêu:** Giúp user nhanh chóng tra cứu lại các AWB hay dùng.

#### 4.1. Layout

- **Header**
  - Title: `Lịch sử AWB`
  - Left: Back.

- **Content**
  - List dạng vertical:
    - Mỗi item gồm:
      - Text chính: `123-45678901`
      - Text phụ: `Lần cuối tra cứu: 10:20 20/03/2026`
      - Badge nhỏ: `Hàng Nhập` / `Hàng Xuất` (nếu biết).
    - Khi tap vào:
      - Điều hướng trực tiếp tới `Shipment_Detail_Screen` (nếu hệ thống còn dữ liệu)  
      **hoặc**
      - Quay lại `AWB_Search_Screen` với Prefix + Serial auto-fill và auto-tra cứu.
  - (Optional) Nút `Xoá lịch sử` ở cuối.

---

### 5. Gợi ý style UI chung

- **Màu sắc:**
  - Màu chủ đạo: theo brand ECargo (VD: xanh dương).
  - Import/Export:
    - Import: badge xanh dương nhạt.
    - Export: badge cam/da cam để dễ phân biệt.
  - Trạng thái thành công: xanh lá.
  - Trạng thái cảnh báo/bất thường: cam/đỏ nhạt.

- **Typography:**
  - Title screen: font lớn, đậm.
  - Label field: nhỏ, ổn định, cùng màu xám đậm.
  - Giá trị dữ liệu: font trung bình, màu đậm hơn.

- **Icon & feedback:**
  - Sử dụng icon rõ nghĩa cho:
    - Trạng thái timeline.
    - Cảnh báo/lỗi.
    - Import/Export (optional).
  - Animation nhẹ cho:
    - Loading khi tra cứu.
    - Chuyển screen từ Search → Detail (slide-in).

---

### 6. Tóm tắt mapping Screen ↔ Mã ↔ Use Case

- **AWB_Search_Screen**
  - Use case: Nhập AWB, trigger tra cứu.
  - Đáp ứng: nhập Prefix + Serial, xử lý lỗi định dạng, không tìm thấy AWB.

- **Shipment_Detail_Screen**
  - Use case: Xem chi tiết & timeline trạng thái lô hàng Import/Export.
  - Đáp ứng: hiển thị Flight Info, Customs Status, Warehouse Location, Timeline.

- **Recent_AWB_History_Screen (optional)**
  - Use case: Tra cứu nhanh lại AWB đã xem.

- **Error/Empty States**
  - Use case: Xử lý trường hợp không có dữ liệu, lỗi mạng, chưa có lịch sử.




