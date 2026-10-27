import { loadSession } from '../auth/session'
import type { ProblemDetails } from '../types'

export class ApiError extends Error {
  readonly status: number
  readonly problem?: ProblemDetails

  constructor(status: number, problem?: ProblemDetails) {
    super(problem?.detail ?? problem?.title ?? defaultMessage(status))
    this.status = status
    this.problem = problem
  }
}

function defaultMessage(status: number) {
  if (status === 401) return 'Your session has expired. Please log in again.'
  return `Request failed with status ${status}.`
}

let onUnauthorized: () => void = () => {}

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body) headers.set('Content-Type', 'application/json')

  const token = loadSession()?.accessToken
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`/api${path}`, { ...init, headers })
  } catch {
    throw new ApiError(0, { detail: 'Cannot reach the server.' })
  }

  if (!response.ok) {
    // A rejected token means the session is no longer valid.
    if (response.status === 401 && token) onUnauthorized()
    const problem = await response.json().catch(() => undefined) as ProblemDetails | undefined
    throw new ApiError(response.status, problem)
  }

  if (response.status === 204) return undefined as T
  return await response.json() as T
}
