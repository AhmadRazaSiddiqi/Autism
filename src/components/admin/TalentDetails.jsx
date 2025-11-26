import React, { useState, useEffect } from "react";
import NavBar from "../Auth/common/NavBar"; // Assuming you have a NavBar component
import "../../assets/css/talentDetails.css"; // We'll create this CSS file
import ApiService from "../../services/ApiService";


function TalentDetails() {

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id"); // Get id from URL
  const [loading, setLoading] = useState(false);
  const [detailsUser, setdetailsUser] = useState(null);

  useEffect(() => {
    const fetchdetailsUser = async () => {
      try {
        setLoading(true);
        const response = await ApiService.post("admin/detailsUser", { id: userId, role: "client" }); // Replace with your API endpoint
        setdetailsUser(response?.data?.data || null);
      } catch (error) {
        console.error("Error fetching detailsUser:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchdetailsUser();
  }, []);

 

  const talentData = {
    name: "Emily Carter",
    avatar: "/Reviewer2.svg", // Placeholder, replace with actual path if different
    role: "Talent",
  };

  const clientDetails = {
    name: "Tech Innovators Inc.",
    type: "Client",
  };

  const jobDetails = {
    title: "Senior Product Designer",
    description:
      "We are looking for a Senior Product Designer to join our team. You will be responsible for the design and user experience of our products. You will work closely with product managers and engineers to define and deliver innovative solutions.",
    requirements: [
      "5+ years of experience in product design",
      "Strong portfolio showcasing design skills",
      "Experience with user research and testing",
      "Proficiency in design tools (e.g., Figma, Sketch)",
      "Excellent communication and collaboration skills",
    ],
  };

  const review = {
    reviewerName: "Emily Carter",
    date: "2 months ago",
    rating: 5, // Assuming 5 stars from the image
    comment:
      "Great experience working with Tech Innovators Inc. on this project. The team was very supportive and provided clear direction. I enjoyed the creative freedom and the opportunity to contribute to a meaningful product. Highly recommend working with them!",
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
          ★
        </span>
      );
    }
    return <div className="stars-container">{stars}</div>;
  };

  return (
    <div className="talent-details-container">
      <NavBar /> {/* Your Navbar component */}
      <div className="main-content">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span className="Talent">Quizzes </span> <span className="TalentDetails">/ Quiz Details</span>
        </div>

        {/* Job Title */}
        <h1 className="job-title">{jobDetails.title}</h1>

        {/* Job Description */}
        <p className="job-description">{jobDetails.description}</p>

        {/* Requirements */}
        <div className="requirements-section">
          <h2>Requirements</h2>


          {jobDetails.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}

        </div>

        {/* Client Details */}
        <div className="client-info-section">
          <h2>Client Details</h2>
          <div className="detail-card">
            <img src={avatar} alt="Client Avatar" className="detail-avatar" /> {/* Placeholder for client image */}
            <div className="detail-text">
              <h3 className="detail-name">{clientDetails.name}</h3>
              <p className="detail-role">{clientDetails.type}</p>
            </div>
          </div>
        </div>

        {/* Talent Details */}
        <div className="talent-info-section">
          <h2>Talent Details</h2>
          <div className="detail-card">
            <img src={"avatar"} alt="Talent Avatar" className="detail-avatar" />
            <div className="detail-text">
              <h3 className="detail-name">{talentData.name}</h3>
              <p className="detail-role">{talentData.role}</p>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="review-section">
          <h2>Review</h2>
          <div className="review-card">
            <div className="reviewer-info">
              <img
                src={review.reviewerAvatar || talentData.avatar} // Use talent's avatar if reviewer's is not provided
                alt={review.reviewerName}
                className="reviewer-avatar"
              />
              <div className="reviewer-details">
                <h3 className="reviewer-name">{review.reviewerName}</h3>
                <p className="review-date">{review.date}</p>
              </div>
            </div>
            <div className="review-rating">{renderStars(review.rating)}</div>
            <p className="review-comment">{review.comment}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TalentDetails;