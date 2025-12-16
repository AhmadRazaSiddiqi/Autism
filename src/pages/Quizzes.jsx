
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Quizzes.css'

const allQuizzes = [
  {
    id: 'quiz-1',
    title: 'Senior Software Engineer',
    client: 'Acme Corp',
    talent: 'Alex Johnson',
    status: 'Active',
    date: '2023-08-15',
  },
  {
    id: 'quiz-2',
    title: 'Product Manager',
    client: 'Tech Solutions Inc.',
    talent: 'Emily Chen',
    status: 'Inactive',
    date: '2023-07-22',
  },
  {
    id: 'quiz-3',
    title: 'UX Designer',
    client: 'Creative Agency',
    talent: 'David Lee',
    status: 'Active',
    date: '2023-09-01',
  },
  {
    id: 'quiz-4',
    title: 'Data Analyst',
    client: 'Data Driven Co.',
    talent: 'Sophia Brown',
    status: 'Active',
    date: '2023-08-20',
  },
  {
    id: 'quiz-5',
    title: 'Marketing Specialist',
    client: 'Global Marketing Ltd.',
    talent: 'Ethan White',
    status: 'Inactive',
    date: '2023-07-10',
  },
  {
    id: 'quiz-6',
    title: 'Financial Analyst',
    client: 'Finance Group LLC',
    talent: 'Olivia Green',
    status: 'Active',
    date: '2023-09-05',
  },
  {
    id: 'quiz-7',
    title: 'Operations Manager',
    client: 'Operations Solutions',
    talent: 'Noah Clark',
    status: 'Active',
    date: '2023-08-28',
  },
  {
    id: 'quiz-8',
    title: 'Customer Support Lead',
    client: 'Support Services Inc.',
    talent: 'Ava Martinez',
    status: 'Inactive',
    date: '2023-07-18',
  },
  {
    id: 'quiz-9',
    title: 'Sales Representative',
    client: 'Sales Force Co.',
    talent: 'Liam Harris',
    status: 'Active',
    date: '2023-09-10',
  },
  {
    id: 'quiz-10',
    title: 'HR Coordinator',
    client: 'Human Resources Ltd.',
    talent: 'Isabella Walker',
    status: 'Active',
    date: '2023-08-05',
  },
]

const STATUS_FILTERS = ['All', 'Active', 'Inactive']
const PAGE_SIZE = 5

export default function Quizzes() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const filtered = useMemo(() => {
    let list = [...allQuizzes]

    if (search.trim()) {
      const term = search.trim().toLowerCase()
      list = list.filter(
        (q) =>
          q.title.toLowerCase().includes(term) ||
          q.client.toLowerCase().includes(term) ||
          q.talent.toLowerCase().includes(term),
      )
    }

    if (statusFilter !== 'All') {
      list = list.filter((q) => q.status === statusFilter)
    }

    // newest first
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return list
  }, [search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  const handleCreateQuiz = () => {
    const title = newTitle.trim()
    if (!title) return

    const slug = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 7)}`

    setShowModal(false)
    setNewTitle('')
    navigate(`/quizdetails?quizId=${encodeURIComponent(slug)}`)
  }

  return (
    <div className="quizzes-page">
      <div className="container quizzes-container">
        <header className="quizzes-header">
          <h1 className="quizzes-title">Quizzes</h1>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowModal(true)}
          >
            Add quiz
          </button>
        </header>

        <div className="quizzes-filters-row">
          <div className="quizzes-search position-relative">
            <span className="material-symbols-outlined quizzes-search-icon">
              search
            </span>
            <input
              type="text"
              className="form-control quizzes-search-input"
              placeholder="Search talents, client or quiz"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>

          <div className="quizzes-filter-chips">
            {STATUS_FILTERS.map((label) => (
              <button
                key={label}
                type="button"
                className={`btn quizzes-chip ${
                  statusFilter === label ? 'quizzes-chip--active' : ''
                }`}
                onClick={() => {
                  setStatusFilter(label)
                  setPage(1)
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="quizzes-table-wrapper">
          <table className="table mb-0 quizzes-table">
            <thead>
              <tr>
                <th scope="col">Talent Title</th>
                <th scope="col">Client</th>
                <th scope="col">Talent</th>
                <th scope="col">Status</th>
                <th scope="col">Posted Date</th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No quizzes found
                  </td>
                </tr>
              ) : (
                pageItems.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>{quiz.title}</td>
                    <td>{quiz.client}</td>
                    <td>{quiz.talent}</td>
                    <td>
                      <span
                        className={`quizzes-status-pill ${
                          quiz.status === 'Active'
                            ? 'quizzes-status-pill--active'
                            : 'quizzes-status-pill--inactive'
                        }`}
                      >
                        {quiz.status}
                      </span>
                    </td>
                    <td>{quiz.date}</td>
                    <td className="text-end">
                      <Link
                        to={`/quizzes/${quiz.id}`}
                        className="quizzes-view-link text-decoration-none"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <nav className="quizzes-pagination" aria-label="Quizzes pagination">
          <button
            type="button"
            className="quizzes-page-btn"
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
                className={`quizzes-page-btn ${
                  p === currentPage ? 'quizzes-page-btn--active' : ''
                }`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            )
          })}
          <button
            type="button"
            className="quizzes-page-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </nav>
      </div>

      {showModal && (
        <div className="quizzes-modal-backdrop">
          <div className="card quizzes-modal">
            <h2 className="quizzes-modal-title">Create quiz</h2>
            <div className="mb-3">
              <label className="form-label">Quiz title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter quiz title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="quizzes-modal-actions">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setShowModal(false)
                  setNewTitle('')
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleCreateQuiz}
              >
                Create quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
