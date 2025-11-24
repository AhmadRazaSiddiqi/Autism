import React, { useEffect, useState } from "react";
import NavBar from "../Auth/common/NavBar";
import "../../assets/css/feeddetails.css";
import { BiLike, BiDislike, BiShare, BiHeart } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { formatHumanDate } from "../../helpers/Helper";

function FeedDetails() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const feedId = queryParams.get("id");
  const feedFromState = location.state?.feed;
  
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedDetails = async () => {
      // If we already have feed data from navigation state, use it
      if (feedFromState) {
        setFeed(feedFromState);
        return;
      }

      // Otherwise, fetch from API using feedId
      if (!feedId) {
        setError("No feed ID provided");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await ApiService.post("admin/feed-details", {
          id: feedId,
        });
        
        setFeed(response?.data?.data || null);
      } catch (error) {
        console.error("Error fetching feed details:", error);
        setError("Failed to load feed details");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedDetails();
  }, [feedId, feedFromState]);

  // Render stars for rating
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

  // Handle like action
  const handleLike = async () => {
    if (!feed) return;
    
    try {
      // Your like API call here
      console.log("Liking feed:", feed.id);
    } catch (error) {
      console.error("Error liking feed:", error);
    }
  };

  // Handle share action
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: feed?.title,
        text: feed?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="client-details-container">
        <NavBar />
        <div className="main-content">
          <div style={{ textAlign: "center", padding: "50px" }}>Loading feed details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-details-container">
        <NavBar />
        <div className="main-content">
          <div style={{ textAlign: "center", padding: "50px", color: "red" }}>{error}</div>
        </div>
      </div>
    );
  }

  if (!feed) {
    return (
      <div className="client-details-container">
        <NavBar />
        <div className="main-content">
          <div style={{ textAlign: "center", padding: "50px" }}>Feed not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="client-details-container">
      <NavBar />
      <div className="main-content">
        {/* Breadcrumb */}
        <div>
          <span className="breadcrumb">Feeds / Feed Details</span>
        </div>

        {/* Feed Header */}
        <div className="client-header">
          <div className="client-info">
            <div className="client-avatar">
              <img
                src={feed.talent?.profile_photo || "/default-avatar.png"}
                alt={feed.talent?.username}
                className="avatar"
              />
            </div>
            <div className="client-details">
              <h2 className="client-name">{feed.talent?.username}</h2>
              <p className="client-meta">
                Posted on {formatHumanDate(feed.createdAt, "full")}
              </p>
              <p className="client-location">{feed.talent?.location}</p>
              {feed.TalentRate && (
                <div className="talent-rate">
                  Talent Rate: ${feed.TalentRate}/hour
                </div>
              )}
            </div>
          </div>
          <div className="feed-stats">
            <span className="stat">{feed.likes_count} Likes</span>
            <span className="stat">{feed.shares} Shares</span>
            <span className="stat">{feed.views} Views</span>
          </div>
        </div>

        {/* Feed Content */}
        <div className="feed-content-section">
          <h2 className="feed-title">{feed.title}</h2>
          <p className="feed-description">{feed.description}</p>
          
          {/* Media Display */}
          <div className="feed-media">
            {feed.type === "video" ? (
              <video 
                controls 
                className="feed-video"
                poster={feed.thumbnail || "/video-thumbnail.png"}
              >
                <source src={feed.fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img 
                src={feed.fileUrl} 
                alt={feed.title}
                className="feed-image"
              />
            )}
          </div>

          {/* Talent Skills */}
          {feed.talent?.talentSkills && feed.talent.talentSkills.length > 0 && (
            <div className="talent-skills">
              <h3>Skills & Rates</h3>
              <div className="skills-list">
                {feed.talent.talentSkills.map((skill) => (
                  <div key={skill.id} className="skill-item">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-rate">${skill.rate}/hour</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Metrics */}
          <div className="engagement-metrics">
            <div className="metric-item">
              <span className="metric-label">Quality Score:</span>
              <span className="metric-value">
                {feed.talent?.ratinginnumber ? `${feed.talent.ratinginnumber}/5` : "Not rated"}
              </span>
              {feed.talent?.ratinginnumber && renderStars(feed.talent.ratinginnumber)}
            </div>
            
            <div className="metric-item">
              <span className="metric-label">Jobs Completed:</span>
              <span className="metric-value">{feed.talent?.jobs || 0}</span>
            </div>
            
            <div className="metric-item">
              <span className="metric-label">Availability:</span>
              <span className="metric-value">
                {feed.talent?.availability === 1 ? "Available" : 
                 feed.talent?.availability === 2 ? "Busy" : 
                 feed.talent?.availability === 3 ? "Away" : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="feed-actions">
          <button 
            className={`action-button like-button ${feed.is_liked ? "active" : ""}`}
            onClick={handleLike}
          >
            <BiLike /> 
            <span>{feed.likes_count}</span>
          </button>
          
          <button className="action-button dislike-button">
            <BiDislike />
          </button>
          
          <button className="action-button share-button" onClick={handleShare}>
            <BiShare />
            <span>Share</span>
          </button>
          
          <button className={`action-button wishlist-button ${feed.talent?.is_wishlisted ? "active" : ""}`}>
            <BiHeart />
            <span>{feed.talent?.wishlist_count || 0}</span>
          </button>
        </div>

        {/* Talent Information */}
        <div className="talent-details-section">
          <h2>About {feed.talent?.username}</h2>
          <div className="talent-info-grid">
            <div className="info-item">
              <label>Full Name:</label>
              <span>{feed.talent?.full_name || "N/A"}</span>
            </div>
            <div className="info-item">
              <label>Location:</label>
              <span>{feed.talent?.location || "N/A"}</span>
            </div>
            <div className="info-item">
              <label>Talent Type:</label>
              <span>{feed.talent?.talent_type || "N/A"}</span>
            </div>
            <div className="info-item">
              <label>Rating:</label>
              <span>{feed.talent?.rating || "No ratings yet"}</span>
            </div>
          </div>
        </div>

        {/* Additional Feed Metadata */}
        <div className="feed-metadata">
          <h3>Feed Information</h3>
          <div className="metadata-grid">
            <div className="metadata-item">
              <label>Visibility:</label>
              <span>{feed.visibility === "1" ? "Public" : "Private"}</span>
            </div>
            <div className="metadata-item">
              <label>Type:</label>
              <span className={`feed-type ${feed.type}`}>
                {feed.type?.charAt(0).toUpperCase() + feed.type?.slice(1)}
              </span>
            </div>
            <div className="metadata-item">
              <label>Created:</label>
              <span>{formatHumanDate(feed.createdAt, "full")}</span>
            </div>
            <div className="metadata-item">
              <label>Last Updated:</label>
              <span>{formatHumanDate(feed.updatedAt, "full")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedDetails;