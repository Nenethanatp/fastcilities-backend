const cloudinary = require('../config/cloudinary');

exports.upload = async (path, publicId) => {
  const option = {
    use_filename: true, //use original file name (set false will use public id (if have) or random generate)
    overwrite: true,
    unique_filename: false, // false will random char at end of file mean will be unique
  };

  if (publicId) {
    option.public_id = publicId;
  }

  const res = await cloudinary.uploader.upload(path, option);
  return res.secure_url;
};

exports.getPublicId = (url) => {
  const splitSlash = url.split('/');
  return splitSlash[splitSlash.length - 1].split('.')[0];
};
