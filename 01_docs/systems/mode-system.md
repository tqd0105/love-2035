# <% tp.file.title %>

## 1. Overview

Mode System kiểm soát trạng thái vận hành toàn cục của hệ thống.

Mode quyết định:

- Tính năng nào được kích hoạt
- Trang nào được hiển thị
- Nội dung nào bị ẩn
- Hành vi nào bị khóa

Mode không thay thế Visibility.  
Mode chỉ điều chỉnh hành vi tổng thể của hệ thống.

---

## 2. Architecture

Mode được lưu trong bảng `SystemConfig`.

Luồng xử lý:

Request  
→ Auth Middleware  
→ Load SystemConfig  
→ Inject mode vào request context  
→ Route Handler  

Mode không được hardcode trong component.

Không dùng environment variable cho mode chính.

---

## 3. Mode Model

```ts
type Mode =
  | "RELATIONSHIP"
  | "WEDDING"
  | "ARCHIVE"
```

---

### RELATIONSHIP

- Timeline active
- Letters active
- Countdown active
- Private memories active
- Wedding features disabled

---

### WEDDING

- Invitation page active
- RSVP active
- Guest upgrade enabled
- Wedding album enabled
- Một số nội dung relationship có thể bị ẩn

---

### ARCHIVE

- Editing disabled
- Read-only mode
- Anniversary reminders active
- Wedding RSVP disabled
- Guest request disabled

---

## 4. Data Model

### SystemConfig

```ts
SystemConfig {
  id: string
  mode: Mode
  weddingEnabled: boolean
  archiveEnabled: boolean
  updatedAt: Date
}
```

Chỉ nên có 1 record duy nhất.

---

## 5. Core Flows

### 5.1 Mode Resolution Flow

1. Load SystemConfig từ database
2. Cache trong memory (optional)
3. Inject vào request context
4. UI render dựa trên mode

---

### 5.2 Mode Switch Flow (Admin Only)

1. ADMIN gửi request chuyển mode
2. Validate role
3. Update SystemConfig
4. Invalidate cache
5. Hệ thống hoạt động theo mode mới

---

### 5.3 Wedding Activation Flow

1. Chuyển mode sang WEDDING
2. Enable wedding features
3. Enable RSVP endpoints
4. Ẩn nội dung không phù hợp

---

### 5.4 Archive Activation Flow

1. Chuyển mode sang ARCHIVE
2. Disable editing endpoints
3. Disable guest request
4. Lock timeline modifications

---

## 6. Security Considerations

- Chỉ ADMIN được chuyển mode
- Mode switch phải được log
- Không cho client tự quyết định mode
- Không expose config nội bộ ra public API

---

## 7. Limitations (v1)

- Không có scheduled mode switch
- Không có mode preview
- Không có per-user mode override
- Không có multi-mode coexistence

---

## 8. Future Extensions

- Scheduled mode activation (ví dụ tự chuyển sang WEDDING ngày X)
- Preview mode cho ADMIN
- Multi-stage wedding mode (PRE_WEDDING, WEDDING_DAY, POST_WEDDING)
- Automatic archive after wedding
- Mode history log