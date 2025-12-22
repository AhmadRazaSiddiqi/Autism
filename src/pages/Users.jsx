import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ApiService from "../services/ApiService";
import { useGlobal } from "../context/GlobalContext";
import "./Users.css";

const STATUS_OPTIONS = ["All", "public", "private"]; // updated to match profileVisibility
const DATE_SORT_OPTIONS = ["Newest", "Oldest"];
const PAGE_SIZE = 5;

export default function Users() {
  const { isLoading, isError, errorMessage } = useGlobal();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateSort, setDateSort] = useState("Newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await ApiService.getUsers();
      const data = response.data?.users || response.data || [];
      // Filter out admins immediately
      const nonAdmins = Array.isArray(data)
        ? data.filter((u) => u.role !== "admin")
        : [];
      setUsers(nonAdmins);
    } catch (err) {
      console.error(err);
      // Global context handles error
    }
  };

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    let list = [...users];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "All") {
      list = list.filter((u) => u.profileVisibility === statusFilter);
    }

    list.sort((a, b) => {
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return dateSort === "Newest" ? bDate - aDate : aDate - bDate;
    });

    return list;
  }, [search, statusFilter, dateSort, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await ApiService.deleteUser(id);
        Swal.fire("Deleted!", "User has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete user.", "error");
      } finally {
        fetchUsers();
      }
    }
  };

  return (
    <div className="users-page">
      <div className="container users-container">
        <header className="users-header">
          <h1 className="users-title">Users</h1>
        </header>

        <div className="users-filters-row">
          <div className="users-search position-relative">
            <span className="material-symbols-outlined users-search-icon">
              search
            </span>
            <input
              type="text"
              className="form-control users-search-input"
              placeholder="Search users"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "All" ? "Status" : opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="form-select"
              value={dateSort}
              onChange={(e) => {
                setDateSort(e.target.value);
                setPage(1);
              }}
            >
              {DATE_SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "Newest" ? "Date (Newest)" : "Date (Oldest)"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="mt-2 text-muted">Loading users...</div>
          </div>
        ) : isError ? (
          <div className="text-center py-5">
            <div className="text-danger mb-3">
              <span className="material-symbols-outlined fs-1">
                error_outline
              </span>
            </div>
            <h4 className="text-danger">Error loading data</h4>
            <p className="text-muted">
              {errorMessage || "Something went wrong."}
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-5">
            <div className="text-muted mb-3">
              <span className="material-symbols-outlined fs-1">group_off</span>
            </div>
            <h4>No users found</h4>
            <p className="text-muted">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="users-table-wrapper">
              <table className="table mb-0 users-table">
                <thead>
                  <tr>
                    <th scope="col">Client</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Joined Date</th>
                    <th scope="col" className="text-end">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </td>
                      <td>
                        <span
                          className={`users-status-pill ${
                            user.profileVisibility === "public"
                              ? "users-status-pill--active"
                              : "users-status-pill--inactive"
                          }`}
                        >
                          {user.profileVisibility || "private"}
                        </span>
                      </td>
                      <td>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <div className="users-actions">
                          <button
                            type="button"
                            className="users-action-btn"
                            aria-label="Delete user"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <span className="material-symbols-outlined users-action-icon">
                              delete
                            </span>
                          </button>
                          <Link
                            to={`/userdetails?userId=${user.id}`}
                            className="users-action-btn"
                            aria-label="View user"
                          >
                            <span className="material-symbols-outlined users-action-icon">
                              visibility
                            </span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <nav className="users-pagination" aria-label="Users pagination">
              <button
                type="button"
                className="users-page-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    type="button"
                    className={`users-page-btn ${
                      p === currentPage ? "users-page-btn--active" : ""
                    }`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                type="button"
                className="users-page-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}
