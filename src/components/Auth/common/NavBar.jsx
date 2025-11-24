import React from "react";
import "../../../assets/css/navbar.css";
import { Link } from "react-router-dom";
import { GoBell } from "react-icons/go";
import technologyIcon from "../../../../public/technologyIcon.svg";
function NavBar() {
  const handleLogout = () => {
    // Remove any stored tokens or user data
    localStorage.clear(); // clears all localStorage data
    sessionStorage.clear(); // clears all sessionStorage data

    // Optional: clear specific cookies if you use them
    document.cookie
      .split(";")
      .forEach(
        (c) =>
          (document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`))
      );

    console.log("User logged out, all sessions cleared.");

    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="navbar-container">
      <div className="navbar-content">
        {/* Logo */}
        <div>
          <img src="/talinoo 1.svg" alt="Brand Logo" className="brand-logo" />
        </div>

        {/* Menu + Icons */}
        <div className="flex items-center space-x-6 justify-between">
          <div className="menu-links">
            <Link to="/dashboard" className="menu-link">
              Dashboard
            </Link>
            <Link to="/clients" className="menu-link">
              Users
            </Link>
            <Link to="/talents" className="menu-link">
              Quizzes
            </Link>
            <Link to="/feed" className="menu-link">
              Resources
            </Link>
            <Link to="/contact-us" className="menu-link">
              Contact Us
            </Link>
          </div>
          <div className="bell-icon-container">
            <GoBell />
          </div>
          <div className="brand-dropdown">
            <img
              src="/technologyIcon.svg"
              alt="Brand Logo"
              className="brand-logo"
            />
            <div className="dropdown-content">
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
