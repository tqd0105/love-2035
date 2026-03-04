# <% tp.file.title %>

## 1. Overview

Media System chịu trách nhiệm quản lý:

- Upload hình ảnh
- Upload video
- Blur preview
- Lazy loading
- Visibility control
- Tối ưu hiển thị
- Chuẩn bị cho CDN trong tương lai

Media không được phụ thuộc trực tiếp vào UI layer.

---

## 2. Architecture

Media System bao gồm:

- Upload API
- Storage abstraction layer
- Media metadata management
- Visibility integration
- Blur rendering logic

Luồng xử lý:

Upload  
→ Validate file  
→ Store file  
→ Save metadata  
→ Return mediaId  

Khi render:

Load Media  
→ Check visibility  
→ Generate blur placeholder  
→ Lazy load file  

---

## 3. Media Model

```ts
type MediaType =
  | "IMAGE"
  | "VIDEO"
  | "AUDIO"
```

---

## 4. Data Model

```ts
Media {
  id: string
  url: string
  mediaType: MediaType
  visibility: Visibility
  blurDataUrl?: string
  width?: number
  height?: number
  createdAt: Date
  uploadedBy: string
}
```

---

### Storage Strategy (v1)

- Local storage (server filesystem)
- Structured folder path
- Unique filename (UUID)

Không lưu file theo tên gốc.

---

## 5. Core Flows

### 5.1 Upload Flow

1. User gửi file
2. Validate file type
3. Validate file size
4. Generate unique filename
5. Store file
6. Save metadata vào database

---

### 5.2 Visibility Flow

1. Load media
2. So sánh role với visibility
3. Nếu không đủ quyền → 403
4. Nếu PASSWORD_LOCKED → kiểm tra unlock state

---

### 5.3 Blur Placeholder Flow

1. Khi upload image:
   - Generate blurDataUrl (base64 small image)
2. Khi render:
   - Hiển thị blur trước
   - Sau đó lazy load ảnh gốc

---

### 5.4 Lazy Loading Flow

1. Render placeholder
2. Khi vào viewport → load media thật
3. Giảm tải initial page load

---

### 5.5 Wedding Album Flow (Future)

1. Mode = WEDDING
2. MediaType = IMAGE
3. Visibility có thể là APPROVED_GUEST
4. Render gallery grid

---

## 6. Security Considerations

- Validate MIME type
- Giới hạn file size
- Không cho upload file thực thi
- Không expose filesystem path
- Kiểm tra visibility trước khi trả file
- Sử dụng signed URL nếu cần (future)

---

## 7. Limitations (v1)

- Không có CDN
- Không có video streaming optimization
- Không có compression pipeline nâng cao
- Không có watermark
- Không có media versioning

---

## 8. Future Extensions

- S3 / Cloud storage integration
- Signed URL
- Automatic compression
- Image resizing service
- Video transcoding
- Watermark
- Media analytics
- Bulk upload