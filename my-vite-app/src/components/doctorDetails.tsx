import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import ReviewForm from './reviews/reviewForm';
import StarRating from '../components/reviews/StarRating';
import './Home/Main.css';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  experience: number;
  bio: string;
  Availabilities?: { availableDate: string; startTime: string; endTime: string }[];
}

interface Review {
  Rating: number;
  ReviewText: string; // Ensure this matches the backend response
}

const DoctorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Retrieve userId from local storage
  const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : null;

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctor/${id}`);
        console.log('Doctor Data:', response.data); // Debugging
        setDoctor(response.data);
      } catch (err) {
        setError("Failed to fetch doctor details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/review/${id}/reviews`);
        console.log("Reviews Data:", response.data); // Debugging: Log the response data
        setReviews(response.data); // Ensure the backend returns an array of reviews
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      }
    };

    fetchDoctorDetails();
    fetchReviews();
  }, [id]);

  const calculateAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.Rating, 0);
    return totalRating / reviews.length;
  };

  const averageRating = calculateAverageRating(reviews);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleReviewAdded = (newReview: Review) => {
    console.log("New Review Added:", newReview); // Debugging: Log the new review
    setReviews([...reviews, newReview]); // Add the new review to the existing reviews
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!doctor) return <div className="error">Doctor not found</div>;

  return (
    <div className="doctor-details">
      <div className="doctor-card">
        <div className="doctor-header">
          <h1 onClick={() => navigate(`/doctor/${doctor.id}`)}>
            Dr. {doctor.firstName} {doctor.lastName}
          </h1>
          <div className="average-rating">
            <strong>Average Rating:</strong> <StarRating rating={averageRating} />
          </div>
          <button className="book-appointment" onClick={openModal}>
            Book Appointment
          </button>
        </div>

        <div className="info-section">
          <div className="info-box specialty">
            <h2>Specialty</h2>
            <p>{doctor.specialty}</p>
          </div>

          <div className="info-box experience">
            <h2>Experience</h2>
            <p>{doctor.experience} years</p>
          </div>
        </div>

        <div className="about-section">
          <h2>About</h2>
          <p>{doctor.bio}</p>
        </div>

        <div className="availability-section">
          <h2>Availability</h2>
          <div className="availability-grid">
            {doctor.Availabilities?.length ? (
              doctor.Availabilities.map((slot, index) => (
                <div key={index} className="time-slot">
                  <div className="date">{slot.availableDate}</div>
                  <div className="time">{slot.startTime} - {slot.endTime}</div>
                </div>
              ))
            ) : (
              <p>No available slots</p>
            )}
          </div>
        </div>

        <div className="reviews-section">
          {reviews.map((review, index) => (
            <div key={index} className="review">
              <p><strong>Rating:</strong> <StarRating rating={review.Rating} /></p>
              <p><strong>Comment:</strong> {review.ReviewText}</p> {/* Ensure ReviewText is displayed */}
            </div>
          ))}
          <ReviewForm 
            doctorId={parseInt(id!)} 
            userId={userId} // Pass the userId from local storage
            onReviewAdded={handleReviewAdded} 
          />
        </div>
      </div>

      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2>Dr. {doctor.firstName} {doctor.lastName}</h2>
            <button className="close-button" onClick={closeModal}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="modal-section">
              <h3>Specialty</h3>
              <p>{doctor.specialty}</p>
            </div>
            
            <div className="modal-section">
              <h3>Experience</h3>
              <p>{doctor.experience} years</p>
            </div>
            
            <div className="modal-section">
              <h3>About</h3>
              <p>{doctor.bio}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorDetails;