import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ApiService from "../services/ApiService";
import { useGlobal } from "../context/GlobalContext";
import "./Quizzes.css";

const STATUS_FILTERS = ["All", "Active", "Inactive"];
const PAGE_SIZE = 5;

export default function Quizzes() {
  const navigate = useNavigate();
  const { isLoading, isError, errorMessage } = useGlobal();
  const [quizzes, setQuizzes] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await ApiService.getQuizzes();
      // Safely handle different response structures
      const data = response.data;
      if (Array.isArray(data)) {
        setQuizzes(data);
      } else if (data && Array.isArray(data.quizzes)) {
        setQuizzes(data.quizzes);
      } else {
        setQuizzes([]);
      }
    } catch (err) {
      console.error(err);
      // Global context handles error state
    }
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(quizzes)) return [];
    let list = [...quizzes];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(
        (q) =>
          (q.title && q.title.toLowerCase().includes(term)) ||
          (q.description && q.description.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== "All") {
      const isActive = statusFilter === "Active";
      list = list.filter((q) => q.isActive === isActive);
    }

    list.sort((a, b) => {
      const dateA = a.createdAt || a.created_at || "0";
      const dateB = b.createdAt || b.created_at || "0";
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    return list;
  }, [search, statusFilter, quizzes]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const [creating, setCreating] = useState(false);

  const handleCreateQuiz = async () => {
    const title = newTitle.trim();
    if (!title) return;

    try {
      setCreating(true);
      await ApiService.createQuiz({ title });
      setShowModal(false);
      setNewTitle("");
      Swal.fire({
        icon: "success",
        title: "Created!",
        text: "Quiz created successfully.",
        timer: 2000,
        showConfirmButton: true,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to create quiz.", "error");
    } finally {
      setCreating(false);
      fetchQuizzes();
    }
  };

  return (
    <div className="quizzes-page">
      <div className="container quizzes-container">
        <header className="quizzes-header">
          <h1 className="quizzes-title">Quizzes</h1>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowModal(true)}
          >
            Add quiz
          </button>
        </header>

        <div className="quizzes-filters-row">
          <div className="quizzes-search position-relative">
            <span className="material-symbols-outlined quizzes-search-icon">
              search
            </span>
            <input
              type="text"
              className="form-control quizzes-search-input"
              placeholder="Search quizzes..."
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
              {STATUS_FILTERS.map((label) => (
                <option key={label} value={label}>
                  {label}
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
            <div className="mt-2 text-muted">Loading quizzes...</div>
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
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <div className="text-muted mb-3">
              <span className="material-symbols-outlined fs-1">inbox</span>
            </div>
            <h4>No quizzes found</h4>
            <p className="text-muted">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="quizzes-table-wrapper">
              <table className="table mb-0 quizzes-table">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Status</th>
                    <th scope="col">Created At</th>
                    <th scope="col" className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((quiz) => (
                    <tr key={quiz.id}>
                      <td>{quiz.title}</td>
                      <td>{quiz.description || "-"}</td>
                      <td>
                        <span
                          className={`quizzes-status-pill ${
                            quiz.isActive
                              ? "quizzes-status-pill--active"
                              : "quizzes-status-pill--inactive"
                          }`}
                        >
                          {quiz.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {quiz.createdAt
                          ? new Date(quiz.createdAt).toLocaleDateString()
                          : quiz.created_at
                          ? new Date(quiz.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="text-end">
                        <Link
                          to={`/quizdetails?quizId=${quiz.id}`}
                          className="quizzes-view-link text-decoration-none"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <nav className="quizzes-pagination" aria-label="Quizzes pagination">
              <button
                type="button"
                className="quizzes-page-btn"
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
                    className={`quizzes-page-btn ${
                      p === currentPage ? "quizzes-page-btn--active" : ""
                    }`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                type="button"
                className="quizzes-page-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </nav>
          </>
        )}
      </div>

      {showModal && (
        <div className="quizzes-modal-backdrop">
          <div className="card quizzes-modal">
            <h2 className="quizzes-modal-title">Create quiz</h2>
            <div className="mb-3">
              <label className="form-label">Quiz title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter quiz title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Quiz description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter quiz description"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Quiz title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter quiz title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="quizzes-modal-actions">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setShowModal(false);
                  setNewTitle("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleCreateQuiz}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
