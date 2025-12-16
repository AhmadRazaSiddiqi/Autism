import { Link } from 'react-router-dom'

const mockUsers = [
  { id: '1', name: 'Amelia Hart' },
  { id: '2', name: 'Ravi Singh' },
]

export default function Users() {
  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Users</h1>
        <button className="btn btn-primary btn-sm" type="button">
          Add User
        </button>
      </div>
      <div className="list-group shadow-sm">
        {mockUsers.map((user) => (
          <Link
            to={`/users/${user.id}`}
            key={user.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            <span>{user.name}</span>
            <span className="badge text-bg-light">View</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

