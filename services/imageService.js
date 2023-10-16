const multer = require('multer');
const fse = require('fs-extra');
const path = require('path');


class ImageService {

    static initUploadMiddleware(name) {
        const multerStorage = multer.diskStorage({
            destination: (req, file , cbk) => {
                cbk(null, 'tmp');
            },
            filename: (req, file, cbk) => {
                const extension = file.mimetype.split('/')[1];
        
                cbk(null, `${req.user.id}-${file.originalname.split('.')[0]}.${extension}`);
            },
        });    

        const multerFilter = (req, file, cbk) => {
            if (file.mimetype.startsWith('image/')) {
                cbk(null, true);
            } else {
                    cbk(new AppError(401, 'Not authorized'), false);
                }
        };

        return multer ({
            storage: multerStorage,
            fileFilter: multerFilter,
        }).single(name)
    };

    static findUserAvatarFile = async (userId) => {
    
        const tmpFolderPath = path.join(process.cwd(), 'tmp');
        const files = await fse.readdir(tmpFolderPath);
        const userAvatarFile = files.find(file => file.startsWith(`${userId}-`));
    
        if (userAvatarFile) {
            return path.join(tmpFolderPath, userAvatarFile);
        }
    
        return null; 
    };
}

module.exports = ImageService