import React from 'react';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return <span key={index} className="star full-star">★</span>;
        } else if (hasHalfStar && index === fullStars) {
          return <span key={index} className="star half-star">★</span>;
        } else {
          return <span key={index} className="star empty-star">★</span>;
        }
      })}
    </div>
  );
};

export default StarRating;