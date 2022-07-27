import { diskStorage } from 'multer';
// import path, { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
export const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const filename: string =
      path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
    const extension: string = path.parse(file.originalname).ext;
    callback(null, `${filename}${extension}`);
    // callback(null, generateFilename(file));
  },
});

// function generateFilename(file) {
//   return `${Date.now()}.${extname(file.originalname)}`;
// }
