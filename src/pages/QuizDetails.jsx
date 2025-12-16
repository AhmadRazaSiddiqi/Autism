import { useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import './QuizDetails.css'

const INITIAL_QUESTIONS = [
  {
    id: 'q1',
    order: 1,
    text: 'Does the child make eye contact?',
    type: 'Multiple Choice',
    subscale: 'Social Communication',
  },
  {
    id: 'q2',
    order: 2,
    text: 'Does the child point to show interest?',
    type: 'Yes/No',
    subscale: 'Social Communication',
  },
  {
    id: 'q3',
    order: 3,
    text: 'Does the child have repetitive movements?',
    type: 'Scale 1–5',
    subscale: 'Restricted/Repetitive',
  },
]

const RECENT_SUBMISSIONS = [
  {
    id: 'U1045',
    date: '2024-01-25 09:45 AM',
    score: 85,
    status: 'Completed',
  },
  {
    id: 'U1089',
    date: '2024-01-24 03:20 PM',
    score: 65,
    status: 'Completed',
  },
]

const ACTIVITY_BARS = [
  40, 52, 38, 61, 47, 70, 55, 63, 49, 68, 57, 72,
  51, 60, 44, 66, 58, 73, 62, 69, 53, 64, 59, 71,
]

export default function QuizDetails() {
  const { id: paramId } = useParams()
  const [searchParams] = useSearchParams()
  const queryId = searchParams.get('quizId')
  const id = queryId || paramId || 'early-childhood-screening'

  const [questions, setQuestions] = useState(INITIAL_QUESTIONS)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newQuestionText, setNewQuestionText] = useState('')
  const [newQuestionType, setNewQuestionType] = useState('Multiple Choice')
  const [newQuestionSubscale, setNewQuestionSubscale] = useState('Social Communication')

  const handleAddQuestion = () => {
    const text = newQuestionText.trim()
    if (!text) return

    const nextOrder = questions.length + 1
    const newQuestion = {
      id: `q-${Date.now()}`,
      order: nextOrder,
      text,
      type: newQuestionType,
      subscale: newQuestionSubscale,
    }

    setQuestions((prev) => [...prev, newQuestion])
    setShowAddModal(false)
    setNewQuestionText('')
    setNewQuestionType('Multiple Choice')
    setNewQuestionSubscale('Social Communication')
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setNewQuestionText('')
    setNewQuestionType('Multiple Choice')
    setNewQuestionSubscale('Social Communication')
  }

  return (
    <div className="quizdetails-page">
      <div className="container quizdetails-container">
        <header className="quizdetails-header">
          <div>
            <h1 className="quizdetails-title">Early Childhood Autism Screening</h1>
            <p className="quizdetails-subtitle">
              Standardized tool for early signs detection.
            </p>
          </div>
          <Link to="/quizzes" className="btn btn-outline-secondary btn-sm">
            Back to quizzes
          </Link>
        </header>

        <section className="quizdetails-top-row">
          <div className="card quizdetails-card quizdetails-card--details">
            <div className="card-body">
              <h2 className="quizdetails-card-title">Quiz Details</h2>

              <dl className="quizdetails-meta-grid">
                <div>
                  <dt>Description</dt>
                  <dd>Standardized tool for early signs detection.</dd>
                </div>
                <div>
                  <dt>Slug</dt>
                  <dd>
                    <span className="quizdetails-pill">
                      {id || 'early-childhood-screening'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Max Score</dt>
                  <dd>100</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span className="quizdetails-status-dot" /> Active
                  </dd>
                </div>
                <div>
                  <dt>Created At</dt>
                  <dd>2023-08-15 10:30 AM</dd>
                </div>
                <div>
                  <dt>Updated At</dt>
                  <dd>2024-01-20 02:15 PM</dd>
                </div>
              </dl>

              <button type="button" className="btn btn-outline-primary btn-sm mt-3">
                Edit Quiz
              </button>
            </div>
          </div>

          <div className="card quizdetails-card quizdetails-card--performance">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="quizdetails-card-title mb-0">Performance Overview</h2>
                <span className="quizdetails-card-caption">
                  Recent Activity (Last 30 Days)
                </span>
              </div>

              <div className="quizdetails-stats-row">
                <div>
                  <p className="quizdetails-metric-label">Total Times Taken</p>
                  <p className="quizdetails-metric-value">4,520</p>
                </div>
                <div>
                  <p className="quizdetails-metric-label">Average Score</p>
                  <p className="quizdetails-metric-value">78.5</p>
                </div>
                <div>
                  <p className="quizdetails-metric-label">Completion Rate</p>
                  <p className="quizdetails-metric-value">92%</p>
                </div>
              </div>

              <div className="quizdetails-activity-chart">
                {ACTIVITY_BARS.map((value, idx) => (
                  <div
                    // index is fine for static demo data
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    className="quizdetails-activity-bar"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="quizdetails-section">
          <div className="quizdetails-section-header">
            <h2 className="quizdetails-section-title">Questions Summary</h2>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddModal(true)}
            >
              Add Question
            </button>
          </div>

          <div className="quizdetails-table-wrapper">
            <table className="table mb-0 quizdetails-table">
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Question Text</th>
                  <th scope="col">Type</th>
                  <th scope="col">Subscale</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id}>
                    <td>{q.order}</td>
                    <td>{q.text}</td>
                    <td>{q.type}</td>
                    <td>{q.subscale}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 me-2 quizdetails-inline-link"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 quizdetails-inline-link"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="quizdetails-section">
          <div className="quizdetails-section-header">
            <h2 className="quizdetails-section-title">Recent Assessment Submissions</h2>
          </div>

          <div className="quizdetails-table-wrapper">
            <table className="table mb-0 quizdetails-table">
              <thead>
                <tr>
                  <th scope="col">User ID</th>
                  <th scope="col">Date</th>
                  <th scope="col">Score</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {RECENT_SUBMISSIONS.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.date}</td>
                    <td>{row.score}</td>
                    <td>
                      <span className="quizdetails-status-pill quizdetails-status-pill--success">
                        {row.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 quizdetails-inline-link"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="quizdetails-footer-actions">
            <button type="button" className="btn btn-outline-secondary btn-sm">
              Export Data
            </button>
            <button type="button" className="btn btn-outline-danger btn-sm">
              Deactivate Quiz
            </button>
            <button type="button" className="btn btn-danger btn-sm">
              Delete Quiz
            </button>
          </div>
        </section>
      </div>

      {showAddModal && (
        <div className="quizdetails-modal-backdrop">
          <div className="card quizdetails-modal">
            <h2 className="quizdetails-modal-title">Add Question</h2>
            <div className="mb-3">
              <label className="form-label">Question text</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter the question text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={newQuestionType}
                  onChange={(e) => setNewQuestionType(e.target.value)}
                >
                  <option>Multiple Choice</option>
                  <option>Yes/No</option>
                  <option>Scale 1–5</option>
                  <option>Free Text</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Subscale</label>
                <select
                  className="form-select"
                  value={newQuestionSubscale}
                  onChange={(e) => setNewQuestionSubscale(e.target.value)}
                >
                  <option>Social Communication</option>
                  <option>Restricted/Repetitive</option>
                  <option>Sensory</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="quizdetails-modal-actions">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleAddQuestion}
              >
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

