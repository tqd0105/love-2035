# <% tp.file.title %>

## 1. Overview

Event System chịu trách nhiệm quản lý tất cả các sự kiện có yếu tố thời gian trong hệ thống.

Bao gồm:

- Anniversary
- Special dates
- Milestones
- Wedding
- Countdown events
- Recurring events

Wedding không phải system riêng.  
Wedding là một Event đặc biệt.

---

## 2. Architecture

Event System độc lập với:

- Timeline System
- Wedding Mode
- Countdown UI

Event chỉ cung cấp dữ liệu thời gian.

UI layer sẽ quyết định hiển thị như thế nào.

Luồng sử dụng:

Request  
→ Load Events  
→ Compute time delta  
→ Render countdown / timeline  

Event logic không được đặt trong component.

---

## 3. Event Model

```ts
type EventType =
  | "ANNIVERSARY"
  | "MILESTONE"
  | "WEDDING"
  | "CUSTOM"
```

---

## 4. Data Model

```ts
Event {
  id: string
  title: string
  description?: string
  eventType: EventType
  date: Date
  isRecurring: boolean
  recurrenceRule?: string
  visibility: Visibility
  createdAt: Date
  updatedAt: Date
}
```

---

### Recurrence Rule (Optional)

```ts
recurrenceRule?: "YEARLY" | "MONTHLY" | "WEEKLY"
```

Recurring events dùng cho:

- Anniversary
- Monthly milestones

Wedding thường không recurring.

---

## 5. Core Flows

### 5.1 Countdown Flow

1. Load event
2. Tính chênh lệch giữa current time và event.date
3. Nếu recurring:
   - Tính lần kế tiếp
4. Trả về:
   - Days
   - Hours
   - Minutes
   - Seconds

---

### 5.2 Wedding Event Flow

1. Tạo event với eventType = "WEDDING"
2. Khi mode = WEDDING:
   - Activate wedding pages
   - Enable RSVP
3. Khi mode ≠ WEDDING:
   - Event vẫn tồn tại nhưng UI có thể ẩn

---

### 5.3 Anniversary Flow

1. Event có isRecurring = true
2. recurrenceRule = YEARLY
3. Hệ thống tự tính ngày tiếp theo

---

### 5.4 Event Visibility Flow

Event phải đi qua Visibility Middleware.

Visibility có thể là:

- PUBLIC
- APPROVED_GUEST
- COUPLE

Wedding event thường PUBLIC hoặc APPROVED_GUEST.

---

## 6. Security Considerations

- Không cho client tự tính countdown logic quan trọng
- Validate recurrenceRule
- Không expose private event nếu không đủ quyền
- Mode switch không tự tạo hoặc xóa event

---

## 7. Limitations (v1)

- Không hỗ trợ complex recurrence rule (RRULE chuẩn)
- Không có timezone per-user
- Không có notification engine
- Không có background scheduler

---

## 8. Future Extensions

- Full RRULE support
- Email reminder automation
- Push notification
- Google Calendar export
- Event reminder scheduling
- Multi-stage wedding event (PRE, MAIN, AFTER)