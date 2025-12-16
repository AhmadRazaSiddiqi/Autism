export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50 d-flex align-items-center py-4 py-md-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-11 col-md-7 col-lg-5 col-xl-4">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <h1 className="h3 mb-3 text-center">Welcome back</h1>
                <p className="text-muted text-center mb-4 fs-6">
                  Sign in to continue to the dashboard.
                </p>
                <form className="vstack gap-3">
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="••••••••"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-100 mt-2">
                    Sign in
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

