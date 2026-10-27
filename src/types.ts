export interface Product {
  id: number
  name: string
  description: string
  price: number
  createdAt: string
}

export interface ProductInput {
  name: string
  description: string
  price: number
}

export interface ProductSearch {
  name?: string
  minPrice?: number
  maxPrice?: number
  page: number
  pageSize: number
}

export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
}

export interface AuthResponse {
  accessToken: string
  expiresAtUtc: string
}

export interface Session extends AuthResponse {
  email: string
}

export interface ProblemDetails {
  title?: string
  detail?: string
  status?: number
  errors?: Record<string, string[]>
}
