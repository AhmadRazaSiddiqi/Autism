import React, { useState, useEffect } from "react";
import NavBar from "../Auth/common/NavBar";
import "../../assets/css/tasks.css";
import { CiSearch } from "react-icons/ci";
import ApiService from "../../services/ApiService";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortDate, setSortDate] = useState("desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleView = (booking_id) =>
    navigate(`/bookingdetails?id=${booking_id}`);

  // 🔹 Fetch tasks API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await ApiService.post("admin/bookings");
        setTasks(response?.data?.data?.booking || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // 🔎 Filtering + sorting
  const filteredTasks = tasks
    .filter((t) => {
      const search = searchTerm.toLowerCase();
      return (
        (t.skillname || "").toLowerCase().includes(search) ||
        (t.clientName || "").toLowerCase().includes(search) ||
        (t.talentName || "").toLowerCase().includes(search) ||
        (t.date || "").toLowerCase().includes(search) ||
        (t.status || "").toLowerCase().includes(search)
      );
    })
    .filter((t) => statusFilter === "All" || t.status === statusFilter)
    .filter((t) => {
      if (!dateFrom && !dateTo) return true;
      const taskDate = new Date(t.date);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;

      if (from && taskDate < from) return false;
      if (to && taskDate > to) return false;
      return true;
    })
    .sort((a, b) =>
      sortDate === "desc"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

  // 📑 Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="tasks-container">
      <NavBar />
      <div className="main-content">
        <div className="tasks-title">Tasks</div>

        {/* 🔎 Search + Filters */}
        <div className="control-section row">
          {/* Search */}
          <div className="search-box col-12">
            <CiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by skill, client, talent, date, status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

         <div className="search-box-main">










           {/* Status Filter */}
          <div className="search-box2 col-4 ">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="accepted">Accepted</option>
              <option value="paymentPending">Payment Pending</option>
              <option value="rejected">Rejected</option>
              <option value="inProgress">In Progress</option>
              <option value="reviewPending">Review Pending</option>
              <option value="requestedForRescheduleByUser">Requested For Reschedule By User</option>
              <option value="requestedForRescheduleByTalent">Requested For Reschedule By Talent</option>
              <option value="canceledByUser">Canceled By User</option>
              <option value="canceledByTalent">Canceled By Talent</option>
              <option value="isPaid">Is Paid</option>
              <option value="confirm">Confirm</option>
            </select>
          </div>

          {/* Date Sort */}
          <div className="search-box2 col-4 mx-2">
            <select
              value={sortDate}
              onChange={(e) => setSortDate(e.target.value)}
              className="filter-select"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="search-box2  col-4 mx-2">
            <label>From:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="search-box2  col-4">
            <label>To:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="filter-input"
            />
          </div>
         </div>
        </div>

        <div className="table-container">
          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Client Name</th>
                  <th>Talent Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ color: "#6d028e" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTasks.map((talent) => (
                  <tr key={talent.id}>
                    <td>{talent.skillname}</td>
                    <td className="tasks-client">{talent.clientName}</td>
                    <td className="tasks-name">{talent.talentName}</td>
                    <td className="tasks-name">{talent.date}</td>
                    <td>
                      <div
                        className={`status-badge ${
                          talent.status ? talent.status.toLowerCase() : ""
                        }`}
                      >
                        {talent.status || "N/A"}
                      </div>
                    </td>
                    <td className="action-button">
                      <button onClick={() => handleView(talent?.bookingid)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && paginatedTasks.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &#60;
          </button>
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-number ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="pagination-btn"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            &#62;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
