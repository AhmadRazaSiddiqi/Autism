import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "../../assets/css/clients.css";
import "../../assets/css/skill.css";
import NavBar from "../Auth/common/NavBar";
import Swal from "sweetalert2";
import { formatHumanDate } from "../../helpers/Helper";
import ApiService from "../../services/ApiService";
import viewIcon from "../../../public/view.svg";
import deleteIcon from "../../../public/delete.svg";

function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDate, setSortDate] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [viewClient, setViewClient] = useState(null);

  // Fetch contacts
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get("admin/contactList");
      setClients(response?.data?.data?.data ?? []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      Swal.fire("Error!", "Failed to fetch contacts", "error");
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
      const name = client?.contact_name || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    })
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
  }, [searchTerm]);
const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This Contact will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await ApiService.delete(`admin/contact/${id}`);
          if (response?.data?.status == true) {
            fetchClients();
            Swal.fire("Deleted!", "Contact has been deleted.", "success");
            
          } else {
            Swal.fire("Success!", response?.data?.message || "Something went wrong.", "success");
          }
        } catch (error) {
          Swal.fire("Error!", error.response?.data?.message || error.message || "API request failed.", "error");
        }
      }
    });
  };

  // Open modal for view
  const openModal = (client) => {
    setViewClient(client);
    setShowModal(true);
  };

  return (<div className="clients-container"> <NavBar /> <div className="main-content"> <div className="clients-title d-flex justify-content-between align-items-center"> <span>Contact Messages</span> </div>

    {/* Search */}
    <div className="control-section">
      <div className="search-box">
        <CiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search Contact"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
    </div>

    {/* Table */}
    <div className="table-container">
      {loading ? (
        <p>Loading contacts...</p>
      ) : (
        <table className="clients-table table table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Submitted By</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClients.map((client) => (
              <tr key={client?.id}>
                <td>#{client?.id}</td>
                <td>{client?.contact_name || "N/A"}</td>
                <td>{client?.contact_email || "N/A"}</td>
                <td>{client?.username || "N/A"}</td>
                <td>{formatHumanDate(client?.createdAt, "date") || "N/A"}</td>
                <td className="action-button">
                  <button className="me-2" onClick={() => openModal(client)} title="View">
                    <img src={viewIcon} alt="View" width={20} />
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
                <td colSpan="6" className="text-center">
                  No contacts found
                </td>
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

    {/* View Modal */}
    {showModal && viewClient && (
      <div className="modal-overlay">
        <div className="modal-content-custom animate__animated animate__fadeInDown">
          <div className="modal-header">
            <h5 className="modal-title">Contact Details</h5>
            <button type="button" className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <p><strong>ID:</strong> #{viewClient?.id}</p>
            <p><strong>Name:</strong> {viewClient?.contact_name || "N/A"}</p>
            <p><strong>Email:</strong> {viewClient?.contact_email || "N/A"}</p>
            <p><strong>Subject:</strong> {viewClient?.subject || "N/A"}</p>
            <p><strong>Message:</strong> {viewClient?.message || "N/A"}</p>
            <p><strong>Submitted By:</strong> {viewClient?.username || "N/A"}</p>
            <p><strong>Created At:</strong> {formatHumanDate(viewClient?.createdAt, "dateTime")}</p>
            <p><strong>Updated At:</strong> {formatHumanDate(viewClient?.updatedAt, "dateTime")}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}

export default Clients;