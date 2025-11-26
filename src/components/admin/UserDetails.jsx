import React, { useEffect, useState } from "react";
import NavBar from "../Auth/common/NavBar";
import "../../assets/css/clientDetails.css";
import Reviewer1 from "../../../public/Reviewer1.svg";
import Reviewer2 from "../../../public/Reviewer2.svg";
import { BiLike, BiDislike } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { formatHumanDate } from "../../helpers/Helper";
import Swal from "sweetalert2";

function UserDetails() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");
  console.log(userId); // Get id from URL
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [detailsUser, setdetailsUser] = useState(null);

  const avatar = location?.state?.profile_photo || "";

  useEffect(() => {
    const fetchdetailsUser = async () => {
      try {
        setLoading(true);
        const response = await ApiService.post("admin/detailsUser", {
          id: userId,
        }); // Replace with your API endpoint
        setdetailsUser(response?.data?.data || null);
      } catch (error) {
        console.error("Error fetching detailsUser:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchdetailsUser();
  }, [userId]);

  const clientData = {
    id: detailsUser?.id,
    name: detailsUser?.username,
    email: detailsUser?.email,
    status: detailsUser?.is_verified == true ? "Active" : "Inactive",
    joinDate:
      formatHumanDate(detailsUser?.userInfo?.dataValues?.created_at, "year") ||
      "N/A",
    location: detailsUser?.country,
    avatar: detailsUser?.userInfo?.profile_photo,
    about: detailsUser?.userInfo?.dataValues?.about || "",
    rating: detailsUser?.rating || 0,
    totalReviews: detailsUser?.totalReviews || 0,
    ratingBreakdown: detailsUser?.ratingBreakdown || {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  };

  const reviews = [
    {
      id: 1,
      reviewerName: "Liam Harper",
      reviewerAvatar: Reviewer1,
      date: "May 2023",
      rating: 5,
      comment:
        "Sophia is an excellent client to work with. She provides clear instructions and is very responsive to questions. I highly recommend her for any project.",
      likes: 5,
      dislikes: 1,
    },
    {
      id: 2,
      reviewerName: "Olivia Bennett",
      reviewerAvatar: Reviewer2,
      date: "April 2023",
      rating: 4,
      comment:
        "Working with Sophia was a pleasant experience. She is organized and communicates effectively. I would definitely work with her again.",
      likes: 3,
      dislikes: 0,
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const rounded = Math.round(rating);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rounded ? "filled" : ""}`}></span>
      );
    }

    return <div className="stars-container">{stars}</div>;
  };

  const renderRatingBar = (starCount, percentage) => {
    return (
      <div className="rating-bar-container">
        <span className="rating-number">{starCount}</span>
        <div className="rating-bar">
          <div
            className="rating-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="rating-percentage">{percentage}%</span>
      </div>
    );
  };

  const handleReportUser = () => {
    console.log("HandleReportUser clicked");
  };
const handleStatusUpdate = async (newStatus) => {
  if (!detailsUser?.id) return;

  // Show SweetAlert confirmation
  const result = await Swal.fire({
    title: `Are you sure you want to ${newStatus}?`,
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, proceed!",
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiService.post("admin/updateUserStatus", {
        userId: detailsUser.id,
        status: newStatus,
      });

      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: response.data.message,
        });

        // Update local state immediately
        setdetailsUser({ ...detailsUser, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to update status",
      });
    }
  }
};

  return (
    <div className="client-details-container">
      <NavBar />
      <div className="main-content">
        {/* Breadcrumb */}
        <div>
          <span className="breadcrumb">Users / User Details</span>
        </div>

        {/* Header */}
        <div className="client-header">
          <div className="client-info">
            <div className="client-avatar">
              <img
                src={clientData.avatar}
                alt="client-avatar"
                className="avatar"
              />
            </div>
            <div className="client-details">
              <h2 className="client-name">{clientData.name}</h2>
              <p className="client-meta">Client Since {clientData.joinDate}</p>
              <p className="client-location">{clientData.location}</p>

              {/* ✅ Current status display */}
              <p className="client-status">
                Status: <span className={`status-label ${detailsUser?.status || "pending"}`}>
                  {detailsUser?.status ? detailsUser.status.toUpperCase() : "PENDING"}
                </span>
              </p>

            </div>
          </div>

          <button className="report-button" onClick={handleReportUser}>
            Report User
          </button>

          {/* ✅ Status buttons */}
          <div className="status-buttons" style={{ marginTop: "10px" }}>
            <button
              className={`status-btn approve ${
                detailsUser?.status === "approved" ? "active" : ""
              }`}
              onClick={() => handleStatusUpdate("approved")}
            >
              Approve
            </button>
            <button
              className={`status-btn reject ${
                detailsUser?.status === "rejected" ? "active" : ""
              }`}
              onClick={() => handleStatusUpdate("rejected")}
            >
              Reject
            </button>
            <button
              className={`status-btn blocked ${
                detailsUser?.status === "blocked" ? "active" : ""
              }`}
              onClick={() => handleStatusUpdate("blocked")}
            >
              Block
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
        </div>

        {/* Content */}
        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="overview-content">
              {/* About */}
              <div className="about-section">
                <h2 className="client-about">About</h2>
                <p>{clientData.about}</p>
              </div>

              {/* Reviews */}
              <div className="reviews-section">
                <h2>Reviews</h2>

                {/* Rating Summary */}
                <div className="rating-summary">
                  <div className="rating-score">
                    <span className="score">{clientData.rating}</span>
                    {renderStars(clientData.rating)}
                    <span className="total-reviews">
                      {clientData.totalReviews} reviews
                    </span>
                  </div>

                  <div className="rating-breakdown">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star}>
                        {renderRatingBar(
                          star,
                          clientData.ratingBreakdown[star] || 0
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="reviews-list">
                  {detailsUser?.reviews?.length > 0 ? (
                    detailsUser.reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <img
                              src={
                                review.reviewer?.profile_photo ||
                                "/default-avatar.png"
                              }
                              alt={review.reviewer?.username}
                              className="reviewer-avatar"
                            />
                            <div>
                              <h4 className="reviewer-name">
                                {review.reviewer?.username}
                              </h4>
                              <span className="review-date">
                                {review.createdAtFormatted}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>

                        <p className="review-comment">{review.comment}</p>

                        <div className="review-actions">
                          <button
                            className={`like-button ${
                              review.userLiked ? "active" : ""
                            }`}
                          >
                            <BiLike /> {review.likesCount}
                          </button>
                          {review.dislikes > 0 && (
                            <button className="dislike-button">
                              <BiDislike /> {review.dislikes}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No reviews available</p>
                  )}
                </div>

                {/* Pagination */}
                <div
                  className="pagination-container"
                  style={
                    detailsUser?.reviews == []
                      ? { display: "none" }
                      : { display: "flex" }
                  }
                >
                  <button className="pagination-btn prev-btn">&#60;</button>
                  <div className="pagination-numbers">
                    <button className="pagination-number active">1</button>
                    <button className="pagination-number">2</button>
                    <button className="pagination-number">3</button>
                    <span className="pagination-dots">...</span>
                    <button className="pagination-number">10</button>
                  </div>
                  <button className="pagination-btn next-btn">&#62;</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking History Section */}
        <h2 className="section-heading">Quiz History</h2>
        <div className="booking-history">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Talent Title</th>
                <th>Client</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Spending</th>
              </tr>
            </thead>
            <tbody>
              {detailsUser?.bookings?.length > 0 ? (
                detailsUser.bookings.map((booking, index) => (
                  <tr key={index}>
                    <td>{booking?.talent?.talent || "N/A"}</td>
                    <td className="link">
                      {booking?.client?.username || "N/A"}
                    </td>
                    <td>
                      <ul style={{ margin: 0, paddingLeft: "15px" }}>
                        <li>{formatHumanDate(booking.created_at, "date")}</li>
                      </ul>
                    </td>
                    <td>{booking.status}</td>
                    <td>
                      {booking.total_price} {booking.currency}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No Bookings Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
