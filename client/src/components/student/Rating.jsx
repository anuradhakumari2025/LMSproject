import React, { useEffect, useState } from "react"; // Importing React hooks for managing state and side effects

const Rating = ({ initialRating, onRate }) => {
  // State to store the current rating, initialized with the provided initialRating or 0
  const [rating, setRating] = useState(initialRating || 0);

  // Function to handle rating when a star is clicked
  const handleRating = (value) => {
    setRating(value); // Update the rating state
    if (onRate) onRate(value); // If the onRate callback is provided, call it with the new rating
  };

  // useEffect to update the rating state if the initialRating prop changes
  useEffect(() => {
    if (initialRating) {
      setRating(initialRating); // Update the rating state if the initialRating changes
    }
  }, [initialRating]); // Dependency array ensures this runs when initialRating changes

  return (
    <div>
      {/* Rendering 5 stars */}
      {Array.from({ length: 5 }, (_, index) => {
        const starVal = index + 1; // starVal represents the star number (1 to 5)
        return (
          <span
            onClick={() => handleRating(starVal)} // Handling the click event to update rating
            key={index} // Key for the mapped elements (stars)
            className={`text-xl sm:text-2xl cursor-pointer transition-colors ${
              starVal <= rating ? "text-yellow-500" : "text-gray-400" // Conditional classes to change star color based on the rating
            }`}
          >
            &#9733; {/* Unicode for star symbol */}
          </span>
        );
      })}
    </div>
  );
};

export default Rating; // Exporting the Rating component
