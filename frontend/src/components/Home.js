import React from 'react';
import { useSpring, animated } from 'react-spring';
import { Link } from 'react-router-dom';

function Home() {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  return (
    <animated.div style={fadeIn} className="container py-5">
      <h1 className="text-center mb-5">SAR Image Colorization</h1>
      
      {/* First Box */}
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Upload SAR Image</h2>
          <p>Click the button below to navigate to the Image Uploader page.</p>
          <Link to="/image-uploader">
            <button className="btn btn-primary w-100 mt-3">Go to Image Uploader</button>
          </Link>
        </div>
      </div>
      
      {/* Second Box with Similar Content */}
      <div className="card">
        <div className="card-body">
          <h2 className="h4 mb-3">Explore More Features</h2>
          <p>Learn more about SAR image processing and its applications.</p>
          <Link to="/Feature1">
            <button className="btn btn-secondary w-100 mt-3">Explore Features</button>
          </Link>
        </div>
      </div>
    </animated.div>
  );
}

export default Home;
