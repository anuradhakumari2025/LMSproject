import React, { useState } from "react"; // Importing React and useState hook
import { assets } from "../../assets/assets"; // Importing assets (e.g., search icon)
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation

const SearchBar = ({ data }) => {
  const navigate = useNavigate(); // Hook to navigate between pages
  const [input, setInput] = useState(data ? data : ""); // State to store the search input, initialized with 'data' prop or an empty string

  // Function to handle search form submission
  const onSearchHandler = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    navigate("/course-list/" + input); // Navigate to the course list page with the input as part of the URL
    // setInput('') // Optionally reset the input field after search (currently commented out)
  };

  return (
    <form
      onSubmit={onSearchHandler} // Attach the search handler to the form submit event
      action="" // Action attribute (empty since we're handling the submission in JS)
      className="max-w-xl w-full md:h-12 h-10 flex items-center bg-white  border-gray-500/20 rounded" // Styling for the form
    >
      <img src={assets.search_icon} alt="" className="md:w-auto w-10 px-3" /> {/* Search icon */}
      <input
        onChange={(e) => setInput(e.target.value)} // Update input state when the user types
        value={input} // Bind the input value to the state
        type="text"
        placeholder="Search for courses" // Placeholder text for the input field
        className="w-full h-full outline-none text-gray-500/80 text-lg" // Styling for the input field
      />
      <button
        type="submit" // Submit the form when the button is clicked
        className="bg-blue-600 rounded text-lg h-full text-white md:px-10 px-7 md:py-3 py-2" // Styling for the submit button
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar; // Exporting the SearchBar component
