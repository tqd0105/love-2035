# <% tp.file.title %>

## 1. Overview

Profile System chịu trách nhiệm quản lý thông tin cá nhân của hai người trong dự án:

- Thông tin cơ bản
- Likes / dislikes
- Things unknown
- Lessons learned
- Individual timeline highlights
- Personal quotes

Profile không phải là trang tĩnh.  
Nó là structured content.

---

## 2. Architecture

Profile System hoạt động cùng với:

- Auth System
- Visibility System
- Media System
- Timeline System

Luồng xử lý:

Request  
→ Auth Middleware  
→ Visibility Middleware  
→ Load Profile Data  
→ Render  

Profile không được hardcode content trong component.

---

## 3. Profile Model

```ts
type ProfileOwner =
  | "PERSON_A"
  | "PERSON_B"
```

---

## 4. Data Model

```ts
Profile {
  id: string
  owner: ProfileOwner
  displayName: string
  bio?: string
  avatarMediaId?: string
  visibility: Visibility
  createdAt: Date
  updatedAt: Date
}
```

---

### Profile Section

```ts
type ProfileSectionType =
  | "LIKES"
  | "DISLIKES"
  | "UNKNOWN_FACTS"
  | "LESSONS_LEARNED"
  | "FAVORITE_MEMORY"
  | "QUOTE"
```

```ts
ProfileSection {
  id: string
  profileId: string
  sectionType: ProfileSectionType
  content: string
  orderIndex: number
  visibility: Visibility
}
```

---

## 5. Core Flows

### 5.1 Profile Load Flow

1. Load Profile
2. Apply visibility filter
3. Load ProfileSection theo orderIndex
4. Render theo layout

---

### 5.2 Section Visibility Flow

1. Check role
2. So sánh role với section visibility
3. Nếu không đủ quyền → ẩn section

---

### 5.3 Profile Update Flow

1. ADMIN hoặc COUPLE chỉnh sửa
2. Validate input
3. Update database
4. Update updatedAt

---

### 5.4 Avatar Integration Flow

1. Avatar lưu dưới dạng mediaId
2. Media load qua Media System
3. Apply blur placeholder
4. Apply visibility check

---

## 6. Security Considerations

- Không cho PUBLIC_VISITOR chỉnh sửa
- Validate owner trước khi update
- Không expose private section
- Sanitize content để tránh XSS
- Không cho upload avatar không hợp lệ

---

## 7. Limitations (v1)

- Không có profile version history
- Không có comment system
- Không có reaction system
- Không có draft mode
- Không có per-section audit log

---

## 8. Future Extensions

- Profile comparison view
- Timeline highlight auto-sync
- Profile achievements
- Shared profile view
- Profile export
- Profile personalization themes