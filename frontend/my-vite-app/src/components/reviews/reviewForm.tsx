import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import "./review.css"

interface ReviewFormProps {
  doctorId: number;
  PatientID: number;
  onReviewAdded: (review: any) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ doctorId,PatientID,onReviewAdded }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        DoctorID: doctorId,
        PatientID: PatientID, // Ensure this is a valid PatientID from the users table
        Rating: rating,
        comment: comment,
        ReviewText: comment,
        ReviewDate: new Date().toISOString().split('T')[0]
      };
      const response = await axios.post('http://localhost:5000/api/review/add', payload);
      onReviewAdded(response.data);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review', error);
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
              className={`${
                value <= (hoveredRating || rating) ? 'active' : ''
              }`}
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