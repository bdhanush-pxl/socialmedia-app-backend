import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = path.resolve('public', 'temp'); // Dynamically resolve the path
        console.log("Saving file to:", tempDir); // Log the resolved path
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        console.log("File name:", file.originalname); // Log the file name
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
export default upload.single('file');
