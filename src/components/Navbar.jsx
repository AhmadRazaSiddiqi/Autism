import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const links = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Users", to: "/users" },
  { label: "Quizzes", to: "/quizzes" },
  // { label: "Assessments", to: "/assessments" },
  { label: "Resources", to: "/resources" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light topnav">
      <div className="container-fluid topnav-container">
        <div className="d-flex align-items-center ms-auto gap-3 topnav-right">
          <ul className="navbar-nav topnav-links flex-row align-items-center mb-0">
            {links.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div
            className="d-flex align-items-center topnav-actions"
            ref={dropdownRef}
          >
            <button
              className="topnav-bell"
              type="button"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined topnav-bell-icon">
                notifications
              </span>
            </button>
            <div className="topnav-avatar-dropdown position-relative">
              <button
                type="button"
                className="topnav-avatar-btn"
                aria-haspopup="true"
                aria-expanded={showMenu}
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <span className="topnav-avatar">{initial}</span>
              </button>
              {showMenu && (
                <div className="topnav-dropdown" role="menu">
                  <div className="flex items-center topnav-signout">
                    <span className="material-symbols-outlined pt-0.5">
                      logout
                    </span>
                    <button className="" type="button" onClick={handleLogout}>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
