import React from 'react';
import { useSpring, animated } from 'react-spring';
import { Link } from 'react-router-dom';
import image from "D:\\project\\
SAR_IMAGE\\frontend\\src\\components\\remotesensing.webp";

function Home() {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  return (
    <animated.div style={fadeIn} className="container py-5">
      <h1 className="text-center mb-5">SAR Image Colorization</h1>
      
      {/* SAR Image and Description */}
      <div className="text-center mb-4">
      <img src={image} alt="SAR Image Example" className="img-fluid"  style={{ maxWidth: '500px', maxHeight: '300px', objectFit: 'cover' }}/>
        <p className="mt-3">
          Synthetic Aperture Radar (SAR) is used to capture detailed images of the earth's surface, even under adverse weather conditions. The colorization applied to this image enhances the visual understanding of the terrain and features.
        </p>
      </div>

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

export default Home;