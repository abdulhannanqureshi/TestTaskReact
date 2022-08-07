import Jimp from 'jimp';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';

const resizeImage = async (
  sourcePath: any,
  destinationPath: any,
  width: any
) => {
  const lenna = await Jimp.read(sourcePath);
  lenna.resize(width, Jimp.AUTO).quality(100).write(destinationPath); // save
  return true;
};

// Upload image File using multer
var storageFile: StorageEngine = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
  },
});

const storage: any = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationPath: any;
    let fieldname: any = file.fieldname;

    switch (fieldname) {
      case 'blogFeatureImage':
        destinationPath = 'app/public/uploads/blogs';
        break;
      case 'teamMemberImage':
        destinationPath = 'app/public/uploads/team';
        break;
      case 'pressFeatureImage':
        destinationPath = 'app/public/uploads/pressRelease';
        break;
      case 'bannerImage':
      case 'bodySectionImage1':
      case 'bodySectionImage2':
      case 'bodySectionImage3':
      case 'bodySectionImage4':
        destinationPath = 'app/public/uploads/course';
        break;
      case 'marketBannerImage':
      case 'blockImage1':
      case 'blockImage2':
      case 'blockImage3':
      case 'blockImage4':
      case 'blockImage5':
      case 'blockImage6':
      case 'blockImage7':
      case 'blockImage8':
      case 'blockImage9':
      case 'blockImage10':
        destinationPath = 'app/public/uploads/market';
        break;
      case 'labsImage':
        destinationPath = 'app/public/uploads/labs';
        break;
      case 'certificateImage':
        destinationPath = 'app/public/uploads/badgeImages';
        break;

      default:
        break;
    }
    // fs.mkdirSync(destinationPath, { recursive: true });
    cb(null, path.join(path.dirname(__dirname), destinationPath));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  },
});
// const videoUpload = multer({
//   limits: {
//   fileSize: 10000000
//   },
//   destination: function (req, file, cb) {
//     cb(null, path.join(path.dirname(__dirname), 'app/public/uploads/course'));
//   },
//   fileFilter(req, file, cb) {
//     // upload only mp4 and mkv format
//     if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
//        return cb(new Error('Please upload a video'))
//     }
//     cb(undefined, true)
//  }
// })
const upload = multer({ storage: storage });
export { resizeImage, storageFile, upload };
