import React, { useState } from "react";
import {
  Bell,
  User,
  X,
  Trash2,
  GripVertical,
  Eye,
  Save,
  Plus,
} from "lucide-react";
import "../../assets/css/quizeditor.css";
import NavBar from "../Auth/common/NavBar.jsx";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

const QuizEditor = () => {
  const [quizData, setQuizData] = useState({
    title: "Neuroscience 101",
    description:
      "An introductory quiz on the fundamental concepts of neuroscience.",
    urlSlug: "neuroscience-101",
    maxScore: 100,
    isActive: true,
  });

  const [editingQuestion, setEditingQuestion] = useState({
    text: "Which part of the neuron is primarily responsible for receiving signals from other neurons?",
    order: 1,
    type: "Multiple Choice",
    subscale: "Cellular Neurobiology",
    options: [
      { id: 1, text: "Dendrite", points: 10 },
      { id: 2, text: "Axon", points: 0 },
    ],
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const [showEditPanel, setShowEditPanel] = useState(true);

  const handleQuizChange = (field, value) => {
    setQuizData({ ...quizData, [field]: value });
    setHasUnsavedChanges(true);
  };

  const handleQuestionChange = (field, value) => {
    setEditingQuestion({ ...editingQuestion, [field]: value });
    setHasUnsavedChanges(true);
  };

  const handleOptionChange = (id, field, value) => {
    setEditingQuestion({
      ...editingQuestion,
      options: editingQuestion.options.map((opt) =>
        opt.id === id ? { ...opt, [field]: value } : opt
      ),
    });
    setHasUnsavedChanges(true);
  };

  const addOption = () => {
    const newId = Math.max(...editingQuestion.options.map((o) => o.id), 0) + 1;
    setEditingQuestion({
      ...editingQuestion,
      options: [...editingQuestion.options, { id: newId, text: "", points: 0 }],
    });
    setHasUnsavedChanges(true);
  };
  const onDragEnd = (result) => {
    // Implement reordering logic here
    if (!result.destination) return;
    console.log("Drag ended:", result);
    // You would typically use array reordering logic (e.g., splice) here
    // and update setEditingQuestion.options
  };
  const deleteOption = (id) => {
    setEditingQuestion({
      ...editingQuestion,
      options: editingQuestion.options.filter((opt) => opt.id !== id),
    });
    setHasUnsavedChanges(true);
  };

  const closeEditPanel = () => {
    setShowEditPanel(false);
  };

  const saveQuestion = () => {
    console.log("Saving question:", editingQuestion);
    setHasUnsavedChanges(false);
  };

  const cancelEdit = () => {
    setShowEditPanel(false);
  };

  const saveQuiz = () => {
    console.log("Saving quiz:", quizData);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="quiz-editor-container">
      <NavBar />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Left Section */}
          <div className="left-section">
            {/* Page Header */}
            <div className="section-header">
              <div className="header-text">
                <h1 className="page-title">Edit Quiz: Neuroscience 101</h1>
                <p className="page-subtitle">
                  Modify the quiz details and manage its questions and options.
                </p>
              </div>
            </div>

            {/* Quiz Details Card */}
            <div className="card quiz-details-card">
              <h2 className="card-title">Quiz Details</h2>

              <div className="form-group">
                <label className="form-label">Quiz Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={quizData.title}
                  onChange={(e) => handleQuizChange("title", e.target.value)}
                  placeholder="Enter quiz title"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={quizData.description}
                  onChange={(e) =>
                    handleQuizChange("description", e.target.value)
                  }
                  rows={4}
                  placeholder="Enter quiz description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">URL Slug</label>
                  <input
                    type="text"
                    className="form-input"
                    value={quizData.urlSlug}
                    onChange={(e) =>
                      handleQuizChange("urlSlug", e.target.value)
                    }
                    placeholder="url-slug"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Score</label>
                  <input
                    type="number"
                    className="form-input"
                    value={quizData.maxScore}
                    onChange={(e) =>
                      handleQuizChange("maxScore", e.target.value)
                    }
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="form-group active-status-group">
                <label className="form-label">Active Status</label>
                <div className="toggle-container">
                  <span
                    className={`toggle-label ${
                      !quizData.isActive ? "active-text" : ""
                    }`}
                  >
                    Inactive
                  </span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={quizData.isActive}
                      onChange={(e) =>
                        handleQuizChange("isActive", e.target.checked)
                      }
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span
                    className={`toggle-label ${
                      quizData.isActive ? "active-text" : ""
                    }`}
                  >
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Questions Section */}
            {/* <div className="card questions-card"> */}
              {/* <div className="questions-header">
                <h2 className="card-title">Questions</h2>
                <button
                  className="add-question-btn"
                  onClick={() => setShowEditPanel(true)}
                >
                  <Plus size={18} />
                  Add New Question
                </button>
              </div> */}
              {/* Question list would go here */}
            {/* </div> */}
          </div>

          {/* Right Section - Edit Question Panel */}
          {showEditPanel && (
            <div className="right-section">
              <div className="edit-question-panel">
                <div className="panel-header">
                  <h2 className="panel-title">Edit Question</h2>
                  <button className="close-btn" onClick={closeEditPanel}>
                    <X size={24} />
                  </button>
                </div>

                <div className="panel-content">
                  <div className="form-group">
                    <label className="form-label">Question Text</label>
                    <textarea
                      className="form-textarea question-textarea"
                      value={editingQuestion.text}
                      onChange={(e) =>
                        handleQuestionChange("text", e.target.value)
                      }
                      rows={4}
                      placeholder="Enter your question here"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Order</label>
                      <input
                        type="number"
                        className="form-input"
                        value={editingQuestion.order}
                        onChange={(e) =>
                          handleQuestionChange("order", e.target.value)
                        }
                        placeholder="1"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Question Type</label>
                      <select
                        className="form-select"
                        value={editingQuestion.type}
                        onChange={(e) =>
                          handleQuestionChange("type", e.target.value)
                        }
                      >
                        <option>Multiple Choice</option>
                        <option>True/False</option>
                        <option>Short Answer</option>
                        <option>Essay</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subscale</label>
                    <select
                      className="form-select"
                      value={editingQuestion.subscale}
                      onChange={(e) =>
                        handleQuestionChange("subscale", e.target.value)
                      }
                    >
                      <option>Cellular Neurobiology</option>
                      <option>Neuroanatomy</option>
                      <option>Neurophysiology</option>
                      <option>Behavioral Neuroscience</option>
                      <option>Cognitive Neuroscience</option>
                    </select>
                  </div>

                  <div className="options-section">
                    <div className="options-header">
                      <h3 className="section-title">Options</h3>
                    </div>

                    {/* Corrected DND structure */}
                    <DragDropContext onDragEnd={onDragEnd}>
                      {/* DROPPABLE wraps the entire list */}
                      <Droppable droppableId="quiz-options-list">
                        {(provided) => (
                          <div
                            className="options-list"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {editingQuestion.options.map((option, index) => (
                              <Draggable
                                key={option.id}
                                draggableId={String(option.id)} // Must be a string
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    className="option-item"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps} // Props for drag-and-drop
                                  >
                                    <button
                                      className="drag-handle"
                                      title="Drag to reorder"
                                      {...provided.dragHandleProps} // Props for the drag handle
                                    >
                                      <GripVertical size={20} />
                                    </button>
                                    {/* Input Fields */}
                                    <input
                                      type="text"
                                      className="option-input"
                                      value={option.text}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          option.id,
                                          "text",
                                          e.target.value
                                        )
                                      }
                                      placeholder={`Option ${index + 1}`}
                                    />
                                    <input
                                      type="number"
                                      className="points-input"
                                      value={option.points}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          option.id,
                                          "points",
                                          e.target.value
                                        )
                                      }
                                      placeholder="0"
                                      title="Points"
                                    />
                                    <button
                                      className="delete-option-btn"
                                      onClick={() => deleteOption(option.id)}
                                      title="Delete option"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder} {/* Essential placeholder */}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>

                    <button className="add-option-btn" onClick={addOption}>
                      <Plus size={16} />
                      Add Option
                    </button>
                  </div>

                  <div className="panel-footer">
                    <button className="cancel-btn" onClick={cancelEdit}>
                      Cancel
                    </button>
                    <button
                      className="save-question-btn"
                      onClick={saveQuestion}
                    >
                      Save Question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Bar */}
        {hasUnsavedChanges && (
          <div className="save-bar">
            <div className="save-bar-content">
              <span className="unsaved-text">You have unsaved changes</span>
              <button className="save-quiz-btn" onClick={saveQuiz}>
                <Save size={18} />
                Save Quiz
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizEditor;
