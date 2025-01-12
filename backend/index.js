const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  console.log('Uploads directory not found, creating it.');
  fs.mkdirSync(uploadDir);
} else {
  console.log('Uploads directory already exists.');
}

// Multer configuration for file uploads using memoryStorage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('File MIME type:', file.mimetype);
    console.log('File Extension:', path.extname(file.originalname));

    // Allow jpg, jpeg, and png images
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, and .png files are allowed'), false);
    }
  },
});

// app.post('/fetch-images', (req, res) => {
//   const { latitude, longitude, startDate, endDate } = req.body;
//   console.log(req.body);
  
//   // Logic to find the images based on the given parameters
//   const folderPath = path.join(__dirname, 'uploads');
  
//   const imagesFolder = path.join(__dirname, 'uploads'); // Folder where images are stored

//   fs.readdir(imagesFolder, (err, files) => {
//     if (err) {
//       return res.status(500).send('Error reading images folder');
//     }

//     // Filter out only the image files (can add more extensions if needed)
//     const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg'));

//     // Map image files to full URLs (complete path with domain and port)
//     const imagePaths = imageFiles.map(file => `http://localhost:${5000}/uploads/${file}`);

//     console.log(imagePaths); // For debugging purposes
//     // Send the image paths as a JSON response
//     res.json({ images: imagePaths });
//   });
// });

// const express = require('express');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// app.use(express.json());

// app.post('/fetch-images', (req, res) => {
//   const { latitude, longitude, startDate, endDate } = req.body;
//   console.log(req.body);

//   // Path to the folder where images are stored
//   const imagesFolder = path.join(__dirname, 'uploads');

//   fs.readdir(imagesFolder, (err, files) => {
//     if (err) {
//       return res.status(500).send('Error reading images folder');
//     }

    

//     // Filter out only the image files that do NOT include "original" in the filename
//     const imageFiles = files.filter(
//       file =>
//         (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) &&
//         !file.includes('original')
//     );

//     // Map image files to full URLs (complete path with domain and port)
//     const imagePaths = imageFiles.map(file => `http://localhost:5000/uploads/${file}`);

//     console.log(imagePaths); // For debugging purposes
//     // Send the image paths as a JSON response
//     res.json({ images: imagePaths });
//   });
// });

app.post('/fetch-images', (req, res) => {
  const { latitude, longitude, startDate, endDate } = req.body;
  console.log(req.body);

  // Path to the folder where images are stored
  const imagesFolder = path.join(__dirname, 'uploads');

  // Execute the Python script
  const pythonProcess = spawn("D:/myenv/Scripts/python.exe", ['D:/project/SAR_IMAGE/python/pythonApp.py', latitude, longitude, startDate, endDate]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python Output: ${data.toString()}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data.toString()}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);

    if (code !== 0) {
      return res.status(500).send('Error processing Python script');
    }

    // After the Python script execution, read the images folder
    fs.readdir(imagesFolder, (err, files) => {
      if (err) {
        return res.status(500).send('Error reading images folder');
      }

      // Filter out only the image files that do NOT include "original" in the filename
      const imageFiles = files.filter(
        file =>
          (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) &&
          !file.includes('original')
      );

      // Map image files to full URLs (complete path with domain and port)
      const imagePaths = imageFiles.map(file => `http://localhost:5000/uploads/${file}`);

      console.log(imagePaths); // For debugging purposes
      // Send the image paths as a JSON response
      res.json({ images: imagePaths });
    });
  });
});

app.listen(5000, () => {
  console.log('Node.js server running on port 5000');
});



/*const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');  // Used spawn instead of exec

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

      const childPython = spawn('python', ['C:/Users/nemal/OneDrive/Desktop/SAR_image/python/app.py', option, imagePath]);

      childPython.stdout.on('data', (data) => {
        console.log("Processing completed");
      });

      childPython.stderr.on('data', (data) => {
        const resData = data.toString();
        console.log(resData);
      });

      childPython.on("close", (code) => {
        const generatedImagePath = "C:/Users/nemal/OneDrive/Desktop/SAR_image/generated_image_epoch_1.png";

        res.sendFile(generatedImagePath, (err) => {
          if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error occurred while sending the file');
          }
        });
      });

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
});*/