import { useMemo, useState } from 'react'
import './Assessments.css'

const allAssessments = [
  {
    id: 'a1',
    title: 'Early Childhood Autism Screening',
    type: 'Screening',
    status: 'Active',
    totalSubmissions: 4520,
    averageScore: 78.5,
    lastUpdated: '2024-01-20',
    createdDate: '2023-08-15',
  },
  {
    id: 'a2',
    title: 'Cognitive Skills Assessment',
    type: 'Assessment',
    status: 'Active',
    totalSubmissions: 2890,
    averageScore: 82.3,
    lastUpdated: '2024-01-18',
    createdDate: '2023-09-10',
  },
  {
    id: 'a3',
    title: 'Social Communication Evaluation',
    type: 'Evaluation',
    status: 'Active',
    totalSubmissions: 1650,
    averageScore: 75.8,
    lastUpdated: '2024-01-15',
    createdDate: '2023-10-05',
  },
  {
    id: 'a4',
    title: 'Sensory Processing Assessment',
    type: 'Assessment',
    status: 'Inactive',
    totalSubmissions: 980,
    averageScore: 71.2,
    lastUpdated: '2023-12-10',
    createdDate: '2023-11-01',
  },
  {
    id: 'a5',
    title: 'Developmental Milestones Check',
    type: 'Screening',
    status: 'Active',
    totalSubmissions: 3240,
    averageScore: 80.1,
    lastUpdated: '2024-01-22',
    createdDate: '2023-09-20',
  },
  {
    id: 'a6',
    title: 'Language Development Test',
    type: 'Test',
    status: 'Active',
    totalSubmissions: 2100,
    averageScore: 77.5,
    lastUpdated: '2024-01-19',
    createdDate: '2023-10-15',
  },
  {
    id: 'a7',
    title: 'Behavioral Observation Form',
    type: 'Evaluation',
    status: 'Active',
    totalSubmissions: 1890,
    averageScore: 73.9,
    lastUpdated: '2024-01-17',
    createdDate: '2023-11-10',
  },
  {
    id: 'a8',
    title: 'Parent Questionnaire',
    type: 'Questionnaire',
    status: 'Inactive',
    totalSubmissions: 1450,
    averageScore: 69.8,
    lastUpdated: '2023-11-25',
    createdDate: '2023-10-20',
  },
]

const STATUS_FILTERS = ['Status', 'Active', 'Inactive']
const TYPE_FILTERS = ['Type', 'Screening', 'Assessment', 'Evaluation', 'Test', 'Questionnaire']
const PAGE_SIZE = 5

export default function Assessments() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Status')
  const [typeFilter, setTypeFilter] = useState('Type')
  const [page, setPage] = useState(1)

  const filteredAssessments = useMemo(() => {
    let list = [...allAssessments]

    if (search.trim()) {
      const term = search.trim().toLowerCase()
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.type.toLowerCase().includes(term),
      )
    }

    if (statusFilter !== 'Status') {
      list = list.filter((a) => a.status === statusFilter)
    }

    if (typeFilter !== 'Type') {
      list = list.filter((a) => a.type === typeFilter)
    }

    // newest first
    list.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    return list
  }, [search, statusFilter, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredAssessments.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageAssessments = filteredAssessments.slice(startIndex, startIndex + PAGE_SIZE)

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  return (
    <div className="assessments-page">
      <div className="container assessments-container">
        <header className="assessments-header">
          <h1 className="assessments-title">Assessments</h1>
        </header>

        <div className="assessments-filters-row">
          <div className="assessments-search position-relative">
            <span className="material-symbols-outlined assessments-search-icon">
              search
            </span>
            <input
              type="text"
              className="form-control assessments-search-input"
              placeholder="Search assessments..."
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
              {STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="form-select"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setPage(1)
              }}
            >
              {TYPE_FILTERS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="assessments-table-wrapper">
          <table className="table mb-0 assessments-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Type</th>
                <th scope="col">Status</th>
                <th scope="col">Total Submissions</th>
                <th scope="col">Average Score</th>
                <th scope="col">Last Updated</th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pageAssessments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No assessments found
                  </td>
                </tr>
              ) : (
                pageAssessments.map((assessment) => (
                  <tr key={assessment.id}>
                    <td>{assessment.title}</td>
                    <td>{assessment.type}</td>
                    <td>
                      <span
                        className={`assessments-status-pill ${
                          assessment.status === 'Active'
                            ? 'assessments-status-pill--active'
                            : 'assessments-status-pill--inactive'
                        }`}
                      >
                        {assessment.status}
                      </span>
                    </td>
                    <td>{assessment.totalSubmissions.toLocaleString()}</td>
                    <td>{assessment.averageScore}</td>
                    <td>{assessment.lastUpdated}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 me-2 assessments-action-link"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 assessments-action-link"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <nav className="assessments-pagination" aria-label="Assessments pagination">
          <button
            type="button"
            className="assessments-page-btn"
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
                className={`assessments-page-btn ${
                  p === currentPage ? 'assessments-page-btn--active' : ''
                }`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            )
          })}
          <button
            type="button"
            className="assessments-page-btn"
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
