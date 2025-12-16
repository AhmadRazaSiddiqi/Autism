
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Users.css'

const allUsers = [
  {
    id: '1',
    name: 'Acme Corp',
    email: 'contact@acmecorp.com',
    status: 'Active',
    date: '2023-01-15',
  },
  {
    id: '2',
    name: 'Global Innovations',
    email: 'info@globalinnovations.com',
    status: 'Inactive',
    date: '2023-02-20',
  },
  {
    id: '3',
    name: 'Tech Solutions Inc.',
    email: 'support@techsolutions.com',
    status: 'Active',
    date: '2023-03-10',
  },
  {
    id: '4',
    name: 'Creative Minds LLC',
    email: 'hello@creativeminds.com',
    status: 'Active',
    date: '2023-04-05',
  },
  {
    id: '5',
    name: 'Dynamic Systems',
    email: 'admin@dynamicsystems.com',
    status: 'Inactive',
    date: '2023-05-12',
  },
  {
    id: '6',
    name: 'Innovative Designs',
    email: 'team@innovativedesigns.com',
    status: 'Active',
    date: '2023-06-18',
  },
  {
    id: '7',
    name: 'Strategic Ventures',
    email: 'contact@strategicventures.com',
    status: 'Inactive',
    date: '2023-07-22',
  },
  {
    id: '8',
    name: 'Future Tech Group',
    email: 'info@futuretechgroup.com',
    status: 'Active',
    date: '2023-08-30',
  },
  {
    id: '9',
    name: 'Elite Solutions',
    email: 'support@elitesolutions.com',
    status: 'Active',
    date: '2023-09-15',
  },
  {
    id: '10',
    name: 'Pinnacle Enterprises',
    email: 'hello@pinnacleenterprises.com',
    status: 'Inactive',
    date: '2023-10-01',
  },
]

const STATUS_OPTIONS = ['All', 'Active', 'Inactive']
const DATE_SORT_OPTIONS = ['Newest', 'Oldest']
const PAGE_SIZE = 5

export default function Users() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateSort, setDateSort] = useState('Newest')
  const [page, setPage] = useState(1)

  const filteredUsers = useMemo(() => {
    let list = [...allUsers]

    if (search.trim()) {
      const term = search.trim().toLowerCase()
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term),
      )
    }

    if (statusFilter !== 'All') {
      list = list.filter((u) => u.status === statusFilter)
    }

    list.sort((a, b) => {
      const aDate = new Date(a.date).getTime()
      const bDate = new Date(b.date).getTime()
      return dateSort === 'Newest' ? bDate - aDate : aDate - bDate
    })

    return list
  }, [search, statusFilter, dateSort])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE)

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  return (
    <div className="users-page">
      <div className="container users-container">
        <header className="users-header">
          <h1 className="users-title">Users</h1>
        </header>

        <div className="users-filters-row">
          <div className="users-search position-relative">
            <span className="material-symbols-outlined users-search-icon">
              search
            </span>
            <input
              type="text"
              className="form-control users-search-input"
              placeholder="Search users"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>

          <div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'All' ? 'Status' : opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="form-select"
              value={dateSort}
              onChange={(e) => {
                setDateSort(e.target.value)
                setPage(1)
              }}
            >
              {DATE_SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'Newest' ? 'Date (Newest)' : 'Date (Oldest)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="users-table-wrapper">
          <table className="table mb-0 users-table">
            <thead>
              <tr>
                <th scope="col">Client</th>
                <th scope="col">Email</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
                <th scope="col" className="text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pageUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No users found
                  </td>
                </tr>
              ) : (
                pageUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td>
                      <span
                        className={`users-status-pill ${
                          user.status === 'Active'
                            ? 'users-status-pill--active'
                            : 'users-status-pill--inactive'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>{user.date}</td>
                    <td>
                      <div className="users-actions">
                        <button
                          type="button"
                          className="users-action-btn"
                          aria-label="Delete user"
                        >
                          <span className="material-symbols-outlined users-action-icon">
                            delete
                          </span>
                        </button>
                        <Link
                          to={`/users/${user.id}`}
                          className="users-action-btn"
                          aria-label="View user"
                        >
                          <span className="material-symbols-outlined users-action-icon">
                            visibility
                          </span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <nav className="users-pagination" aria-label="Users pagination">
          <button
            type="button"
            className="users-page-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const p = idx + 1
            return (
              <button
                key={p}
                type="button"
                className={`users-page-btn ${
                  p === currentPage ? 'users-page-btn--active' : ''
                }`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            )
          })}
          <button
            type="button"
            className="users-page-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </nav>
      </div>
    </div>
  )
}
