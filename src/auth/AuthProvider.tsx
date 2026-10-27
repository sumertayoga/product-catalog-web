import { useEffect, useState, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import { setUnauthorizedHandler } from '../api/client'
import type { AuthResponse, Session } from '../types'
import { clearSession, loadSession, saveSession } from './session'
import { AuthContext } from './useAuth'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadSession)

  function start(email: string, response: AuthResponse) {
    const next = { ...response, email: email.trim().toLowerCase() }
    saveSession(next)
    setSession(next)
  }

  function logout() {
    clearSession()
    setSession(null)
  }

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession()
      setSession(null)
    })
  }, [])

  const value = {
    session,
    login: async (email: string, password: string) => start(email, await authApi.login(email, password)),
    register: async (email: string, password: string) => start(email, await authApi.register(email, password)),
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
