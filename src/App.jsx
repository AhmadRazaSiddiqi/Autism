import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import UserDetails from './pages/UserDetails'
import Quizzes from './pages/Quizzes'
import QuizDetails from './pages/QuizDetails'
import Assessments from './pages/Assessments'
import Resources from './pages/Resources'
import NotFound from './pages/NotFound'

function Layout({ children }) {
  const location = useLocation()
  const hideNavbar = location.pathname === '/login'

  return (
    <div className="min-h-screen bg-slate-50">
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/users"
        element={
          <Layout>
            <Users />
          </Layout>
        }
      />
      <Route
        path="/users/:id"
        element={
          <Layout>
            <UserDetails />
          </Layout>
        }
      />
      <Route
        path="/quizzes"
        element={
          <Layout>
            <Quizzes />
          </Layout>
        }
      />
      <Route
        path="/quizzes/:id"
        element={
          <Layout>
            <QuizDetails />
          </Layout>
        }
      />
      <Route
        path="/quizdetails"
        element={
          <Layout>
            <QuizDetails />
          </Layout>
        }
      />
      <Route
        path="/assessments"
        element={
          <Layout>
            <Assessments />
          </Layout>
        }
      />
      <Route
        path="/resources"
        element={
          <Layout>
            <Resources />
          </Layout>
        }
      />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
