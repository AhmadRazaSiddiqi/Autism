import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen d-flex align-items-center bg-slate-50">
      <div className="container text-center">
        <h1 className="display-5 fw-bold mb-3">404</h1>
        <p className="text-muted mb-4">The page you are looking for was not found.</p>
        <Link to="/" className="btn btn-primary">
          Go home
        </Link>
      </div>
    </div>
  )
}

