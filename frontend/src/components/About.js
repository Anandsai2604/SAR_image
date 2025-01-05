import React from 'react';
import { useSpring, animated } from 'react-spring';

function About() {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 60 },
  });

  return (
    <animated.div style={fadeIn} className="container py-5">
      <h1 className="text-center mb-4">About SAR Image Colorizer</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <p>
            SAR Image Colorizer is an advanced web-based platform that empowers users to upload grayscale SAR (Synthetic Aperture Radar) images and generate high-quality, colorized versions through our sophisticated deep learning pipeline.
          </p>
          <p>
            Our initiative aims to improve the interpretability of SAR images, particularly for space-borne applications. This effort is crucial not only for routine monitoring but also for disaster preparedness.
          </p>
          <p>
            By enhancing the visual appeal and interpretability of SAR images, we contribute to various fields including:
          </p>
          <ul>
            <li>Environmental monitoring</li>
            <li>Urban planning</li>
            <li>Disaster management</li>
            <li>Agricultural assessment</li>
            <li>Climate change studies</li>
          </ul>
          <p>
            Our technology can help prevent incidents like the recent Wayanad landslide by providing early warnings through enhanced colorization and regular image checks, enabling timely action and potentially saving lives.
          </p>
        </div>
      </div>
    </animated.div>
  );
}

export default About;

