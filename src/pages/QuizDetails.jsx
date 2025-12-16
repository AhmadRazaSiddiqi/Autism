import { useParams, Link } from 'react-router-dom'

export default function QuizDetails() {
  const { id } = useParams()

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="h4 mb-1">Quiz Details</h1>
          <p className="text-muted mb-0">Quiz ID: {id}</p>
        </div>
        <Link to="/quizzes" className="btn btn-outline-secondary btn-sm">
          Back to quizzes
        </Link>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <p className="mb-0">Replace this with quiz questions, stats, and actions.</p>
        </div>
      </div>
    </div>
  )
}

