# <% tp.file.title %>

## 1. Overview

Visibility System chịu trách nhiệm kiểm soát quyền truy cập nội dung dựa trên:

- Role của người dùng
- Visibility level của content
- Mode hiện tại của hệ thống

Mọi content trong hệ thống phải có visibility rõ ràng.

Không được kiểm tra quyền rải rác trong UI component.

---

## 2. Architecture

Visibility được xử lý tại middleware layer.

Luồng xử lý:

Request  
→ Auth Middleware (inject user)  
→ Mode Middleware (inject mode)  
→ Visibility Middleware (authorize content)  
→ Route Handler  

Visibility Middleware phải:

- So sánh role với visibility
- Xử lý password unlock
- Trả về 403 nếu không đủ quyền

Không xử lý visibility trong component.

---

## 3. Role Model Interaction

Role được xác định từ Auth System:

```ts
type Role =
  | "ADMIN"
  | "COUPLE"
  | "APPROVED_GUEST"
  | "PUBLIC_VISITOR"
```

ADMIN có quyền override mọi visibility.

COUPLE có quyền override PUBLIC và APPROVED_GUEST.

PUBLIC_VISITOR không được truy cập nội dung PRIVATE.

---

## 4. Data Model

### Visibility Enum

```ts
type Visibility =
  | "PUBLIC"
  | "APPROVED_GUEST"
  | "COUPLE"
  | "PASSWORD_LOCKED"
```

---

### Content Base Structure

Mọi content phải có:

```ts
BaseContent {
  id: string
  type: ContentType
  visibility: Visibility
  createdAt: Date
  updatedAt: Date
}
```

---

### Password Locked Extension

```ts
PasswordProtectedContent {
  passwordHash: string
  unlockDurationMinutes?: number
}
```

---

## 5. Core Flows

### 5.1 Basic Visibility Flow

1. Xác định role user
2. Đọc visibility của content
3. So sánh theo rule matrix
4. Nếu không đủ quyền → trả về 403

---

### 5.2 Role vs Visibility Matrix

| Role            | PUBLIC | APPROVED_GUEST | COUPLE | PASSWORD_LOCKED |
|-----------------|--------|----------------|--------|------------------|
| ADMIN           | ✓      | ✓              | ✓      | ✓ (override)     |
| COUPLE          | ✓      | ✓              | ✓      | ✓ (unlock)       |
| APPROVED_GUEST  | ✓      | ✓              | ✗      | ✗                |
| PUBLIC_VISITOR  | ✓      | ✗              | ✗      | ✗                |

---

### 5.3 Password Unlock Flow

1. User gửi password
2. So sánh với passwordHash
3. Nếu đúng:
   - Tạo unlock token tạm thời
   - Lưu trong session/cookie
4. Trong thời gian hiệu lực, cho phép truy cập

---

### 5.4 Mode Interaction Flow

Trong WEDDING mode:

- Có thể override visibility cho một số content
- Một số content có thể bị ẩn tạm thời

Visibility không phụ thuộc hoàn toàn vào mode, nhưng mode có thể ảnh hưởng đến render.

---

## 6. Security Considerations

- Password phải được hash
- Không lưu password plaintext
- Unlock token phải có expiration
- Không expose visibility logic ra client
- Không tin vào client-side check
- Luôn validate tại server

---

## 7. Limitations (v1)

- Không có granular permission (chỉ role-level)
- Không có content-specific ACL
- Không có per-user unlock history
- Không có audit log cho unlock

---

## 8. Future Extensions

- Per-content access control list (ACL)
- Per-user visibility override
- Expiring visibility windows
- Scheduled visibility (auto publish)
- Temporary wedding override rules
- Unlock analytics tracking