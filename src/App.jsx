import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import Home from "./components/Auth/Home";
import Login from "./components/Auth/Login";
import NavBar from "./components/Auth/common/NavBar";
import Users from "./components/admin/Users.jsx";
import FeedDetails from "./components/admin/feeddetails";
import Quizzes from "./components/admin/Quizzes.jsx";
import TalentDetails from "./components/admin/TalentDetails";
import BookingDetails from "./components/admin/bookingdetails";
import Talent1 from "./components/admin/Talent1";
import UserProfile from "./components/admin/UserProfile.jsx";
import Payments from "./components/admin/Payments";
import ContactUs from "./components/admin/ContactUs";
import Skill from "./components/admin/Skill";
import City from "./components/admin/City";
import Language from "./components/admin/language";

import Transactions from "./components/admin/Transactions";


import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Resources from "./components/admin/Resources.jsx";
import Tasks from "./components/admin/Tasks";
import Dashboard from "./components/admin/Dashboard.jsx";
import UserDetails from "./components/admin/UserDetails.jsx";
import QuizEditor from "./components/admin/QuizEditor.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <QuizEditor />
        </ProtectedRoute>
      ),
    },
    // {
    //   path: "/",
    //   element: (
    //     <ProtectedRoute>
    //       <Dashboard />
    //     </ProtectedRoute>
    //   ),
    // },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/resources",
      element: (
        <ProtectedRoute>
          <Resources />
        </ProtectedRoute>
      ),
    },
    {
      path: "/users",
      element: (
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      ),
    },
    {
      path: "/userDetails",
      element: (
        <ProtectedRoute>
          <UserDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: "/feeddetails",
      element: (
        <ProtectedRoute>
          <FeedDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: "/bookingdetails",
      element: (
        <ProtectedRoute>
          <BookingDetails />
        </ProtectedRoute>
      ),
    },
    
    {
      path: "/quizzes",
      element: (
        <ProtectedRoute>
          <Quizzes />
        </ProtectedRoute>
      ),
    },
    {
      path: "/talentDetails",
      element: (
        <ProtectedRoute>
          <TalentDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: "/talent1",
      element: (
        <ProtectedRoute>
          <Talent1 />
        </ProtectedRoute>
      ),
    },
    {
      path: "/talentProfile",
      element: (
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/payments",
      element: (
        <ProtectedRoute>
          <Payments />
        </ProtectedRoute>
      ),
    },
    {
      path: "/transactions",
      element: (
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      ),
    },
    {
      path: "/tasks",
      element: (
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      ),
    },
    {
      path: "/skill",
      element: (
        <ProtectedRoute>
          <Skill />
        </ProtectedRoute>
      ),
    },
     {
      path: "/languages",
      element: (
        <ProtectedRoute>
          <Language />
        </ProtectedRoute>
      ),
    },
    {
      path: "/cities",
      element: (
        <ProtectedRoute>
          <City />
        </ProtectedRoute>
      ),
    },
    {
      path: "/contact-us",
      element: (
        <ProtectedRoute>
          <ContactUs />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
