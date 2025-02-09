import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import "./review.css"
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

interface ReviewFormProps {
  doctorId: number;
  userId?: number; // Use userId instead of PatientID
  onReviewAdded: (review: any) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ doctorId, userId, onReviewAdded }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const navigate = useNavigate(); // Use navigate for redirection

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) {
      console.error("Error: userId is undefined or null");
      alert("Error: You must be logged in to submit a review. Redirecting to login page...");
      navigate('/login'); // Redirect to login page if userId is missing
      return;
    }

    const payload = {
      DoctorID: doctorId,
      PatientID: userId, // Use userId here
      Rating: rating,
      ReviewText: comment, // Ensure this matches the backend field name
      ReviewDate: new Date().toISOString().split('T')[0]
    };
    console.log("Submitting review:", payload);

    try {
      const response = await axios.post('http://localhost:5000/api/review/add', payload);
      console.log("Review submitted successfully:", response.data);
      onReviewAdded(response.data); // Call onReviewAdded with the new review
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review', error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        alert(`Error: ${error.response?.data?.error || "Failed to submit review"}`);
      }
    }
  };

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleStarHover = (value: number) => {
    setHoveredRating(value);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Write a Review</h3>
      
      <div className="form-group">
        <label>Rating</label>
        <div 
          className="star-input"
          onMouseLeave={handleStarLeave}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className={
                value <= (hoveredRating || rating) ? 'active' : ''
              }
              onClick={() => handleStarClick(value)}
              onMouseEnter={() => handleStarHover(value)}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Your Review</label>
        <textarea
          className="comment-input"
          value={comment}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          placeholder="Share your experience..."
          required
        />
      </div>

      <button 
        type="submit" 
        className="submit-review"
        disabled={!rating || !comment.trim()}
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;