import Swal from 'sweetalert2'

export default function Dashboard() {
  const handleAlert = () => {
    void Swal.fire({
      title: 'Hello!',
      text: 'SweetAlert2 is wired up.',
      icon: 'success',
      confirmButtonText: 'Nice',
      confirmButtonColor: '#0d9488',
    })
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Dashboard</h1>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleAlert}>
          Test Alert
        </button>
      </div>
      <p className="text-muted mb-0">Summary cards and quick actions go here.</p>
    </div>
  )
}

