import './Dashboard.css'

const recentActivity = [
  {
    activity: "Quiz 'Intro to Talents' created",
    date: '2023-09-20',
    user: 'Alex Harper',
  },
  {
    activity: "User 'Emily Carter' invited",
    date: '2023-09-19',
    user: 'Jordan Bennett',
  },
  {
    activity: "Assessment 'Cognitive Skills' added",
    date: '2023-09-18',
    user: 'Taylor Hayes',
  },
]

const systemAlerts = [
  {
    title: 'Payment processing delay',
    date: '2023-09-21',
  },
  {
    title: 'New quiz submissions pending review',
    date: '2023-09-20',
  },
]

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="container dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
        </header>

        <section className="dashboard-metrics-row">
          <div className="dashboard-metric-card dashboard-metric-card--soft">
            <p className="dashboard-metric-label">Total Quizzes</p>
            <p className="dashboard-metric-value">1,234</p>
          </div>

          <div className="dashboard-metric-card dashboard-metric-card--highlight">
            <p className="dashboard-metric-label">Total Users</p>
            <p className="dashboard-metric-value">5,678</p>
          </div>

          <div className="dashboard-metric-card dashboard-metric-card--soft">
            <p className="dashboard-metric-label">Total Assessments</p>
            <p className="dashboard-metric-value">9,012</p>
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="dashboard-section-title">Recent Activity</h2>
          <div className="dashboard-table-wrapper">
            <table className="table mb-0 dashboard-table">
              <thead>
                <tr>
                  <th scope="col">Activity</th>
                  <th scope="col">Date</th>
                  <th scope="col">User</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((row) => (
                  <tr key={`${row.activity}-${row.date}`}>
                    <td>{row.activity}</td>
                    <td>{row.date}</td>
                    <td>{row.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="dashboard-section-title">System Alerts</h2>
          <div className="dashboard-alerts">
            {systemAlerts.map((alert) => (
              <div className="dashboard-alert-card" key={alert.title}>
                <div className="dashboard-alert-icon">
                  <span className="material-symbols-outlined dashboard-alert-icon-symbol">
                    warning
                  </span>
                </div>
                <div>
                  <p className="dashboard-alert-title">{alert.title}</p>
                  <p className="dashboard-alert-date">{alert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

