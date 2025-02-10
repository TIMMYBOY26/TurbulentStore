import multer from 'multer';

// Configure storage
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

// Create the upload middleware
const upload = multer({ storage });

// Export the upload middleware
export default upload;