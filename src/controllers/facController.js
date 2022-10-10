const cloudinary = require('../utils/cloudinary');

const { Facility } = require('../models');
const {
  getAllFacService,
  getFacService,
} = require('../services/facilityService');

exports.getAllFac = async (req, res, next) => {
  try {
    const allFacility = await getAllFacService();
    res.status(200).json({ allFacility });
  } catch (err) {
    next(err);
  }
};

exports.getOneFac = async (req, res, next) => {
  try {
    const { id } = req.params;

    const facility = await getFacService(Number(id));
    res.status(200).json({ facility });
  } catch (err) {
    next(err);
  }
};

exports.updateFac = async (req, res, next) => {
  try {
    const file = req.file;
    const facId = req.params.id;
    const updatedFac = req.body;

    const fac = await getFacService(facId);
    let image = fac.image;

    if (file) {
      const secureUrl = await cloudinary.upload(
        file.path,
        image ? cloudinary.getPublicId(image) : null
      );
      updatedFac.image = secureUrl;
    }

    await Facility.update(updatedFac, { where: { id: facId } });

    const newUpdateFac = await getFacService(facId);
    res.status(200).json({ newUpdateFac });

    // if (file){
    //   const secureUrl = await cloudinary.upload(
    //     file.path,
    //     image ? cloudinary
    //   )
    // }

    //  await Facility.update(updateData)

    res.status(200).json({ fac });
  } catch (err) {
    next(err);
  } finally {
    if (file) {
      fs.unlinkSync(file.path);
    }
  }
};

exports.createFac = async (req, res, next) => {
  try {
    const facData = req.body;
    facData.capacity = Number(facData.capacity);
    if (facData.capacity === 0) {
      facData.capacity = null;
    }
    facData.durationLimit = Number(facData.durationLimit);

    console.log(facData);
    const file = req.file;

    const secureUrl = await cloudinary.upload(file.path);
    facData.image = secureUrl;

    const newFacility = await Facility.create(facData); // return that created row
    res.status(200).json({ newFacility });
  } catch (err) {
    next(err);
  } finally {
    fs.unlinkSync(file.path);
  }
};
