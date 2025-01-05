import React from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';

function Header() {
  const props = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 300, friction: 10 },
  });

  return (
    <animated.header style={props} className="bg-dark text-white py-3">
      <div className="container">
        <nav className="d-flex justify-content-between align-items-center">
          <Link to="/" className="text-white text-decoration-none">
            <h1 className="h4 m-0">SAR Image Colorizer</h1>
          </Link>
          <ul className="list-unstyled d-flex m-0">
            <li className="me-3">
              <Link to="/" className="text-white text-decoration-none">Home</Link>
            </li>
            <li>
              <Link to="/about" className="text-white text-decoration-none">About</Link>
            </li>
          </ul>
        </nav>
      </div>
    </animated.header>
  );
}

export default Header;

