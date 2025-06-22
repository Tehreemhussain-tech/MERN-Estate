import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

//get dirname of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//set storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //set upload destination folder
        // Go one level up (to api/../uploads), i.e. the uploads folder inside api
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        //set file name to be a unique timestamp + file extension
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// create multer instance with storage configuration
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024}, //limit file size to 2MB
}).array('images', 6); //Max 6 files with field name 'images'

export default upload;