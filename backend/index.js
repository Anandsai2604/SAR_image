const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  console.log('Uploads directory not found, creating it.');
  fs.mkdirSync(uploadDir);  // Create the directory if it doesn't exist
} else {
  console.log('Uploads directory already exists.');
}

// Multer configuration for file uploads using memoryStorage
const storage = multer.memoryStorage();  // Store file in memory (buffer)
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('File MIME type:', file.mimetype);  // Log MIME type
    console.log('File Extension:', path.extname(file.originalname));  // Log file extension

    // Allow jpg, jpeg, and png images
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(new Error('Only .jpg, .jpeg, and .png files are allowed'), false); // Reject non-jpeg/png files
    }
  },
});

app.post('/answer', upload.single('image'), async (req, res) => {
  const file = req.file;
  const option = req.body.option;

  //console.log('Received file:', file);  // This will show the uploaded file details
  console.log('Received option:', option);  // This will show the selected option

  try {
    if (!file) {
      return res.status(400).send('No file uploaded');
    }

    // Manually write the file using fs to ensure it's saved
    const imagePath = path.join(__dirname, 'uploads', file.originalname);
    console.log('Saving file to:', imagePath);  // Log file path

    // Write the file manually using the buffer
    fs.writeFileSync(imagePath, file.buffer);

    // Check if the file exists now
    if (fs.existsSync(imagePath)) {
      res.send('File uploaded and saved successfully!');
    } else {
      res.status(500).send('Error saving the file');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error occurred while uploading the image');
  }
});

app.listen(5000, () => {
  console.log('Node.js server running on port 5000');
});



/*const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/answer', async (req, res) => {
  const file = req.file;
  const option = req.body.option;
  console.log(file);
  console.log(option);
  try {
    // Set the image path
    const imagePath = path.join(__dirname, 'output_image.jpeg');

    // Check if the file exists before sending it
    if (fs.existsSync(imagePath)) {
      // Send the image to the frontend
      res.sendFile(imagePath);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error occurred while sending the image');
  }
});

app.listen(5000, () => {
  console.log('Node.js server running on port 5000');
});

*/

/*const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/answer', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Forward the image to the Flask server
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));

    const flaskResponse = await axios.post('http://localhost:5001/classify', formData, {
      headers: formData.getHeaders(),
    });

    // Delete the uploaded image from the Node.js server
    fs.unlinkSync(filePath);

    // Return the response from the Flask server
    res.json(flaskResponse.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error occurred during image classification');
  }
});

app.listen(5000, () => {
  console.log('Node.js server running on port 5000');
});
*/