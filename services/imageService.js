const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
const fse = require('fs-extra');
const Jimp = require('jimp');
const AppError = require('../utils/appError');

const avatarDirName = 'avatars';
const uploadDir = path.join(process.cwd(), 'tmp');
const saveDir = path.join(process.cwd(), 'public', avatarDirName);

class ImageService {
  static upload(name) {
    const storage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, uploadDir);
      },
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      },
    });

    const fileFilter = (req, file, callback) => {
      file.mimetype.startsWith('image')
        ? callback(null, true)
        : callback(
            new AppError(400, 'Downloaded file must be image type'),
            false
          );
    };

    return multer({
      storage,
      fileFilter,
      limits: { fileSize: 2 * 1024 * 1024 },
    }).single(name);
  }

  static async save(id, file, options) {
    const width = options.width || 250;
    const height = options.height || 250;
    const ext = file.mimetype.split('/')[1];
    const originalName = file.originalname;
    const fileName = `${id}-${uuid()}.${ext}`;

    await fse.ensureDir(saveDir);

    const avatars = await fse.readdir(saveDir);
    if (avatars.length) {
      avatars.forEach((avatar) => {
        if (avatar.startsWith(id)) fse.remove(path.join(saveDir, avatar));
      });
    }

    const image = await Jimp.read(path.join(uploadDir, originalName));

    image
      .cover(
        width,
        height,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_TOP
      )
      .quality(90)
      .writeAsync(path.join(saveDir, fileName));

    await fse.remove(path.join(uploadDir, originalName));

    return path.join(avatarDirName, fileName);
  }
}

module.exports = ImageService;
