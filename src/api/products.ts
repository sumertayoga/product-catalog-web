import type { PagedResult, Product, ProductInput, ProductSearch } from '../types'
import { apiFetch } from './client'

export function searchProducts(search: ProductSearch) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    if (value !== undefined && value !== '') params.set(key, String(value))
  }
  return apiFetch<PagedResult<Product>>(`/products?${params}`)
}

export function createProduct(input: ProductInput) {
  return apiFetch<Product>('/products', { method: 'POST', body: JSON.stringify(input) })
}

export function updateProduct(id: number, input: ProductInput) {
  return apiFetch<void>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

export function deleteProduct(id: number) {
  return apiFetch<void>(`/products/${id}`, { method: 'DELETE' })
}
