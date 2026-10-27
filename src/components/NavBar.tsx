import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function NavBar() {
  const { session, logout } = useAuth()

  return (
    <nav className="navbar navbar-dark bg-dark mb-4">
      <div className="container">
        <Link to="/" className="navbar-brand">Product Catalog</Link>
        {session && (
          <div className="d-flex align-items-center gap-3">
            <span className="navbar-text">{session.email}</span>
            <button className="btn btn-sm btn-outline-light" onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  )
}
