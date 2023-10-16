const fse = require('fs-extra');
const path = require('path');

exports.findUserAvatarFile = async (userId) => {
    console.log(userId)

    const tmpFolderPath = path.join(process.cwd(), 'tmp');
    const files = await fse.readdir(tmpFolderPath);
    const userAvatarFile = files.find(file => file.startsWith(`${userId}-`));

    if (userAvatarFile) {
        return path.join(tmpFolderPath, userAvatarFile);
    }

    return null; 
};
