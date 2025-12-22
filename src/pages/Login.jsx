import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ApiService from "../services/ApiService";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await ApiService.login(formData);
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have been logged in successfully.",
      }).finally(() => {
        // Using replace: true removes the Login page from the browser history stack
        navigate("/dashboard", { replace: true });
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

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

                <form className="vstack gap-3" onSubmit={handleSubmit}>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control form-control-lg"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control form-control-lg"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mt-2"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
