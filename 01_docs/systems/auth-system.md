# <% tp.file.title %>

## 1. Overview

Auth System chịu trách nhiệm:

- Xác thực người dùng
- Quản lý session
- Phân quyền truy cập
- Quản lý guest approval
- Hỗ trợ mở rộng sang wedding mode

Hệ thống phải:

- Đảm bảo bảo mật lâu dài
- Hỗ trợ role-based access control
- Không phụ thuộc vào UI layer
- Cho phép mở rộng role trong tương lai

---

## 2. Architecture

Auth System bao gồm:

- Login API
- Refresh Token API
- Logout API
- Guest Request API
- Guest Approval API
- Auth Middleware
- Role Middleware

Luồng xác thực:

Client  
→ Login API  
→ Issue Access Token + Refresh Token  
→ Store Refresh Token (hashed)  
→ Middleware validate Access Token  
→ Inject user context vào request  

Access Token dùng cho request ngắn hạn.  
Refresh Token dùng để tái tạo Access Token.

---

## 3. Role Model

```ts
type Role =
  | "ADMIN"
  | "COUPLE"
  | "APPROVED_GUEST"
  | "PUBLIC_VISITOR"
```

### Quyền cơ bản

- ADMIN: toàn quyền hệ thống
- COUPLE: toàn quyền nội dung riêng tư
- APPROVED_GUEST: truy cập nội dung mở rộng
- PUBLIC_VISITOR: chỉ xem nội dung public

Future extensible:

```ts
"WEDDING_GUEST"
```

Role phải được kiểm tra tại middleware.

---

## 4. Data Model

### User

```ts
User {
  id: string
  email: string
  passwordHash: string
  role: Role
  createdAt: Date
}
```

---

### GuestRequest

```ts
GuestRequest {
  id: string
  name: string
  email: string
  relationship: string
  message: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: Date
  approvedAt?: Date
  approvedBy?: string
}
```

---

### RefreshToken

```ts
RefreshToken {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  createdAt: Date
}
```

Refresh token phải lưu dưới dạng hash.

---

## 5. Core Flows

### 5.1 Login Flow

1. User gửi email + password
2. So sánh password với bcrypt hash
3. Nếu hợp lệ:
   - Tạo Access Token (short-lived)
   - Tạo Refresh Token (long-lived)
   - Lưu Refresh Token (hashed)
4. Trả token qua httpOnly cookie

---

### 5.2 Refresh Flow

1. Client gửi Refresh Token
2. So sánh hash với DB
3. Nếu hợp lệ:
   - Tạo Access Token mới
4. Nếu không hợp lệ → revoke session

---

### 5.3 Logout Flow

1. Xóa Refresh Token khỏi DB
2. Clear cookies
3. Session invalidated

---

### 5.4 Guest Request Flow

1. Visitor submit form
2. Tạo GuestRequest với status = PENDING
3. ADMIN review
4. Nếu APPROVED:
   - Tạo User với role = APPROVED_GUEST

---

### 5.5 Role Authorization Flow

1. Middleware decode Access Token
2. Inject user vào request context
3. So sánh role với yêu cầu route
4. Nếu không đủ quyền → 403

---

## 6. Security Considerations

- Password phải hash bằng bcrypt (salt >= 10)
- Refresh token phải lưu hashed
- Access token short-lived (≈ 15–20 phút)
- Refresh token long-lived (≈ 30 ngày)
- httpOnly + secure cookies
- CSRF protection
- Rate limit login endpoint
- Rate limit guest request endpoint
- Không trả lỗi chi tiết khi login thất bại

---

## 7. Limitations (v1)

- Không có refresh token rotation
- Không có multi-device session management
- Không có OAuth
- Không có MFA
- Không có session dashboard
- Không có audit logging

---

## 8. Future Extensions

- Refresh token rotation
- Multi-device session tracking
- OAuth login (Google, etc.)
- Multi-factor authentication
- Wedding guest auto-upgrade
- Session activity monitoring
- Suspicious login detection
- Account recovery flow