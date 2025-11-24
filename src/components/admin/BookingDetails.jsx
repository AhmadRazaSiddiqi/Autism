import React, { useEffect, useState } from "react";
import NavBar from "../Auth/common/NavBar";
import "../../assets/css/BookingDetails.css";
import { useLocation } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { FaStar } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { BiTime } from "react-icons/bi";

function ClientDetails() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("id");

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await ApiService.post("admin/bookingdetails", {
          bookingId,
        });
        setBooking(response?.data?.data || null);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return <div className="loading">Loading booking details...</div>;
  }

  if (!booking) {
    return <div className="error">No booking details found.</div>;
  }

  return (
    <div className="client-details-container">
      <NavBar />
      <div className="main-content">
        {/* Breadcrumb */}
        <div>
          <span className="breadcrumb">Bookings / Booking Details</span>
        </div>

        {/* Booking Summary */}
        <div className="booking-card">
          <h2 className="booking-title">
            Booking #{booking.booking_id} – {booking.skill}
          </h2>
          <p className={`booking-status ${booking.status}`}>
            Status: {booking.status}
          </p>
          <p className="booking-note">Note: {booking.note || "No note"}</p>
          <div className="booking-meta">
            <span>
              <MdOutlineDateRange /> {booking.date}
            </span>
            <span>
              <BiTime /> {booking.time}
            </span>
            <span className="rating">
              <FaStar color="gold" /> {booking.rating}
            </span>
          </div>
        </div>

        {/* Client & Talent Section */}
        <div className="info-section">
          {/* Client Card */}
          <div className="user-card">
            <h3>Client</h3>
            <img
              src={booking.client?.profilePhoto}
              alt="Client Avatar"
              className="user-avatar"
            />
            <p className="user-name">{booking.client?.name}</p>
            <p className="user-location">
              {booking.client?.city}, {booking.client?.country}
            </p>
          </div>

          {/* Talent Card */}
          <div className="user-card">
            <h3>Talent</h3>
            <img
              src={booking.talent?.profilePhoto}
              alt="Talent Avatar"
              className="user-avatar"
            />
            <p className="user-name">{booking.talent?.name}</p>
            <p className="user-location">
              {booking.talent?.city}, {booking.talent?.country}
            </p>
          </div>
        </div>

        {/* Booked Slots */}
        {/* Booked Slots */}
        <div className="slots-section">
          <h3>Booked Slots</h3>
          {booking.bookedSlots?.length > 0 ? (
            <ul>
              {booking.bookedSlots.map((slot, index) => (
                <li key={index}>
                  <strong>{slot.booking_date}</strong>
                  <ul>
                    {slot.booking_times.map((time, tIndex) => (
                      <li key={tIndex}>{time}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No booked slots available</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default ClientDetails;
