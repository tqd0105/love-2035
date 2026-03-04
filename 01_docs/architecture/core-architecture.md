# <% tp.file.title %>

## 1. Overview

Project 2035 là một long-term relationship platform với các mục tiêu:

- Lưu trữ ký ức theo thời gian
- Kiểm soát nội dung theo nhiều mức độ riêng tư
- Hỗ trợ timeline hai trục
- Chuyển đổi sang wedding mode trong tương lai
- Chuyển sang archive mode sau wedding

Yêu cầu kiến trúc:

- Không refactor lớn khi chuyển mode
- Không phụ thuộc vào cấu trúc UI
- Có khả năng mở rộng trong nhiều năm
- Phân tách rõ ràng giữa các system

---

## 2. Architecture

Hệ thống được chia thành các module độc lập:

- Auth System
- Mode System
- Visibility System
- Timeline System
- Letter System
- Media System
- Event System
- Profile System

Luồng xử lý request:

Request  
→ Auth Middleware  
→ Mode Middleware  
→ Visibility Middleware  
→ Route Handler  

Mode và Visibility phải được xử lý ở middleware layer, không được xử lý rải rác trong component.

---

## 3. Role Model

```ts
type Role =
  | "ADMIN"
  | "COUPLE"
  | "APPROVED_GUEST"
  | "PUBLIC_VISITOR"
```

Quyền cơ bản:

- ADMIN: toàn quyền hệ thống
- COUPLE: toàn quyền nội dung riêng tư
- APPROVED_GUEST: xem nội dung mở rộng
- PUBLIC_VISITOR: chỉ xem nội dung public

Role phải được kiểm soát tập trung tại middleware.

---

## 4. Data Model

### Mode

```ts
type Mode =
  | "RELATIONSHIP"
  | "WEDDING"
  | "ARCHIVE"
```

Mode được lưu trong bảng `SystemConfig`.

---

### Visibility

```ts
type Visibility =
  | "PUBLIC"
  | "APPROVED_GUEST"
  | "COUPLE"
  | "PASSWORD_LOCKED"
```

Mọi content phải có visibility.

---

### ContentType

```ts
type ContentType =
  | "TIMELINE"
  | "LETTER"
  | "PROFILE"
  | "EVENT"
  | "MEMORY"
  | "MEDIA"
```

Wedding được biểu diễn như một Event:

```ts
eventType: "WEDDING"
```

Không tạo table riêng cho wedding.

---

## 5. Core Flows

### 5.1 Mode Resolution Flow

1. Load SystemConfig
2. Inject mode vào request context
3. Render UI dựa trên mode

---

### 5.2 Visibility Flow

1. Xác định role user
2. So sánh role với visibility
3. Nếu PASSWORD_LOCKED → yêu cầu unlock
4. Nếu không đủ quyền → trả về 403

---

### 5.3 Guest Upgrade Flow (Future)

1. APPROVED_GUEST được chuyển thành WEDDING_GUEST
2. Gán quyền RSVP
3. Kích hoạt wedding features

---

### 5.4 Wedding Activation Flow (Future)

1. Chuyển mode sang WEDDING
2. Enable RSVP
3. Enable invitation pages
4. Ẩn nội dung không phù hợp

---

## 6. Security Considerations

- Refresh token phải được lưu dưới dạng hashed
- Password-protected content phải được mã hóa
- Guest approval bắt buộc
- Rate limiting cho login và guest request
- CSRF protection
- Secure + httpOnly cookies trong production
- Không expose internal config ra client

---

## 7. Limitations (v1)

- Không có refresh token rotation
- Không có multi-device session management
- Không có multilingual support
- Không có CDN cho media
- Không có automated email system
- Không có audit logging

---

## 8. Future Extensions

- Wedding mode đầy đủ (RSVP, guest list, QR, map)
- Guestbook system
- Multilingual support
- Media CDN integration
- Archive automation (anniversary reminders)
- Role expansion (WEDDING_GUEST, STAFF)
- Notification system
- Backup & export system