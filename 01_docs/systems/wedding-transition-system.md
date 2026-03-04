# <% tp.file.title %>

## 1. Overview

Wedding Transition System chịu trách nhiệm:

- Chuyển hệ thống từ RELATIONSHIP mode sang WEDDING mode
- Kích hoạt wedding features
- Nâng cấp guest role nếu cần
- Chuẩn bị cho archive sau wedding

Wedding không phải một hệ thống độc lập.  
Wedding là một trạng thái đặc biệt của toàn hệ thống.

---

## 2. Architecture

Wedding Transition phụ thuộc vào:

- Mode System
- Event System
- Auth System
- Visibility System
- Media System

Wedding được kích hoạt bằng cách:

- Tạo Event với eventType = "WEDDING"
- Chuyển Mode sang WEDDING

Không tạo database riêng cho wedding.

---

## 3. Role Interaction

Hiện tại role:

```ts
type Role =
  | "ADMIN"
  | "COUPLE"
  | "APPROVED_GUEST"
  | "PUBLIC_VISITOR"
```

Future extension:

```ts
"WEDDING_GUEST"
```

Wedding mode có thể:

- Cho phép APPROVED_GUEST truy cập nội dung wedding
- Hoặc upgrade role sang WEDDING_GUEST

---

## 4. Data Model

Wedding sử dụng Event:

```ts
Event {
  eventType: "WEDDING"
  date: Date
  visibility: Visibility
}
```

---

### RSVP Model (Future)

```ts
RSVP {
  id: string
  userId?: string
  name: string
  attending: boolean
  message?: string
  createdAt: Date
}
```

RSVP có thể cho phép guest chưa login (optional).

---

## 5. Core Flows

### 5.1 Wedding Activation Flow

1. ADMIN tạo Wedding Event
2. ADMIN chuyển mode sang WEDDING
3. Enable wedding features
4. Disable guest request form (optional)

---

### 5.2 RSVP Flow (Future)

1. Guest truy cập invitation page
2. Submit RSVP
3. Lưu record
4. ADMIN xem dashboard RSVP

---

### 5.3 Guest Upgrade Flow (Optional)

1. APPROVED_GUEST → WEDDING_GUEST
2. Enable wedding album access
3. Disable private relationship content

---

### 5.4 Post-Wedding Archive Flow

1. ADMIN chuyển mode sang ARCHIVE
2. Disable RSVP
3. Disable editing
4. Lock timeline modifications

---

## 6. Security Considerations

- Chỉ ADMIN được chuyển mode
- Wedding event phải được validate
- Không expose RSVP private data
- Không cho public truy cập private wedding content
- Validate guest role trước khi render wedding album

---

## 7. Limitations (v1)

- Không có automated email invitation
- Không có QR code generator
- Không có seating arrangement system
- Không có payment / gift registry integration
- Không có wedding schedule planner

---

## 8. Future Extensions

- Email invitation automation
- QR-based check-in
- Seating arrangement system
- Multi-stage wedding mode
- Gift registry integration
- Wedding live stream integration
- Auto-archive after wedding date