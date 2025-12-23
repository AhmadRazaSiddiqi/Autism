import { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import Swal from "sweetalert2";
import ApiService from "../services/ApiService";
import { useGlobal } from "../context/GlobalContext";
import "./QuizDetails.css";

const RECENT_SUBMISSIONS = [
  {
    id: "U1045",
    date: "2024-01-25 09:45 AM",
    score: 85,
    status: "Completed",
  },
  {
    id: "U1089",
    date: "2024-01-24 03:20 PM",
    score: 65,
    status: "Completed",
  },
];

const ACTIVITY_BARS = [
  40, 52, 38, 61, 47, 70, 55, 63, 49, 68, 57, 72, 51, 60, 44, 66, 58, 73, 62,
  69, 53, 64, 59, 71,
];

export default function QuizDetails() {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("quizId");
  const id = queryId || paramId;

  const { isLoading, isError, errorMessage } = useGlobal();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("Multiple Choice");
  const [newQuestionSubscale, setNewQuestionSubscale] = useState(
    "Social Communication"
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editMaxScore, setEditMaxScore] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const handleEditQuiz = () => {
    if (!quiz) return;
    setEditTitle(quiz.title || "");
    setEditDescription(quiz.description || "");
    setEditMaxScore(quiz.maxScore || "");
    setEditIsActive(quiz.isActive);
    setEditImage(null);
    setEditImagePreview(
      quiz.image
        ? quiz.image.startsWith("http")
          ? quiz.image
          : `${import.meta.env.VITE_API_BASE_URL}${quiz.image}`
        : null
    );
    setShowEditModal(true);
  };

  const saveEditQuiz = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("description", editDescription);
      formData.append("maxScore", editMaxScore);
      formData.append("isActive", editIsActive);
      if (editImage) {
        formData.append("image", editImage);
      }

      await ApiService.updateQuiz(id, formData);
      setShowEditModal(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Quiz updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update quiz.", "error");
    } finally {
      fetchQuizDetails();
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuizDetails();
    }
  }, [id]);

  const fetchQuizDetails = async () => {
    try {
      const response = await ApiService.getQuizDetails(id);
      const questionsResponse = await ApiService.getQuizQuestions(id);
      const data = response.data;
      const questionsData = questionsResponse?.data?.quiz?.Questions;
      console.log("questionsData", questionsData);
      if (data.quiz) {
        setQuiz(data.quiz);
        setQuestions(questionsData || []);
      } else if (data) {
        setQuiz(data);
        setQuestions(questionsData || []);
      }
    } catch (err) {
      console.error("Error fetching quiz details:", err);
    }
  };

  const navigate = useNavigate();

  const handleDeleteQuiz = async () => {
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
        await ApiService.deleteQuiz(id);
        Swal.fire("Deleted!", "Quiz has been deleted.", "success");
        navigate("/quizzes");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete quiz.", "error");
        fetchQuizDetails();
      }
    }
  };

  const handleToggleStatus = async () => {
    if (!quiz) return;
    const newStatus = !quiz.isActive;

    const result = await Swal.fire({
      title: "Confirmation",
      text: `Are you sure you want to ${
        newStatus ? "activate" : "deactivate"
      } this quiz?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        await ApiService.updateQuiz(id, { isActive: newStatus });
        Swal.fire({
          icon: "success",
          title: "Status Updated",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to update status.", "error");
      } finally {
        fetchQuizDetails();
      }
    }
  };

  const handleAddQuestion = () => {
    const text = newQuestionText.trim();
    if (!text) return;

    const nextOrder = questions.length + 1;
    const newQuestion = {
      id: `q-${Date.now()}`,
      order: nextOrder,
      text,
      type: newQuestionType,
      subscale: newQuestionSubscale,
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setShowAddModal(false);
    setNewQuestionText("");
    setNewQuestionType("Multiple Choice");
    setNewQuestionSubscale("Social Communication");
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewQuestionText("");
    setNewQuestionType("Multiple Choice");
    setNewQuestionSubscale("Social Communication");
  };

  if (isLoading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (isError)
    return <div className="p-5 text-center text-danger">{errorMessage}</div>;
  if (!quiz && !isLoading)
    return <div className="p-5 text-center">Quiz not found</div>;

  return (
    <div className="quizdetails-page">
      <div className="container quizdetails-container">
        <header className="quizdetails-header">
          <div>
            <h1 className="quizdetails-title">{quiz.title}</h1>
            <p className="quizdetails-subtitle">
              {quiz.description || "No description provided"}
            </p>
          </div>
          <Link to="/quizzes" className="btn btn-outline-secondary btn-sm">
            Back to quizzes
          </Link>
        </header>

        <section className="quizdetails-top-row">
          <div className="card quizdetails-card quizdetails-card--details">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
                <h2 className="quizdetails-card-title mb-0">Quiz Details</h2>
                {quiz.image && (
                  <img
                    src={
                      quiz.image.startsWith("http")
                        ? quiz.image
                        : `${import.meta.env.VITE_API_BASE_URL}${quiz.image}`
                    }
                    alt={quiz.title}
                    className="quiz-details-image"
                  />
                )}
              </div>

              <dl className="quizdetails-meta-grid">
                <div>
                  <dt>Description</dt>
                  <dd>{quiz.description || "-"}</dd>
                </div>
                <div>
                  <dt>Slug</dt>
                  <dd>
                    <span className="quizdetails-pill">{quiz.slug || "-"}</span>
                  </dd>
                </div>
                <div>
                  <dt>Max Score</dt>
                  <dd>{quiz.maxScore || 0}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span
                      className={`quizdetails-status-dot ${
                        quiz.isActive ? "" : "bg-secondary"
                      }`}
                      style={{
                        backgroundColor: quiz.isActive ? "#10b981" : "#6b7280",
                      }} // quick fallback style
                    />
                    {quiz.isActive ? " Active" : " Inactive"}
                  </dd>
                </div>
                <div>
                  <dt>Created At</dt>
                  <dd>
                    {quiz.createdAt
                      ? new Date(quiz.createdAt).toLocaleString()
                      : "-"}
                  </dd>
                </div>
                <div>
                  <dt>Updated At</dt>
                  <dd>
                    {quiz.updatedAt
                      ? new Date(quiz.updatedAt).toLocaleString()
                      : "-"}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                className="btn btn-outline-primary btn-sm mt-3"
                onClick={handleEditQuiz}
              >
                Edit Quiz
              </button>
            </div>
          </div>

          <div className="card quizdetails-card quizdetails-card--performance">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="quizdetails-card-title mb-0">
                  Performance Overview
                </h2>
                <span className="quizdetails-card-caption">
                  Recent Activity (Last 30 Days)
                </span>
              </div>

              <div className="quizdetails-stats-row">
                <div>
                  <p className="quizdetails-metric-label">Total Times Taken</p>
                  <p className="quizdetails-metric-value">4,520</p>
                </div>
                <div>
                  <p className="quizdetails-metric-label">Average Score</p>
                  <p className="quizdetails-metric-value">78.5</p>
                </div>
                <div>
                  <p className="quizdetails-metric-label">Completion Rate</p>
                  <p className="quizdetails-metric-value">92%</p>
                </div>
              </div>

              <div className="quizdetails-activity-chart">
                {ACTIVITY_BARS.map((value, idx) => (
                  <div
                    // index is fine for static demo data
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    className="quizdetails-activity-bar"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="quizdetails-section">
          <div className="quizdetails-section-header">
            <h2 className="quizdetails-section-title">Questions Summary</h2>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddModal(true)}
            >
              Add Question
            </button>
          </div>

          <div className="quizdetails-table-wrapper">
            <table className="table mb-0 quizdetails-table">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Question Text</th>
                  <th scope="col">Question Type</th>
                  <th scope="col">Subscale</th>
                  <th scope="col">QuestionOrder</th>
                  <th scope="col">Created At</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {console.log(questions)}
                {questions && questions.length > 0 ? (
                  questions.map((q) => (
                    <tr key={q.id}>
                      <td>{q.id}</td>
                      <td>{q.questionText || q.text}</td>
                      <td>{q.questionType || q.type}</td>
                      <td>{q.subscale}</td>
                      <td>{q.questionOrder}</td>
                      <td>{q.createdAt}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 me-2 quizdetails-inline-link"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 quizdetails-inline-link"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center">
                      No Questions Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="quizdetails-section">
          <div className="quizdetails-section-header">
            <h2 className="quizdetails-section-title">
              Recent Assessment Submissions
            </h2>
          </div>

          <div className="quizdetails-table-wrapper">
            <table className="table mb-0 quizdetails-table">
              <thead>
                <tr>
                  <th scope="col">User ID</th>
                  <th scope="col">Date</th>
                  <th scope="col">Score</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {RECENT_SUBMISSIONS.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.date}</td>
                    <td>{row.score}</td>
                    <td>
                      <span className="quizdetails-status-pill quizdetails-status-pill--success">
                        {row.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 quizdetails-inline-link"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="quizdetails-footer-actions">
            <button type="button" className="btn btn-outline-secondary btn-sm">
              Export Data
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleToggleStatus}
            >
              {quiz?.isActive ? "Deactivate Quiz" : "Activate Quiz"}
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleDeleteQuiz}
            >
              Delete Quiz
            </button>
          </div>
        </section>
      </div>

      {showAddModal && (
        <div className="quizdetails-modal-backdrop">
          <div className="card quizdetails-modal">
            <h2 className="quizdetails-modal-title">Add Question</h2>
            <div className="mb-3">
              <label className="form-label">Question text</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter the question text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={newQuestionType}
                  onChange={(e) => setNewQuestionType(e.target.value)}
                >
                  <option>Multiple Choice</option>
                  <option>Yes/No</option>
                  <option>Scale 1–5</option>
                  <option>Free Text</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Subscale</label>
                <select
                  className="form-select"
                  value={newQuestionSubscale}
                  onChange={(e) => setNewQuestionSubscale(e.target.value)}
                >
                  <option>Social Communication</option>
                  <option>Restricted/Repetitive</option>
                  <option>Sensory</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="quizdetails-modal-actions">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleAddQuestion}
              >
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="quizdetails-modal-backdrop">
          <div className="card quizdetails-modal">
            <h2 className="quizdetails-modal-title">Edit Quiz</h2>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Max Score</label>
              <input
                type="number"
                className="form-control"
                value={editMaxScore}
                onChange={(e) => setEditMaxScore(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Quiz image</label>
              <div className="d-flex flex-column gap-2">
                {editImagePreview && (
                  <div className="quiz-image-preview-container">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="quiz-image-preview"
                    />
                    <button
                      type="button"
                      className="quiz-image-remove-btn"
                      onClick={() => {
                        setEditImage(null);
                        setEditImagePreview(null);
                      }}
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditImage(file);
                      setEditImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <div className="d-flex align-items-center justify-content-between w-100">
                <span
                  className={`quizzes-toggle-label ${
                    editIsActive
                      ? "quizzes-toggle-label--active"
                      : "quizzes-toggle-label--inactive"
                  }`}
                >
                  {editIsActive ? "Active" : "InActive"}
                </span>
                <label className="quizzes-toggle-switch">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                  />
                  <span className="quizzes-toggle-slider"></span>
                </label>
              </div>
            </div>
            <div className="quizdetails-modal-actions">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={saveEditQuiz}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
