import React, { useState } from "react";
import "../../assets/css/login.css";
import ApiService from "../../services/ApiService";
import Swal from "sweetalert2";


function Login() {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleLogin = async () => {
  setLoading(true);
  setError("");

  try {
    const response = await ApiService.login({
      username,
      password,
      remember: rememberMe,
    });

    console.log("Full Response:", response);

    if (response.data && response.data.user && response.data.user.role === "admin") {
      // ✅ SweetAlert Success
      Swal.fire({
        title: "Login Successful 🎉",
        text: `Welcome Admin, ${response.data.user.username}!`,
        icon: "success",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        // Save session
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirect after success
        window.location.href = "/dashboard";
      });
    } else {
      Swal.fire({
        title: "Unauthorized 🚫",
        text: "You are not authorized to access the admin panel.",
        icon: "warning",
        confirmButtonColor: "#d33",
      });
    }
  } catch (err) {
    console.error("Login failed:", err);
    Swal.fire({
      title: "Login Failed ❌",
      text: "Invalid credentials. Please try again.",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  } finally {
    setLoading(false);
  }
};




  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <div className="logo-section">
            <img src="talinoo.svg" alt="Logo" />
          </div>

          {/* title */}
          <div className="welcome-title">
            <h1>Welcome Back</h1>
          </div>

          {/* form */}
          <div className="form-container">
            {/* email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email or UserName
              </label>
              <input
                className="form-input"
                id="email"
                type="text"
                placeholder="Enter your email or username"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                className="form-input"
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* RememberMe Checkbox */}
          <div className="checkbox-container">
            <input
              id="remember-me"
              type="checkbox"
              className="checkbox"
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="checkbox-label">
              Remember Me
            </label>
          </div>

          <div className="forgot-password">
            <button className="forgot-link">Forgot password?</button>
          </div>

          {/* Error message */}
          {error && <div className="error-message">{error}</div>}

          {/* login button */}
          <button
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;
