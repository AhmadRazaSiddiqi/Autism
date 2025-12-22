import { useMemo, useState, useEffect } from "react";
import Swal from "sweetalert2";
import ApiService from "../services/ApiService";
import { useGlobal } from "../context/GlobalContext";
import "./Resources.css";

// Mock data removed for API integration

const CATEGORY_FILTERS = ["All", "Documents", "Videos", "Guides", "Links"];
const PAGE_SIZE = 5;

export default function Resources() {
  const { isLoading, isError, errorMessage } = useGlobal();
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // New resource state
  const [newResource, setNewResource] = useState({
    title: "",
    category: "Documents",
    type: "PDF",
    description: "",
    url: "",
  });

  useEffect(() => {
    fetchResources();
  }, [page, categoryFilter]);

  const fetchResources = async () => {
    try {
      const params = {
        page: page,
        per_page: PAGE_SIZE,
      };
      if (categoryFilter !== "All") {
        params.type = categoryFilter;
      }

      const response = await ApiService.getResources(params);
      setResources(response.data?.resources || []);
    } catch (err) {
      console.error(err);
      // Global error handler takes care of it
    }
  };

  const filteredResources = useMemo(() => {
    let list = [...resources];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.title?.toLowerCase().includes(term) ||
          r.category?.toLowerCase().includes(term) ||
          r.type?.toLowerCase().includes(term)
      );
    }

    // Newest first sorting (if date exists)
    list.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0).getTime();
      const dateB = new Date(b.date || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return list;
  }, [search, resources]);

  // For this simple integration, we'll keep the pagination buttons working
  // but since the API doesn't provide totalCount, we'll assume a large enough range
  // or just handle the current page items.
  const pageResources = filteredResources; // Already paginated by API (assuming search is local for now)
  const totalPages = page + (resources.length === PAGE_SIZE ? 1 : 0); // Dynamic total pages estimation

  const goToPage = (p) => {
    if (p < 1) return;
    setPage(p);
  };

  const handleCreateResource = async () => {
    const { title, category, type } = newResource;
    if (!title.trim()) {
      Swal.fire("Error", "Please enter a title", "error");
      return;
    }

    try {
      setCreating(true);
      await ApiService.createResource(newResource);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Resource created successfully",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowAddModal(false);
      setNewResource({
        title: "",
        category: "Documents",
        type: "PDF",
        description: "",
        url: "",
      });
      fetchResources();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to create resource", "error");
    } finally {
      setCreating(false);
    }
  };

  const getResourceMetric = (resource) => {
    if (resource.downloads)
      return `${resource.downloads.toLocaleString()} downloads`;
    if (resource.views) return `${resource.views.toLocaleString()} views`;
    if (resource.clicks) return `${resource.clicks.toLocaleString()} clicks`;
    return "-";
  };

  return (
    <div className="resources-page">
      <div className="container resources-container">
        <header className="resources-header">
          <h1 className="resources-title">Resources</h1>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddModal(true)}
          >
            Add Resource
          </button>
        </header>

        <div className="resources-filters-row">
          <div className="resources-search position-relative">
            <span className="material-symbols-outlined resources-search-icon">
              search
            </span>
            <input
              type="text"
              className="form-control resources-search-input"
              placeholder="Search resources..."
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
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
            >
              {CATEGORY_FILTERS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="resources-table-wrapper">
          <table className="table mb-0 resources-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Category</th>
                <th scope="col">Type</th>
                <th scope="col">Date</th>
                <th scope="col">Metrics</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-danger">
                    {errorMessage || "Failed to load resources."}
                  </td>
                </tr>
              ) : pageResources.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No resources found
                  </td>
                </tr>
              ) : (
                pageResources.map((resource) => (
                  <tr key={resource.id}>
                    <td>{resource.title}</td>
                    <td>{resource.category || resource.type}</td>
                    <td>{resource.type}</td>
                    <td>
                      {resource.date ||
                        (resource.createdAt
                          ? new Date(resource.createdAt).toLocaleDateString()
                          : "-")}
                    </td>
                    <td>{getResourceMetric(resource)}</td>
                    <td>
                      <span
                        className={`resources-status-pill ${
                          resource.status === "Active" || resource.is_active
                            ? "resources-status-pill--active"
                            : "resources-status-pill--inactive"
                        }`}
                      >
                        {resource.status ||
                          (resource.is_active ? "Active" : "Inactive")}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 me-2 resources-action-link"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 resources-action-link"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <nav className="resources-pagination" aria-label="Resources pagination">
          <button
            type="button"
            className="resources-page-btn"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
          >
            ‹
          </button>
          <span className="mx-3 text-muted">Page {page}</span>
          <button
            type="button"
            className="resources-page-btn"
            onClick={() => goToPage(page + 1)}
            disabled={resources.length < PAGE_SIZE}
          >
            ›
          </button>
        </nav>
      </div>

      {showAddModal && (
        <div className="resources-modal-backdrop">
          <div className="card resources-modal">
            <h2 className="resources-modal-title">Add Resource</h2>
            <div className="mb-3">
              <label className="form-label">Resource Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter resource title"
                value={newResource.title}
                onChange={(e) =>
                  setNewResource({ ...newResource, title: e.target.value })
                }
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newResource.category}
                  onChange={(e) =>
                    setNewResource({ ...newResource, category: e.target.value })
                  }
                >
                  <option>Documents</option>
                  <option>Videos</option>
                  <option>Guides</option>
                  <option>Links</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={newResource.type}
                  onChange={(e) =>
                    setNewResource({ ...newResource, type: e.target.value })
                  }
                >
                  <option>PDF</option>
                  <option>Video</option>
                  <option>Guide</option>
                  <option>External Link</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">URL / Link</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://..."
                value={newResource.url}
                onChange={(e) =>
                  setNewResource({ ...newResource, url: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Optional description"
                value={newResource.description}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="resources-modal-actions">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowAddModal(false)}
                disabled={creating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleCreateResource}
                disabled={creating}
              >
                {creating ? "Creating..." : "Add Resource"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
