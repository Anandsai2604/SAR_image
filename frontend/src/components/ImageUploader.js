import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';

function ImageUploader() {
  const [file, setFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [colorizedImageUrl, setColorizedImageUrl] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Green'); // State to hold the selected option

  const [formData, setFormData] = useState({
    image: null,
    option: 'Green',
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));

    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file);
    setUploadedImageUrl(tempUrl);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.tif'],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!formData.image) return;

    try {
      console.log(formData);
      const response = await axios.post('http://localhost:5000/answer', formData, {
        responseType: 'blob', // To handle the binary data (image)
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Convert the response blob into a temporary URL
      const url = URL.createObjectURL(response.data);
      setColorizedImageUrl(url); // Set the URL to display the image
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
                      Drag & drop a SAR image here, or click to select one
                    </p>
                  </div>
                )}
              </div>
            </animated.div>

            {/* Dropdown for selecting option */}
            <div className="mt-3">
              <label htmlFor="option" className="form-label">Select Option</label>
              <select
                id="option"
                className="form-select"
                value={formData.option}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    option: e.target.value,
                  }))
                }
              >
                <option value="NULL">N-A</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Barrenland">Barrenland</option>
                <option value="Grassland">Grassland</option>
                <option value="Urban">Urban</option>
              </select>
            </div>

            <animated.div style={buttonAnimation}>
              <button
                onClick={handleUpload}
                disabled={!formData.image}
                className="btn btn-primary w-100 mt-3"
              >
                Upload and Colorize
              </button>
            </animated.div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className="card mt-4" style={{ width: '50%' }}>
          <div className="card-body">
            <div className="mb-3">
              <h5>Uploaded and Colorized Images</h5>
              <div className="d-flex justify-content-between">
                <div className="w-100">
                  <h6>Uploaded Image</h6>
                  {uploadedImageUrl ? (
                    <animated.div style={fadeInUploaded}>
                      <img
                        src={uploadedImageUrl}
                        alt="Uploaded SAR"
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
                  <h6>Colorized Image</h6>
                  {colorizedImageUrl ? (
                    <animated.div style={fadeInColorized}>
                      <img
                        src={colorizedImageUrl}
                        alt="Colorized SAR"
                        className="img-fluid w-100"
                        style={{ objectFit: 'contain' }}
                      />
                    </animated.div>
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center bg-light text-muted"
                      style={{ height: '300px' }}
                    >
                      Colorized image will appear here
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageUploader;
