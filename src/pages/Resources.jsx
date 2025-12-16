import { useMemo, useState } from 'react'
import './Resources.css'

const allResources = [
  {
    id: 'r1',
    title: 'Autism Screening Guidelines',
    category: 'Documents',
    type: 'PDF',
    date: '2024-01-15',
    downloads: 1240,
    status: 'Active',
  },
  {
    id: 'r2',
    title: 'Introduction to Early Detection',
    category: 'Videos',
    type: 'Video',
    date: '2024-01-10',
    views: 3420,
    status: 'Active',
  },
  {
    id: 'r3',
    title: 'Assessment Best Practices',
    category: 'Guides',
    type: 'Guide',
    date: '2024-01-08',
    downloads: 890,
    status: 'Active',
  },
  {
    id: 'r4',
    title: 'Research Portal',
    category: 'Links',
    type: 'External Link',
    date: '2024-01-05',
    clicks: 2150,
    status: 'Active',
  },
  {
    id: 'r5',
    title: 'Parent Resources Handbook',
    category: 'Documents',
    type: 'PDF',
    date: '2023-12-20',
    downloads: 2100,
    status: 'Active',
  },
  {
    id: 'r6',
    title: 'Training Workshop Series',
    category: 'Videos',
    type: 'Video',
    date: '2023-12-15',
    views: 1890,
    status: 'Active',
  },
  {
    id: 'r7',
    title: 'Quick Reference Card',
    category: 'Guides',
    type: 'Guide',
    date: '2023-12-10',
    downloads: 1560,
    status: 'Active',
  },
  {
    id: 'r8',
    title: 'Community Support Forum',
    category: 'Links',
    type: 'External Link',
    date: '2023-12-05',
    clicks: 980,
    status: 'Inactive',
  },
]

const CATEGORY_FILTERS = ['All', 'Documents', 'Videos', 'Guides', 'Links']
const PAGE_SIZE = 5

export default function Resources() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredResources = useMemo(() => {
    let list = [...allResources]

    if (search.trim()) {
      const term = search.trim().toLowerCase()
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.category.toLowerCase().includes(term) ||
          r.type.toLowerCase().includes(term),
      )
    }

    if (categoryFilter !== 'All') {
      list = list.filter((r) => r.category === categoryFilter)
    }

    // newest first
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return list
  }, [search, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filteredResources.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageResources = filteredResources.slice(startIndex, startIndex + PAGE_SIZE)

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  const getResourceMetric = (resource) => {
    if (resource.downloads) return `${resource.downloads.toLocaleString()} downloads`
    if (resource.views) return `${resource.views.toLocaleString()} views`
    if (resource.clicks) return `${resource.clicks.toLocaleString()} clicks`
    return '-'
  }

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
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>

          <div>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setPage(1)
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
              {pageResources.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No resources found
                  </td>
                </tr>
              ) : (
                pageResources.map((resource) => (
                  <tr key={resource.id}>
                    <td>{resource.title}</td>
                    <td>{resource.category}</td>
                    <td>{resource.type}</td>
                    <td>{resource.date}</td>
                    <td>{getResourceMetric(resource)}</td>
                    <td>
                      <span
                        className={`resources-status-pill ${
                          resource.status === 'Active'
                            ? 'resources-status-pill--active'
                            : 'resources-status-pill--inactive'
                        }`}
                      >
                        {resource.status}
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
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const p = idx + 1
            return (
              <button
                key={p}
                type="button"
                className={`resources-page-btn ${
                  p === currentPage ? 'resources-page-btn--active' : ''
                }`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            )
          })}
          <button
            type="button"
            className="resources-page-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
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
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select className="form-select">
                  <option>Documents</option>
                  <option>Videos</option>
                  <option>Guides</option>
                  <option>Links</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Type</label>
                <select className="form-select">
                  <option>PDF</option>
                  <option>Video</option>
                  <option>Guide</option>
                  <option>External Link</option>
                </select>
              </div>
            </div>
            <div className="resources-modal-actions">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddModal(false)}
              >
                Add Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
