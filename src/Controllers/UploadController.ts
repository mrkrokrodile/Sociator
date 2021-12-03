import UserModel from "../models/UserModel";
import fs from "fs";
import { promisify } from "util";
import { Request, Response } from "express";
import { FileFilterCallback } from "multer";
import { uploadErrors } from "../utils/errors.utils";
const pipeline = promisify(require("stream").pipeline);

export class UploadController {

    static uploadProfil = async (req: Request, res: Response) => {
        try {
            if (
              req.file.mimetype != "image/jpg" &&
              req.file.mimetype != "image/png" &&
              req.file.mimetype != "image/jpeg"
            )
              throw Error("invalid file");
        
            if (req.file.size > 500000) throw Error("max size");
          } catch (err) {
            const errors = uploadErrors(err);
            return res.status(201).json({ errors });
          }

        const fileName = req.body.name + ".jpg"

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../client/public/uploads/profil/${fileName}`
            )
        )
    };
}