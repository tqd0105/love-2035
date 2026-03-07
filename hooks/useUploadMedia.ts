"use client"

import { useState, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"

interface UploadState {
  isUploading: boolean
  progress: number
  error: string | null
}

export function useUploadMedia() {
  const queryClient = useQueryClient()
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  })

  const upload = useCallback(
    (file: File, visibility = "COUPLE") => {
      setState({ isUploading: true, progress: 0, error: null })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("visibility", visibility)

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100)
          setState((prev) => ({ ...prev, progress: pct }))
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setState({ isUploading: false, progress: 100, error: null })
          queryClient.invalidateQueries({ queryKey: ["media"] })
        } else {
          let message = "Upload thất bại"
          try {
            const body = JSON.parse(xhr.responseText)
            if (body?.error?.message) message = body.error.message
          } catch {
            // ignore parse errors
          }
          setState({ isUploading: false, progress: 0, error: message })
        }
      })

      xhr.addEventListener("error", () => {
        setState({ isUploading: false, progress: 0, error: "Lỗi kết nối" })
      })

      xhr.open("POST", "/api/media/upload")
      xhr.withCredentials = true
      xhr.send(formData)
    },
    [queryClient],
  )

  const reset = useCallback(() => {
    setState({ isUploading: false, progress: 0, error: null })
  }, [])

  return { ...state, upload, reset }
}
