export default function ContactUs() {
  return (
    <div className="container py-4">
      <h1 className="h4 mb-3">Contact Us</h1>
      <p className="text-muted">
        Need help? Reach us at <a href="mailto:support@example.com">support@example.com</a>.
      </p>
      <form className="vstack gap-3 mt-3">
        <div>
          <label className="form-label">Subject</label>
          <input className="form-control" placeholder="Subject" />
        </div>
        <div>
          <label className="form-label">Message</label>
          <textarea className="form-control" rows="4" placeholder="How can we help?" />
        </div>
        <button type="button" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  )
}

