import { useParams, Link } from 'react-router-dom'
import './UserDetails.css'

const MOCK_USER = {
  name: 'Acme Corp',
  contactName: 'Jordan Bennett',
  email: 'contact@acmecorp.com',
  phone: '+1 (555) 123-4567',
  status: 'Active',
  joined: '2023-01-15',
  lastActive: '2023-09-20 14:35',
  totalQuizzes: 18,
  totalAssessments: 245,
  completionRate: '88%',
}

const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'Quiz submission',
    label: 'Intro to Talents',
    date: '2023-09-20',
    status: 'Completed',
  },
  {
    id: 2,
    type: 'Assessment assigned',
    label: 'Cognitive Skills',
    date: '2023-09-18',
    status: 'Pending',
  },
  {
    id: 3,
    type: 'Account updated',
    label: 'Profile information',
    date: '2023-09-10',
    status: 'Success',
  },
]

export default function UserDetails() {
  const { id } = useParams()
  const user = MOCK_USER

  return (
    <div className="userdetails-page">
      <div className="container userdetails-container">
        <header className="userdetails-header">
          <div>
            <h1 className="userdetails-title">{user.name}</h1>
            <p className="userdetails-subtitle">
              Client account overview · ID <span className="userdetails-id-pill">{id}</span>
            </p>
          </div>
          <div className="userdetails-header-actions">
            <Link to="/users" className="btn btn-outline-secondary btn-sm">
              Back to users
            </Link>
            <button type="button" className="btn btn-secondary btn-sm">
              Impersonate
            </button>
            <button type="button" className="btn btn-primary btn-sm">
              Edit details
            </button>
          </div>
        </header>

        <section className="userdetails-top-row">
          <div className="card userdetails-card userdetails-card--profile">
            <div className="card-body">
              <h2 className="userdetails-card-title">Account details</h2>
              <div className="userdetails-profile-layout">
                <div className="userdetails-avatar">
                  <span>{user.name.charAt(0)}</span>
                </div>
                <dl className="userdetails-meta-grid">
                  <div>
                    <dt>Primary contact</dt>
                    <dd>{user.contactName}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>{user.phone}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>
                      <span
                        className={`userdetails-status-pill ${
                          user.status === 'Active'
                            ? 'userdetails-status-pill--active'
                            : 'userdetails-status-pill--inactive'
                        }`}
                      >
                        {user.status}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt>Joined</dt>
                    <dd>{user.joined}</dd>
                  </div>
                  <div>
                    <dt>Last active</dt>
                    <dd>{user.lastActive}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="card userdetails-card userdetails-card--stats">
            <div className="card-body">
              <h2 className="userdetails-card-title">Engagement summary</h2>
              <div className="userdetails-stats-row">
                <div>
                  <p className="userdetails-metric-label">Quizzes created</p>
                  <p className="userdetails-metric-value">{user.totalQuizzes}</p>
                </div>
                <div>
                  <p className="userdetails-metric-label">Assessments submitted</p>
                  <p className="userdetails-metric-value">{user.totalAssessments}</p>
                </div>
                <div>
                  <p className="userdetails-metric-label">Completion rate</p>
                  <p className="userdetails-metric-value">{user.completionRate}</p>
                </div>
              </div>
              <p className="userdetails-card-caption mb-0">
                These metrics are based on the last 90 days of activity.
              </p>
            </div>
          </div>
        </section>

        <section className="userdetails-section">
          <div className="userdetails-section-header">
            <h2 className="userdetails-section-title">Recent activity</h2>
            <button type="button" className="btn btn-outline-secondary btn-sm">
              View all
            </button>
          </div>

          <div className="userdetails-table-wrapper">
            <table className="table mb-0 userdetails-table">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Details</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ACTIVITY.map((row) => (
                  <tr key={row.id}>
                    <td>{row.type}</td>
                    <td>{row.label}</td>
                    <td>{row.date}</td>
                    <td>
                      <span
                        className={`userdetails-status-pill ${
                          row.status === 'Completed'
                            ? 'userdetails-status-pill--success'
                            : row.status === 'Pending'
                              ? 'userdetails-status-pill--pending'
                              : 'userdetails-status-pill--active'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 userdetails-inline-link"
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

        <section className="userdetails-section userdetails-footer-actions">
          <button type="button" className="btn btn-outline-secondary btn-sm">
            Reset password
          </button>
          <button type="button" className="btn btn-secondary btn-sm">
            Pause account
          </button>
          <button type="button" className="btn btn-danger btn-sm ms-auto">
            Disable account
          </button>
        </section>
      </div>
    </div>
  )
}

