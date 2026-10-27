import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import ErrorAlert from '../components/ErrorAlert'

export default function LoginPage() {
  const { session, login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<unknown>()

  if (session) return <Navigate to="/" replace />

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(undefined)
    try {
      await (isRegister ? register(email, password) : login(email, password))
    } catch (err) {
      setError(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <form className="col-md-6 col-lg-4 card card-body" onSubmit={handleSubmit}>
        <h1 className="h4 mb-3">{isRegister ? 'Register' : 'Log in'}</h1>
        <ErrorAlert error={error} />
        <input className="form-control mb-2" type="email" placeholder="Email" required maxLength={256}
          autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="form-control mb-3" type="password" placeholder="Password" required maxLength={100}
          minLength={isRegister ? 8 : undefined} autoComplete={isRegister ? 'new-password' : 'current-password'}
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? 'Please wait...' : isRegister ? 'Register' : 'Log in'}
        </button>
        <button type="button" className="btn btn-link mt-2" onClick={() => { setIsRegister(!isRegister); setError(undefined) }}>
          {isRegister ? 'I already have an account' : 'Create an account'}
        </button>
      </form>
    </div>
  )
}
