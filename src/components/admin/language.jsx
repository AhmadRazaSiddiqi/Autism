import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "../../assets/css/clients.css";
import "../../assets/css/skill.css";
import NavBar from "../Auth/common/NavBar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../../public/delete.svg";
import editIcon from "../../../public/edit-file.svg";
import { formatHumanDate } from "../../helpers/Helper";
import ApiService from "../../services/ApiService";

function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortDate, setSortDate] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  // For Create/Update Modal
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [formData, setFormData] = useState({ name: "", status: "pending" });

  const navigate = useNavigate();

  // Fetch clients/skills
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get("admin/language");
      setClients(response?.data?.data?.languages || response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      Swal.fire("Error!", "Failed to fetch skills", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter + sort
  const filteredClients = clients
    .filter((client) => {
      const name = client?.name || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter((client) => statusFilter === "All" || client?.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a?.createdAt || 0);
      const dateB = new Date(b?.createdAt || 0);
      return sortDate === "desc" ? dateB - dateA : dateA - dateB;
    });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Create / Update form open
  const openModal = (client = null) => {
    if (client) {
      setEditClient(client);
      setFormData({
        name: client.name || "",
        status: client.status || "pending"
      });
    } else {
      setEditClient(null);
      setFormData({ name: "", status: "pending" });
    }
    setShowModal(true);
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editClient) {
        response = await ApiService.put(`admin/language/${editClient.id}`, formData);
      } else {
        response = await ApiService.post("admin/language", formData);
      }

      if (response?.data?.status == true) {
        Swal.fire("Success!", editClient ? "Language updated" : "Language created", "success");
        fetchClients();
        setShowModal(false);
        
      } else {
        Swal.fire("Success!", response?.data?.message || "Something went wrong.", "success");
      }
    } catch (err) {
      Swal.fire("Error!", err.response?.data?.message || err.message || "Something went wrong", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This Language will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await ApiService.delete(`admin/language/${id}`);
          if (response?.data?.status == true) {
            fetchClients();
            Swal.fire("Deleted!", "Language has been deleted.", "success");
            
          } else {
            Swal.fire("Success!", response?.data?.message || "Something went wrong.", "success");
          }
        } catch (error) {
          Swal.fire("Error!", error.response?.data?.message || error.message || "API request failed.", "error");
        }
      }
    });
  };

  return (
    <div className="clients-container">
      <NavBar />
      <div className="main-content">
        <div className="clients-title d-flex justify-content-between align-items-center">
          <span>language</span>
        </div>

        {/* Search + Filters */}
        <div className="control-section">
          <div className="search-box">
            <CiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Languages"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

        </div>
        <button className="btn btn-success float-end p-2 my-2" onClick={() => openModal()}>
          + Add Language
        </button>
        {/* Table */}
        <div className="table-container">
          {loading ? (
            <p>Loading Languages...</p>
          ) : (
            <table className="clients-table table table-bordered">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client) => (
                  <tr key={client?.id}>
                    <td>#{client?.id}</td>
                    <td>{client?.name || "N/A"}</td>

                    <td>{formatHumanDate(client?.createdAt, "date") || "N/A"}</td>
                    <td>{formatHumanDate(client?.updatedAt, "date") || "N/A"}</td>
                    <td className="action-button">
                      <button
                        className=" me-2"
                        onClick={() => openModal(client)}
                        title="Edit"
                      >
                        <img src={editIcon} alt="Edit" width={20} />
                      </button>
                      <button
                        className=" me-2"
                        onClick={() => handleDelete(client?.id)}
                        title="Delete"
                      >
                        <img src={deleteIcon} alt="Delete" width={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedClients.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">No Language found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
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
                  className={`pagination-number ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="pagination-btn next-btn"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &#62;
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content-custom animate__animated animate__fadeInDown">
            <div className="modal-header">
              <h5 className="modal-title">{editClient ? "Edit Language" : "Add Language"}</h5>
              <button type="button" className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Language Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Language name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button type="submit" className="btn btn-success">
                  {editClient ? "Update Language" : "Create Language"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;