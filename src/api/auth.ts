import type { AuthResponse } from '../types'
import { apiFetch } from './client'

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}

export function register(email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) })
}
