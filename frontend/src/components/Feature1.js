import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';

function Feature1() {
  const [file, setFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [colorizedImageUrl, setColorizedImageUrl] = useState(null);
  const [percentages, setPercentages] = useState({
    water: 0,
    urban: 0,
    green: 0,
    land: 0,
  });

  // This state will hold the form data including the file
  const [formData, setFormData] = useState({
    image: null, // To store the uploaded image
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);

    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file);
    setUploadedImageUrl(tempUrl);

    // Update the formData state with the selected file
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.tif'],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!formData.image) return; // Ensure an image is selected

    const data = new FormData();
    data.append('image', formData.image); // Append the image from the formData

    try {
      const response = await axios.post('http://localhost:5000/answer', data, {
        responseType: 'json', // Expecting JSON response for percentages
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setColorizedImageUrl(response.data.colorizedImageUrl); // Assuming the response includes this URL
      setPercentages(response.data.percentages); // Assuming the response includes percentages
    } catch (error) {
      console.error('Error uploading or processing image:', error);
    }
  };

  const dropzoneAnimation = useSpring({
    from: { transform: 'scale(0.9)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    config: { tension: 300, friction: 10 },
  });

  const buttonAnimation = useSpring({
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    delay: 300,
  });

  const fadeInUploaded = useSpring({
    opacity: uploadedImageUrl ? 1 : 0,
    transform: uploadedImageUrl ? 'scale(1)' : 'scale(0.9)',
    config: { tension: 300, friction: 10 },
  });

  const fadeInColorized = useSpring({
    opacity: colorizedImageUrl ? 1 : 0,
    transform: colorizedImageUrl ? 'scale(1)' : 'scale(0.9)',
    config: { tension: 300, friction: 10 },
  });

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="d-flex justify-content-center">
        <div className="card" style={{ width: '50%' }}>
          <div className="card-body">
            <animated.div style={dropzoneAnimation}>
              <div
                {...getRootProps()}
                className={`border border-2 border-dashed rounded p-4 text-center cursor-pointer ${
                  isDragActive ? 'border-primary bg-light' : 'border-secondary'
                }`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="d-flex flex-column align-items-center">
                    <i className="bi bi-image fs-1 text-secondary mb-2"></i>
                    <p className="text-muted small">{file.name}</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column align-items-center">
                    <i className="bi bi-cloud-upload fs-1 text-secondary mb-2"></i>
                    <p className="text-muted small">
                      Drag & drop an image here, or click to select one
                    </p>
                  </div>
                )}
              </div>
            </animated.div>

            <animated.div style={buttonAnimation}>
              <button
                onClick={handleUpload}
                disabled={!formData.image}
                className="btn btn-primary w-100 mt-3"
              >
                Upload and Process
              </button>
            </animated.div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className="card mt-4" style={{ width: '50%' }}>
          <div className="card-body">
            <div className="mb-3">
              <h5>Uploaded and Processed Images</h5>
              <div className="d-flex justify-content-between">
                <div className="w-100">
                  <h6>Uploaded Image</h6>
                  {uploadedImageUrl ? (
                    <animated.div style={fadeInUploaded}>
                      <img
                        src={uploadedImageUrl}
                        alt="Uploaded Image"
                        className="img-fluid w-100"
                        style={{ objectFit: 'contain' }}
                      />
                    </animated.div>
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center bg-light text-muted"
                      style={{ height: '300px' }}
                    >
                      Uploaded image will appear here
                    </div>
                  )}
                </div>
                <div className="w-100 mt-3 mt-md-0">
                  <h6>Processed Image</h6>
                  {colorizedImageUrl ? (
                    <animated.div style={fadeInColorized}>
                      <img
                        src={colorizedImageUrl}
                        alt="Processed Image"
                        className="img-fluid w-100"
                        style={{ objectFit: 'contain' }}
                      />
                    </animated.div>
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center bg-light text-muted"
                      style={{ height: '300px' }}
                    >
                      Processed image will appear here
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h6>Percentage Breakdown</h6>
              <ul>
                <li>Water: {percentages.water.toFixed(2)}%</li>
                <li>Urban: {percentages.urban.toFixed(2)}%</li>
                <li>Green: {percentages.green.toFixed(2)}%</li>
                <li>Land: {percentages.land.toFixed(2)}%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feature1;