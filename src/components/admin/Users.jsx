import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "../../assets/css/clients.css";
import NavBar from "../Auth/common/NavBar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import deleteIcon from "../../../public/delete.svg";
import viewIcon from "../../../public/view.svg";
import ReStore from "../../../public/reset-14415.svg";
import { formatHumanDate } from "../../helpers/Helper";
import ApiService from "../../services/ApiService"; // Make sure your ApiService is correctly imported

function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortDate, setSortDate] = useState("Date");
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch clients from API
      const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await ApiService.post("admin/client"); // Replace with your API endpoint
        setClients(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {

    fetchClients();
  }, []);

  // Filter and sort clients safely
  const filteredClients = clients
    .filter((client) => {
      const name = client?.name || client?.username || "";
      const email = client?.email || "";
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter((client) => statusFilter === "All" || client?.status === statusFilter)
    .sort((a, b) => {
      // Use the actual date property from your API response
      const dateA = new Date(a?.userInfo?.created_at || a?.date || 0);
      const dateB = new Date(b?.userInfo?.created_at || b?.date || 0);

      if (sortDate === "desc") {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleView = (user_id, profile_photo) => {
    navigate(`/userdetails?id=${user_id}`, { state: { profile_photo } });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This client will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await ApiService.post("admin/softDeleteUser", { userId: id });

          if (response?.data?.success) {
            Swal.fire("Deleted!", "Client has been deleted.", "success");
            // remove from UI without reload
            fetchClients();
            setClients((prev) => prev.filter((c) => c.id !== id));
          } else {
            fetchClients();

            Swal.fire("Error!", response?.data?.message || "Something went wrong.", "error");
          }
        } catch (error) {
          Swal.fire("Error!", error.message || "API request failed.", "error");
        }
      }
    });
  };
  return (
    <div className="clients-container">
      <NavBar />
      <div className="main-content">
        <div className="clients-title">Users</div>

        <div className="control-section">
          <div className="search-box">
            <CiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search clients"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

            <select
              value={sortDate}
              onChange={(e) => setSortDate(e.target.value)}
              className="filter-select"
            >
              <option value="All">Date</option>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          {loading ? ( // ✅ optional: show loading state
            <p>Loading clients...</p>
          ) :
            (<table className="clients-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Quiz Taken</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client) => (
                  <tr key={client?.id || Math.random()}>
                    <td>{client?.username || "N/A"}</td>
                    <td>{client?.phone_number || "N/A"}</td>
                    <td>{client?.email || "N/A"}</td>
                    <td>
                      <div
                        className={`status-badge ${client.status ? client.status.toLowerCase() : ""
                          }`}
                      >
                        {client.status || "N/A"}
                      </div>
                    </td>

                    <td>
                      {formatHumanDate(client?.userInfo?.created_at, "date") ||
                        "N/A"}
                    </td>
                    <td className="action-button">
                      <button onClick={() => handleDelete(client?.id)}>
                         {!client?.deleted_at ? (
                            <img src={deleteIcon} alt="Delete" />
                             ) : (
                            <img src={ReStore} width={20} alt="ReStore" />
                        )}

                      </button>
                      <button
                        onClick={() =>
                          handleView(client?.id, client?.userInfo?.profile_photo)
                        }
                      >
                        <img src={viewIcon} alt="View" />
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedClients.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No clients found
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>)}
        </div>

        <div className="pagination-container">
          <button
            className="pagination-btn prev-btn"
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
            className="pagination-btn next-btn"
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
}

export default Users;
