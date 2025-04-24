import React from 'react'; // Importing React library
import Hero from '../../components/student/Hero'; // Importing Hero component (likely for the main banner or intro)
import Companies from '../../components/student/Companies'; // Importing Companies component (likely showing company logos or partners)
import CoursesSection from '../../components/student/CoursesSection'; // Importing CoursesSection component (for displaying courses)
import TestimonialsSection from '../../components/student/TestimonialsSection'; // Importing TestimonialsSection component (for displaying user reviews)
import CallToAction from '../../components/student/CallToAction'; // Importing CallToAction component (likely a prompt to take action)
import Footer from '../../components/student/Footer'; // Importing Footer component (likely for the bottom section of the page)

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'> {/* Using flexbox for layout with vertical stacking and centered text */}
      <Hero /> {/* Rendering Hero component at the top of the page */}
      <Companies /> {/* Rendering Companies component below the Hero */}
      <CoursesSection /> {/* Rendering CoursesSection component to show available courses */}
      <TestimonialsSection /> {/* Rendering TestimonialsSection component to display reviews or testimonials */}
      <CallToAction /> {/* Rendering CallToAction component to encourage users to take the next step */}
      <Footer /> {/* Rendering Footer component at the bottom of the page */}
    </div>
  );
};

export default Home; // Exporting the Home component for use in other parts of the application
