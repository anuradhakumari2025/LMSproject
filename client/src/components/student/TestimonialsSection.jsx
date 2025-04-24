import React, { useContext } from "react"; // Importing React and useContext hook
import { assets, dummyTestimonial } from "../../assets/assets"; // Importing assets (images, etc.) and dummy testimonial data
import { AppContext } from "../../context/AppContext"; // Importing AppContext to use the shared context

const TestimonialsSection = () => {
  const { currency, calculateRating } = useContext(AppContext); // Using context to access shared data (currency and calculateRating)

  return (
    <div className="pb-14 md:px-0 px-8"> {/* Container for the testimonials section */}
      <h2 className="text-3xl text-white font-medium ">Testimonials</h2> {/* Title for the section */}
      <p className="text-gray-300 md:text-base mt-3">
        Hear what our students have to say about their learning journey. <br />
        Real stories, real success, and real impact!
      </p> {/* Subtitle/description */}
      
      {/* Grid to display each testimonial */}
      <div className="grid grid-cols-auto-fit gap-8 mt-10">
        {/* Mapping over dummyTestimonial to display each testimonial */}
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index} // Unique key for each mapped testimonial
            className="border border-gray-50 pb-6 text-sm text-left rounded-lg bg-white shadow-[0px_4px_15px_0px] overflow-hidden shadow-gray-100"
          >
            {/* Header section with user information */}
            <div className="flex gap-4 items-center px-4 py-5 bg-gray-800">
              <img
                className="h-12 w-12 rounded-full" // Styling for the profile image
                src={testimonial.image} // User's image
                alt={testimonial.name} // Alt text for the image
              />
              <div>
                <h1 className="text-slate-100 font-medium text-lg">
                  {testimonial.name} {/* Displaying the name of the testimonial author */}
                </h1>
                <p className="text-gray-300">{testimonial.role}</p> {/* Displaying the role of the testimonial author */}
              </div>
            </div>
            
            {/* Body of the testimonial */}
            <div className="p-5 pb-7">
              {/* Rating stars */}
              <div className="flex gap-1">
                {/* Looping to display 5 stars for the rating */}
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i} // Unique key for each star
                    className="h-5"
                    src={
                      i < Math.floor(testimonial.rating) // If the current index is less than the rating, show filled star
                        ? assets.star // Filled star image
                        : assets.star_blank // Empty star image
                    }
                  />
                ))}
              </div>
              {/* Displaying the feedback text */}
              <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
            </div>
            
            {/* Link to read more */}
            <a href="" className="text-blue-500 underline px-5 font-medium text-normal">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection; // Exporting the TestimonialsSection component
