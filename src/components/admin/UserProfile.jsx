import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NavBar from "../Auth/common/NavBar";
import "../../assets/css/talentProfile.css";
import Reviewer1 from "../../../public/Reviewer1.svg";
import Reviewer2 from "../../../public/Reviewer2.svg";
import PortfolioImage from "../../../public/PortfolioImage.svg";
import { BiLike, BiDislike, BiSlideshow } from "react-icons/bi";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { formatHumanDate } from "../../helpers/Helper";
import Swal from "sweetalert2";
import ApiService from "../../services/ApiService";

function UserProfile() {
  const location = useLocation();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id"); // Get id from URL
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [detailsUser, setdetailsUser] = useState(null);

  const avatar = location?.state?.profile || "";
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
  const talentTitle =
    detailsUser?.userInfo?.skills?.length > 0
      ? detailsUser.userInfo.skills.map((s) => s.name).join("/")
      : "No skills";

  const talentData = {
    id: detailsUser?.id,
    name: detailsUser?.username,
    email: detailsUser?.email,
    talentTitle,
    status: detailsUser?.is_verified == true ? "Active" : "Inactive",
    joinDate: detailsUser?.userInfo?.dataValues?.created_at,
    location: detailsUser?.country,
    avatar,
    about: detailsUser?.userInfo?.about || "",
    rating: 4.8,
    totalReviews: 12,
    ratingBreakdown: {
      5: 75,
      4: 15,
      3: 5,
      2: 3,
      1: 2,
    },
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  const reviews = [
    {
      id: 1,
      reviewerName: "Liam Harper",
      reviewerAvatar: Reviewer1,
      date: "May 2023",
      rating: 5,
      comment:
        "Sophia is an excellent talent to work with. She provides clear instructions and is very responsive to questions. I highly recommend her for any project.",
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

  const talentHistory = [
    {
      title: "Singer",
      talent: "Sophia Carter",
      startDate: "2022-01-15",
      endDate: "2023-06-30",
      earning: "$50,000",
    },
    {
      title: "Chef",
      talent: "Sophia Carter",
      startDate: "2021-07-01",
      endDate: "2021-12-31",
      earning: "$25,000",
    },
    {
      title: "Painter",
      talent: "Sophia Carter",
      startDate: "2021-01-01",
      endDate: "2021-06-30",
      earning: "$15,000",
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

    let reason = "";

    if (newStatus === "rejected") {
      // Ask for reason if rejecting
      const { value: rejectReason } = await Swal.fire({
        title: "Reason for Rejection",
        input: "textarea",
        inputPlaceholder: "Enter reason...",
        inputAttributes: {
          "aria-label": "Enter reason for rejection",
        },
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
      });

      if (!rejectReason) {
        Swal.fire("Cancelled", "You must provide a reason to reject.", "info");
        return;
      }
      reason = rejectReason;
    } else {
      // Normal confirmation for approve/block
      const result = await Swal.fire({
        title: `Are you sure you want to ${newStatus}?`,
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed!",
      });

      if (!result.isConfirmed) return;
    }

    try {
      const response = await ApiService.post("admin/updateUserStatus", {
        userId: detailsUser.id,
        status: newStatus,
        reason: reason, // send reason if rejected, else empty
      });

      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: response.data.message,
        });

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
  };
  return (
    <div className="talent-details-container">
      <NavBar />
      <div className="main-content">
        {/* Breadcrumb */}
        <div>
          <span className="breadcrumb">
            {" "}
            <span style={{ color: "#6d028e" }}>Talents</span> / Talent Details
          </span>
        </div>

        {/* Header */}
        <div className="talent-header">
          <div className="talent-profile-info">
            <div className="talent-avatar">
              <img
                src={talentData.avatar}
                alt="talent-avatar"
                className="empinfo-img"
              />
            </div>
            <div className="talent-details">
              <p className="talent-name">
                {talentData?.name
                  ? talentData.name.charAt(0).toUpperCase() +
                  talentData.name.slice(1)
                  : ""}
              </p>
              <p className="talent-title">{talentData.talentTitle}</p>
              <p className="talent-joinedDate">
                Joined {formatHumanDate(talentData.joinDate, "year")}
              </p>
              {/* ✅ Current status display */}
              <p className="client-status">
                Status: <span className={`status-label ${detailsUser?.status || "pending"}`}>
                  {detailsUser?.status ? detailsUser.status.toUpperCase() : "PENDING"}
                </span>
              </p>
            </div>
          </div>
          <button className="report-button" onClick={handleReportUser}>
            Report Talent
          </button>
          <div className="status-buttons" style={{ marginTop: "10px" }}>
            <button
              className={`status-btn approve ${detailsUser?.status === "approved" ? "active" : ""
                }`}
              onClick={() => handleStatusUpdate("approved")}
            >
              Approve
            </button>
            <button
              className={`status-btn reject ${detailsUser?.status === "rejected" ? "active" : ""
                }`}
              onClick={() => handleStatusUpdate("rejected")}
            >
              Reject
            </button>
            <button
              className={`status-btn blocked ${detailsUser?.status === "blocked" ? "active" : ""
                }`}
              onClick={() => handleStatusUpdate("blocked")}
            >
              Block
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="overview-content">
              {/* About */}
              {/* <div className="about-section">
                <h2 className="talent-about">About</h2>
                <p>{talentData.about}</p>
              </div> */}

              {/* SKills */}
              <div className="talent-profile p-4 bg-white rounded-2xl shadow-md mb-6">
                {/* <h2 className="text-xl font-semibold mb-4">Talent Profile</h2> */}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Profile Details - 4 columns */}
                  <div className="md:col-span-4">
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {detailsUser?.userInfo?.dataValues?.full_name}</p>
                      <p><span className="font-medium">Gender:</span> {detailsUser?.userInfo?.dataValues?.gender}</p>
                      <p><span className="font-medium">Age:</span> {detailsUser?.userInfo?.dataValues?.age}</p>
                      <p><span className="font-medium">Country:</span> {detailsUser?.userInfo?.dataValues?.country}</p>
                      <p><span className="font-medium">Email:</span> {detailsUser?.email}</p>
                      <p><span className="font-medium">Phone:</span> {detailsUser?.phone_number}</p>
                      <p>
                        <span className="font-medium">Hourly Rate:</span>{" "}
                        {detailsUser?.userInfo?.dataValues?.hourly_rate}{" "}
                        {detailsUser?.userInfo?.dataValues?.currency}
                      </p>
                      <p>
                        <span className="font-medium">Rating:</span>{" "}
                        ⭐ {detailsUser?.rating} ({detailsUser?.totalReviews} reviews)
                      </p>
                      <p><span className="font-medium">Skills:</span> <div className="flex flex-wrap gap-2">
                        {detailsUser?.userInfo?.skills?.length > 0 ? (
                          detailsUser?.userInfo?.skills?.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                            >
                              {skill.name}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">No skills added</p>
                        )}
                      </div></p>

                    </div>
                  </div>

                  {/* Booking History - 8 columns */}
                  <div className="md:col-span-8">
                    <h2 className="text-lg font-semibold mb-3">Booking History</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100 text-gray-700 text-sm">
                          <tr>
                            <th className="px-4 py-2 text-left">Client</th>
                            <th className="px-4 py-2 text-left">Talent</th>
                            <th className="px-4 py-2 text-left">Slots</th>
                            <th className="px-4 py-2 text-left">Earning</th>
                            <th className="px-4 py-2 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {detailsUser?.bookings?.length > 0 ? (
                            detailsUser.bookings.map((booking, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2">{booking?.client?.username || "N/A"}</td>
                                <td className="link px-4 py-2">
                                  {booking?.talent?.username || "N/A"}
                                </td>
                                <td className="px-4 py-2">
                                  {booking.slots?.length > 0 ? (
                                    <ul style={{ margin: 0, paddingLeft: "15px" }}>
                                      {booking.slots.map((slot) => (
                                        <li key={slot.id}>
                                          {slot.slot_date} ({slot.slot})
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    "No Slots"
                                  )}
                                </td>
                                <td className="px-4 py-2">
                                  {booking.total_price} {booking.currency}
                                </td>
                                <td className="px-4 py-2">{booking.status}</td>
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



                    <h2 className="text-lg font-semibold mb-3 pt-5">Media List</h2>
                    <div className="relative">
                      {/* Table Section */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                          <thead className="bg-gray-100 text-gray-700 text-sm">
                            <tr>
                              <th className="px-4 py-2 text-left">Title</th>
                              <th className="px-4 py-2 text-left">Description</th>
                              <th className="px-4 py-2 text-left">Type</th>
                              <th className="px-4 py-2 text-left">Preview</th>
                              <th className="px-4 py-2 text-left">Likes</th>
                              <th className="px-4 py-2 text-left">Shares</th>
                              <th className="px-4 py-2 text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm">
                            {detailsUser?.mediaItems?.length > 0 ? (
                              detailsUser.mediaItems.map((media, index) => (
                                <tr
                                  key={index}
                                  className="border-t hover:bg-gray-50 transition"
                                >
                                  <td className="px-4 py-2">{media.title}</td>
                                  <td className="px-4 py-2">{media.description}</td>
                                  <td className="px-4 py-2 capitalize">{media.type}</td>
                                  <td className="px-4 py-2">
                                    {media.type === "image" ? (
                                      <img
                                        src={media.fileUrl}
                                        alt={media.title}
                                        className="w-16 h-16 object-cover rounded-md border"
                                      />
                                    ) : (
                                      <video
                                        src={media.fileUrl}
                                        className="w-20 h-16 rounded-md border"
                                        controls
                                      />
                                    )}
                                  </td>
                                  <td className="px-4 py-2">{media.likes}</td>
                                  <td className="px-4 py-2">{media.shares}</td>
                                  <td className="px-4 py-2">
                                    <button
                                      onClick={() => setSelectedMedia(media)}
                                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition"
                                    >
                                      View
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="7"
                                  className="px-4 py-3 text-center text-gray-500 italic"
                                >
                                  No Media Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Fullscreen Modal Overlay */}
                      {selectedMedia && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                          <div className="relative w-11/12 md:w-3/4 lg:w-1/2 bg-white rounded-xl shadow-lg p-4">
                            {/* Close Button */}
                            <button
                              onClick={() => setSelectedMedia(null)}
                              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
                            >
                              ✕
                            </button>

                            {/* Media Content */}
                            <h2 className="text-lg font-semibold mb-2">
                              {selectedMedia.title}
                            </h2>
                            

                            {selectedMedia.type === "image" ? (
                              <img
                                src={selectedMedia.fileUrl}
                                alt={selectedMedia.title}
                                className="w-full max-h-[70vh] object-contain rounded-md"
                              />
                            ) : (
                              <video
                                src={selectedMedia.fileUrl}
                                controls
                                autoPlay
                                className="w-full max-h-[70vh] rounded-md"
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="reviews-section">
                <h2>Reviews</h2>

                {/* Rating Summary */}
                <div className="rating-summary">
                  <div className="rating-score">
                    <span className="score">{detailsUser?.rating}</span>
                    {renderStars(detailsUser?.rating)}
                    <span className="total-reviews">
                      {detailsUser?.totalReviews} reviews
                    </span>
                  </div>

                  <div className="rating-breakdown">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star}>
                        {renderRatingBar(
                          star,
                          detailsUser?.ratingBreakdown[star] || 0
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
                            className={`like-button ${review.userLiked ? "active" : ""
                              }`}
                          >
                            <BiLike /> {review.likesCount}
                          </button>
                          {/* if you’re also tracking dislikes */}
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
              </div>
            </div>
          )}
        </div>



        <div className="verification">
          <p className="block">Block User</p>
          <p className="verify">Verify Profile</p>
        </div>
      </div>
    </div>
  );
}
export default UserProfile;
