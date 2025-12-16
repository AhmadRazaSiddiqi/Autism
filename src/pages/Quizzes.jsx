import { Link } from 'react-router-dom'

const mockQuizzes = [
  { id: 'quiz-1', title: 'Intro Assessment' },
  { id: 'quiz-2', title: 'Cognitive Skills' },
]

export default function Quizzes() {
  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Quizzes</h1>
        <button className="btn btn-primary btn-sm" type="button">
          New Quiz
        </button>
      </div>
      <div className="list-group shadow-sm">
        {mockQuizzes.map((quiz) => (
          <Link
            to={`/quizzes/${quiz.id}`}
            key={quiz.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            <span>{quiz.title}</span>
            <span className="badge text-bg-light">Open</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

