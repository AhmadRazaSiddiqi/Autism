import React, { useState, useEffect } from "react";
import NavBar from "../Auth/common/NavBar";
import "../../../src/assets/css/talents.css";
import { CiSearch } from "react-icons/ci";
import deleteIcon from "../../../public/delete.svg";
import viewIcon from "../../../public/view.svg";
import ReStore from "../../../public/reset-14415.svg";
import ApiService from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { formatHumanDate } from "../../helpers/Helper";
import Swal from "sweetalert2";

const Talents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleView = (talent_id, profile_photo) =>
    navigate(`/talentprofile?id=${talent_id}`, {
      state: { profile: profile_photo },
    });

  // 🔹 Fetch talents API
      const fetchTalents = async () => {
      try {
        setLoading(true);
        const response = await ApiService.post("admin/talent"); // ✅ API endpoint
        setTalents(response?.data?.data?.talents || []);
      } catch (error) {
        console.error("Error fetching talents:", error);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {

    fetchTalents();
  }, []);

  // 🔹 Delete handler with SweetAlert
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This talent will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await ApiService.post("admin/softDeleteUser", { userId: id });

          if (response?.data?.success) {
            fetchTalents();
            Swal.fire("Deleted!", "Talent has been deleted.", "success");
            setTalents((prev) => prev.filter((t) => t.user?.id !== id));
          } else {
            fetchTalents();
            Swal.fire(
              "Error!",
              response?.data?.message || "Something went wrong.",
              "error"
            );
          }
        } catch (error) {
          Swal.fire("Error!", error.message || "API request failed.", "error");
        }
      }
    });
  };

  // 🔹 Filters
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredTalents = talents
    .filter((t) =>
      `${t.title || ""} ${t.client || ""} ${t.name || ""}`
        .toLowerCase()
        .includes(searchTerm?.toLowerCase())
    )
    .filter((t) => statusFilter === "All" || t?.user?.status === statusFilter);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTalents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTalents = filteredTalents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="talents-container">
      <NavBar />
      <div className="main-content">
        <div className="talents-title">Talents</div>

        <div className="control-section">
          <div className="search-box">
            <CiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search talents"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="filter">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <p>Loading talents...</p>
          ) : (
            <table className="talents-table">
              <thead>
                <tr>
                  <th>Talent Name</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Posted Date</th>
                  <th style={{ color: "#6d028e" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTalents.map((talent) => (
                  <tr key={talent.id}>
                    <td>{talent.full_name}</td>
                    <td className="talents-client">{talent.gender}</td>
                    <td className="talents-client">{talent?.user?.phone_number}</td>
                    <td className="talents-name">{talent.country}</td>
                    <td className="talents-name">{talent?.user?.email}</td>
                    <td>
                      <div
                        className={`status-badge ${talent.status ? talent.status.toLowerCase() : ""
                          }`}
                      >
                        {talent.status || "N/A"}
                      </div>
                    </td>
                    <td className="talents-name">{formatHumanDate(talent?.created_at)}</td>

                    <td className="action-button">
                      <button onClick={() => handleDelete(talent?.user?.id)}>
                        {!talent?.user?.deleted_at ? (
                          <img src={deleteIcon} alt="Delete" />
                        ) : (
                          <img src={ReStore} width={20} alt="ReStore" />
                        )}

                        
                      </button>
                      <button
                        onClick={() =>
                          handleView(talent?.user?.id, talent.profile_photo)
                        }
                      >
                        <img src={viewIcon} alt="View" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

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
                className={`pagination-number ${currentPage === page ? "active" : ""
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

export default Talents;
