import React, { useState } from 'react';
import axios from 'axios';
import "./review.css"

const ReviewForm = ({ doctorId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/review/add', {
        doctorId,
        rating,
        comment,
      });
      onReviewAdded(response.data);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review', error);
    }
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
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
          onChange={(e) => setComment(e.target.value)}
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