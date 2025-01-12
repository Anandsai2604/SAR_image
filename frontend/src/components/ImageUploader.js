import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';

function ImageUploader() {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    startDate: '',
    endDate: '',
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude || !formData.startDate || !formData.endDate) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/fetch-images', formData);
      console.log(response.data);

      if (response.data && response.data.images) {
        // Correct image URLs if necessary
        const correctedImages = response.data.images.map((image) =>
          image.replace(/\\/g, '/').replace(/ /g, '%20')
        );

        setImages(correctedImages);
      } else {
        setError('No images found');
      }
    } catch (error) {
      setError('Error fetching images');
    } finally {
      setLoading(false);
    }
  };

  const fadeInImages = useSpring({
    opacity: images.length > 0 ? 1 : 0,
    transform: images.length > 0 ? 'scale(1)' : 'scale(0.9)',
    config: { tension: 300, friction: 10 },
  });

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <div className="d-flex justify-content-center">
        <div className="card" style={{ width: '50%' }}>
          <div className="card-body">
            <h5 className="card-title">Fetch Images</h5>

            <form onSubmit={handleSubmit}>
              {/* Form Inputs */}
              <div className="mb-3">
                <label htmlFor="latitude" className="form-label">Latitude</label>
                <input
                  type="text"
                  className="form-control"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="longitude" className="form-label">Longitude</label>
                <input
                  type="text"
                  className="form-control"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="startDate" className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
                {loading ? 'Loading...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-4">
          <h5>Returned Images</h5>
          <animated.div style={fadeInImages}>
            <div>
              {images.map((image, index) => (
                <div key={index} className="mb-4">
                  <img
                    src={image}
                    alt={`Returned ${index}`}
                    style={{
                      width: '100%',
                      maxWidth: '600px',
                      height: 'auto',
                      display: 'block',
                      margin: '0 auto',
                    }}
                    onError={() => console.error(`Error loading image: ${image}`)}
                  />
                </div>
              ))}
            </div>
          </animated.div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;

// import React, { useState } from 'react';
// import { useSpring, animated } from 'react-spring';
// import axios from 'axios';

// function ImageUploader() {
//   const [formData, setFormData] = useState({
//     latitude: '',
//     longitude: '',
//     startDate: '',
//     endDate: '',
//   });

//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.latitude || !formData.longitude || !formData.startDate || !formData.endDate) {
//       setError('All fields are required');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await axios.post('http://localhost:5000/fetch-images', formData);
//       console.log(response.data);

//       if (response.data && response.data.images) {
//         // Correcting image URLs by replacing backslashes with forward slashes
//         const correctedImages = response.data.images.map((image) =>
//           image.replace(/\\/g, '/').replace(/ /g, '%20') 
//         );

//         // Adding the base URL (http://localhost:5000) if needed
//         // const fullImageUrls = correctedImages.map((image));
//         const fullImageUrls=response.data.images;
//         setImages(fullImageUrls);
//         //setImages(['http://localhost:5000/uploads/Screenshot%20(607).png'])
//         console.log(fullImageUrls)
//       } else {
//         setError('No images found');
//       }
//     } catch (error) {
//       setError('Error fetching images');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fadeInImages = useSpring({
//     opacity: images.length > 0 ? 1 : 0,
//     transform: images.length > 0 ? 'scale(1)' : 'scale(0.9)',
//     config: { tension: 300, friction: 10 },
//   });

//   return (
//     <div style={{ minHeight: '100vh' }}>
//       <div className="d-flex justify-content-center">
//         <div className="card" style={{ width: '50%' }}>
//           <div className="card-body">
//             <h5 className="card-title">Fetch Images</h5>

//             <form onSubmit={handleSubmit}>
//               {/* Form Inputs */}
//               <div className="mb-3">
//                 <label htmlFor="latitude" className="form-label">Latitude</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="latitude"
//                   name="latitude"
//                   value={formData.latitude}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="longitude" className="form-label">Longitude</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="longitude"
//                   name="longitude"
//                   value={formData.longitude}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="startDate" className="form-label">Start Date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   id="startDate"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="endDate" className="form-label">End Date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   id="endDate"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               {error && <div className="alert alert-danger">{error}</div>}

//               <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
//                 {loading ? 'Loading...' : 'Submit'}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//       {images.length > 0 && (
//         <div className="d-flex justify-content-center">
//           <div className="card mt-4" style={{ width: '50%' }}>
//             <div className="card-body">
//               <h5>Returned Images</h5>
//               <animated.div style={fadeInImages}>
//                 <div className="d-flex flex-wrap">
//                   {images.map((image, index) => (
//                     <div key={index} className="m-2">
//                       <img
//                         src={image} // Full URL with corrected forward slashes
//                         alt={`Returned ${index}`}
//                         className="img-fluid"
//                         style={{ maxWidth: '200px', objectFit: 'contain' }}
//                         onError={() => console.error(`Error loading image: ${image}`)} // Log error if image fails to load
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </animated.div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ImageUploader;


/*import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';

function ImageUploader() {
  const [file, setFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [colorizedImageUrl, setColorizedImageUrl] = useState(null);

  const [formData, setFormData] = useState({
    image: null,
    option: 'Agriculture', // Default option
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);

    // Update form data with the selected file
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
      const form = new FormData();
      form.append('image', formData.image);
      form.append('option', formData.option);

      const response = await axios.post('http://localhost:5000/answer', form, {
        responseType: 'blob', // Expecting a binary response (image)
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle and display the returned blob
      if (response.data.type.startsWith('image/')) {
        const url = URL.createObjectURL(response.data);
        setColorizedImageUrl(url);
      } else {
        const text = await response.data.text();
        console.error('Unexpected server response:', text);
      }
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
*/