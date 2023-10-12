const multer = require('multer');
const Jimp = require('jimp');
const sharp = require('sharp');
const path = require('path');
const uuid = require('uuid').v4;
const fse = require('fs-extra');

const { AppError } = require('../utils');


class ImageService {



    static initUploadMiddleware(name) {
        const multerStorage = multer.memoryStorage();
        
        const multerFilter = (req, file, cbk) => {
            if (file.mimetype.startsWith('image/')) {
                cbk(null, true);
            } else {
                cbk(new AppError(401, 'Not authorized'), false);
            }
        };

        return multer({
            storage: multerStorage,
            fileFilter: multerFilter,
        }).single(name);
    }
    
    static async save(file, options, ...pathSegments) {
        if (file.size > (options?.maxSize ? options.maxsize * 1024 * 1024 : 1 * 1024 * 1024)) {
            throw new AppError(400, 'File is too large');
        }

        const fileName = `${options}-${uuid()}.jpeg`;
        const fullFilePath = path.join(process.cwd(), 'public', );

        await fse.ensureDir(fullFilePath);
        Jimp.read(file.buffer)
        .then((file) => {
          return file
            .resize(250, 250)
            .quality(90)
            .write(path.join(fullFilePath, fileName)); 
        })
        .catch((err) => {
          console.error(err);
        });

        return path.join(...pathSegments, fileName)
      }
    }

module.exports = ImageService;

