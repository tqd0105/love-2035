# <% tp.file.title %>

## 1. Overview

Timeline System chịu trách nhiệm hiển thị các mốc ký ức theo thời gian.

Yêu cầu:

- Hỗ trợ hai trục (left/right alternating layout)
- Hỗ trợ milestone đặc biệt
- Hỗ trợ filter
- Hỗ trợ visibility control
- Tích hợp với Event System

Timeline không được phụ thuộc vào UI animation.

---

## 2. Architecture

Timeline System sử dụng dữ liệu từ:

- TimelineEvent
- Event
- Media
- Visibility System

Luồng xử lý:

Request  
→ Load Timeline Events  
→ Apply Visibility Filter  
→ Sort theo thời gian  
→ Render alternating layout  

Timeline chỉ hiển thị dữ liệu, không xử lý quyền truy cập.

---

## 3. Timeline Model

```ts
type TimelineType =
  | "MEMORY"
  | "MILESTONE"
  | "ANNIVERSARY"
  | "WEDDING"
```

---

## 4. Data Model

```ts
TimelineEvent {
  id: string
  title: string
  description?: string
  timelineType: TimelineType
  eventId?: string
  mediaIds?: string[]
  visibility: Visibility
  date: Date
  isHighlighted: boolean
  createdAt: Date
  updatedAt: Date
}
```

---

### Two-Axis Rendering Rule

- Index chẵn → left
- Index lẻ → right

Hoặc có thể tính theo thứ tự ngày.

Không lưu vị trí left/right trong database.

---

## 5. Core Flows

### 5.1 Timeline Load Flow

1. Load tất cả TimelineEvent
2. Apply visibility filter
3. Sort theo date ascending
4. Map index → layout side
5. Render

---

### 5.2 Milestone Flow

Nếu `isHighlighted = true`:

- Render lớn hơn
- Có thể full-width
- Có animation đặc biệt

---

### 5.3 Wedding Timeline Flow

Khi mode = WEDDING:

- TimelineType = "WEDDING" được ưu tiên hiển thị
- Có thể filter riêng

---

### 5.4 Media Integration Flow

1. Load mediaIds
2. Apply visibility check
3. Render blur placeholder nếu cần
4. Lazy load ảnh

---

## 6. Security Considerations

- Không trả TimelineEvent nếu visibility không hợp lệ
- Không tin client để filter visibility
- Không expose private media
- Validate eventId liên kết

---

## 7. Limitations (v1)

- Không hỗ trợ infinite scroll
- Không hỗ trợ pagination
- Không có timeline zoom level
- Không có grouping theo năm
- Không có caching layer

---

## 8. Future Extensions

- Group by year
- Filter theo mood tag
- Timeline search
- Infinite scroll
- Timeline heatmap
- Export timeline PDF
- Timeline snapshot archive