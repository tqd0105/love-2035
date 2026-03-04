# <% tp.file.title %>

## 1. Overview

Letter System chịu trách nhiệm quản lý:

- Thư gửi nhau theo thời gian
- Thư gửi tương lai (time-lock)
- Thư có mật khẩu riêng
- Mood tagging
- Music override khi đọc thư
- Read / unread tracking

Letter không phải chỉ là bài viết tĩnh.

---

## 2. Architecture

Letter System hoạt động cùng với:

- Auth System (role)
- Visibility System
- Mode System
- Media System
- Music Controller

Luồng xử lý:

Request  
→ Auth Middleware  
→ Visibility Middleware  
→ Letter Load  
→ Time-lock check  
→ Password check (nếu có)  
→ Render  

Letter logic không được xử lý hoàn toàn ở client.

---

## 3. Letter Model

```ts
type LetterType =
  | "REGULAR"
  | "TIME_LOCKED"
  | "PASSWORD_LOCKED"
  | "FUTURE_MESSAGE"
```

---

## 4. Data Model

```ts
Letter {
  id: string
  title: string
  content: string
  letterType: LetterType
  visibility: Visibility
  unlockAt?: Date
  passwordHash?: string
  moodTags?: string[]
  musicUrl?: string
  isReadTrackingEnabled: boolean
  createdAt: Date
  updatedAt: Date
}
```

---

### Read Tracking

```ts
LetterRead {
  id: string
  letterId: string
  userId: string
  readAt: Date
}
```

Chỉ tạo record nếu `isReadTrackingEnabled = true`.

---

## 5. Core Flows

### 5.1 Regular Letter Flow

1. Load letter
2. Check visibility
3. Render content

---

### 5.2 Time-Locked Letter Flow

1. Load letter
2. Check visibility
3. Compare current time với unlockAt
4. Nếu current < unlockAt → trả về locked state
5. Nếu đủ thời gian → render

---

### 5.3 Password-Locked Letter Flow

1. User gửi password
2. Compare với passwordHash
3. Nếu đúng:
   - Tạo unlock token tạm thời
4. Cho phép render trong thời gian giới hạn

---

### 5.4 Future Message Flow

1. LetterType = FUTURE_MESSAGE
2. unlockAt bắt buộc
3. Sau unlockAt:
   - Tự động hiển thị
   - Có thể gửi notification (future extension)

---

### 5.5 Music Override Flow

1. Nếu letter có musicUrl:
   - Override background music
2. Khi rời khỏi letter:
   - Restore music trước đó

---

### 5.6 Read Tracking Flow

1. Nếu isReadTrackingEnabled:
   - Khi render thành công
   - Tạo LetterRead record
2. Có thể hiển thị read status cho ADMIN/COUPLE

---

## 6. Security Considerations

- passwordHash phải được hash (bcrypt)
- Không gửi unlockAt logic hoàn toàn cho client
- Không expose passwordHash
- Unlock token phải có expiration
- Không cho client bypass time-lock
- Validate role trước khi render

---

## 7. Limitations (v1)

- Không có rich text editor
- Không có version history
- Không có letter draft mode
- Không có scheduled publishing ngoài unlockAt
- Không có reaction system

---

## 8. Future Extensions

- Rich text editor
- Letter version history
- Scheduled publish
- Letter reactions
- Letter analytics
- Export letter PDF
- Voice note letter
- AI-generated recap