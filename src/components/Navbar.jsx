import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Navbar.css'

const links = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Users', to: '/users' },
  { label: 'Quizzes', to: '/quizzes' },
  { label: 'Assessments', to: '/assessments' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact Us', to: '/contact-us' },
]

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav className="navbar navbar-light topnav">
      <div className="container-fluid topnav-container">
        <Link className="navbar-brand topnav-brand" to="/dashboard">
          <span className="topnav-mark">
            <span className="topnav-mark-dot" />
            <span className="topnav-mark-dot" />
            <span className="topnav-mark-swoosh" />
          </span>
          <span className="d-flex flex-column">
            <span className="topnav-text-ar">تالينو</span>
            <span className="topnav-text-en">talinoo</span>
          </span>
        </Link>

        <div className="d-flex align-items-center ms-auto gap-3 topnav-right">
          <ul className="navbar-nav topnav-links flex-row align-items-center mb-0">
            {links.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? ' active' : ''}`
                  }
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center topnav-actions" ref={dropdownRef}>
            <button className="topnav-bell" type="button" aria-label="Notifications">
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
                <span className="topnav-avatar">U</span>
              </button>
              {showMenu && (
                <div className="topnav-dropdown" role="menu">
                  <button className="topnav-signout" type="button">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

