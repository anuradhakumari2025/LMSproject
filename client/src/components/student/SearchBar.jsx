import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({data}) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");

  const onSearchHandler = (event) => {
    event.preventDefault();
    navigate("/course-list/" + input);
    // setInput('')
  };
  return (
    <form
      onSubmit={onSearchHandler}
      action=""
      className="max-w-xl w-full md:h-12 h-10 flex items-center bg-white  border-gray-500/20 rounded"
    >
      <img src={assets.search_icon} alt="" className="md:w-auto w-10 px-3" />
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search for courses"
        className="w-full h-full outline-none text-gray-500/80 text-lg"
      />
      <button
        type="submit"
        className="bg-blue-600 rounded text-lg h-full text-white md:px-10 px-7 md:py-3 py-2 "
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
