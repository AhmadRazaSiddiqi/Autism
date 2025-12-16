import { useParams, Link } from 'react-router-dom'

export default function UserDetails() {
  const { id } = useParams()

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="h4 mb-1">User Details</h1>
          <p className="text-muted mb-0">User ID: {id}</p>
        </div>
        <Link to="/users" className="btn btn-outline-secondary btn-sm">
          Back to users
        </Link>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <p className="mb-0">
            Replace this with real user details, activity, permissions, etc.
          </p>
        </div>
      </div>
    </div>
  )
}

