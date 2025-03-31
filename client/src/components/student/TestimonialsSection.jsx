import React, { useContext } from "react";
import { assets, dummyTestimonial } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const TestimonialsSection = () => {
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <div className="pb-14 md:px-0 px-8">
      <h2 className="text-3xl text-white font-medium ">Testimonials</h2>
      <p className="text-gray-300 md:text-base mt-3">
      Hear what our students have to say about their learning journey. <br />
      Real stories, real success, and real impact!
      </p>
      <div className="grid grid-cols-auto-fit gap-8 mt-10">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="border border-gray-50 pb-6 text-sm text-left rounded-lg bg-white shadow-[0px_4px_15px_0px] overflow-hidden shadow-gray-100"
          >
            <div className="flex gap-4 items-center px-4 py-5 bg-gray-800">
              <img
                className="h-12 w-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h1 className="text-slate-100 font-medium text-lg">
                  {testimonial.name}
                </h1>
                <p className="text-gray-300">{testimonial.role}</p>
              </div>
            </div>
            <div className="p-5 pb-7">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="h-5"
                    src={
                      i < Math.floor(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                  />
                ))}
              </div>
              <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
            </div>
            <a href="" className="text-blue-500 underline px-5 font-medium text-normal">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
