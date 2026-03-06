const BASE_URL = process.env["NEXT_PUBLIC_BASE_URL"] ?? ""

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: { code: string; message: string }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export class ApiClientError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "ApiClientError"
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    credentials: "include",
  })

  const json = (await res.json()) as ApiResponse<T>

  if (!json.success) {
    throw new ApiClientError(json.error.code, json.error.message, res.status)
  }

  return json.data
}

export const apiClient = {
  get<T>(path: string) {
    return request<T>(path, { method: "GET" })
  },

  post<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "POST",
      body: body != null ? JSON.stringify(body) : undefined,
    })
  },

  put<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "PUT",
      body: body != null ? JSON.stringify(body) : undefined,
    })
  },

  delete<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "DELETE",
      body: body != null ? JSON.stringify(body) : undefined,
    })
  },
}
