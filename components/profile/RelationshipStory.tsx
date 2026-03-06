"use client"

import { motion } from "framer-motion"

export function RelationshipStory() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12"
    >
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-white/40 bg-gradient-to-br from-rose-50/80 via-white/90 to-pink-50/80 p-8 shadow-lg backdrop-blur-sm sm:p-10">
          <h2 className="mb-6 text-center font-serif text-2xl font-semibold sm:text-3xl">
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Câu chuyện của đôi mình
            </span>
          </h2>

          <div className="space-y-4 text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Có những cuộc gặp gỡ tưởng chừng như tình cờ, nhưng lại là khởi đầu
              cho một hành trình dài đầy yêu thương.
            </p>
            <p>
              Từ tin nhắn đầu tiên đến buổi hẹn hò đầu tiên, từ những chuyến đi
              cùng nhau đến giấc mơ về tương lai — mỗi khoảnh khắc bên nhau đều
              là một trang truyện đáng nhớ.
            </p>
            <p>
              Dự án 2035 là nơi lưu giữ tất cả — mỗi bức ảnh, mỗi lá thư, mỗi
              cột mốc. Tình yêu không chỉ được cảm nhận, mà còn được kể lại.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
