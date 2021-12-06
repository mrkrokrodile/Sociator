import { Request } from "express";
import fs from "fs";
import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const dir = './uploads/';
//         mkdir(dir, err => cb(err, dir));
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// });
// if (!fs.existsSync("./thoughts")) {
//     fs.mkdir("./thoughts", (err) => {});
//   }
  
// export const upload = multer({ dest: __dirname + `/thoughts` });
