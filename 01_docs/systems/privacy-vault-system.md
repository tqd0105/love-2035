# <% tp.file.title %>

## 1. Overview

Privacy Vault System chịu trách nhiệm quản lý nội dung riêng tư mức cao nhất của hệ thống.

Khác với Visibility thông thường, Privacy Vault:

- Không hiển thị trong timeline
- Không index trong search
- Không xuất hiện trong navigation public
- Có thể yêu cầu unlock riêng
- Có thể được mã hóa ở tầng dữ liệu

Privacy Vault dành cho nội dung chỉ COUPLE được phép truy cập.

---

## 2. Architecture

Privacy Vault hoạt động cùng:

- Auth System
- Visibility System
- Letter System
- Media System
- Mode System

Luồng xử lý:

Request  
→ Auth Middleware  
→ Role Check (COUPLE only)  
→ Vault Unlock Check  
→ Decrypt Content (optional)  
→ Render  

Vault content không được hiển thị qua API chung.

---

## 3. Vault Model

```ts
type VaultContentType =
  | "SECRET_LETTER"
  | "PRIVATE_MEMORY"
  | "TIME_CAPSULE"
  | "PRIVATE_MEDIA"
```

---

## 4. Data Model

```ts
VaultItem {
  id: string
  title: string
  contentEncrypted: string
  vaultType: VaultContentType
  unlockAt?: Date
  requiresPassword: boolean
  passwordHash?: string
  createdAt: Date
  updatedAt: Date
}
```

---

### Encryption Strategy (v1 Optional)

- contentEncrypted có thể:
  - Base64 encoded (basic)
  - AES encrypted (future)
- Key không được lưu trong client

---

## 5. Core Flows

### 5.1 Vault Access Flow

1. Xác thực user
2. Kiểm tra role = COUPLE
3. Nếu requiresPassword:
   - Validate password
4. Nếu unlockAt tồn tại:
   - So sánh current time
5. Nếu hợp lệ:
   - Decrypt content
   - Render

---

### 5.2 Time Capsule Flow

1. vaultType = "TIME_CAPSULE"
2. unlockAt bắt buộc
3. Trước unlockAt → locked state
4. Sau unlockAt → auto-unlock

---

### 5.3 Private Media Flow

1. VaultItem liên kết mediaId
2. Media phải có visibility = COUPLE
3. Không cho PUBLIC truy cập direct URL

---

### 5.4 Vault Isolation Flow

Vault content:

- Không hiển thị trong timeline
- Không xuất hiện trong search
- Không trả về trong API chung

Chỉ có API riêng cho Vault.

---

## 6. Security Considerations

- Chỉ COUPLE được truy cập
- Password phải hash bằng bcrypt
- Không expose encrypted content nếu chưa unlock
- Không cho client bypass unlockAt
- Không tin client-side logic
- Có thể thêm double-confirmation unlock (future)

---

## 7. Limitations (v1)

- Không có key rotation
- Không có encryption key management system
- Không có vault audit log
- Không có failed unlock tracking
- Không có auto-delete feature

---

## 8. Future Extensions

- AES encryption với server-side key
- Vault audit log
- Unlock attempt tracking
- Auto-expire vault content
- Multi-layer unlock
- Biometric unlock (future concept)
- Vault export encrypted file