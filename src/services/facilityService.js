const { Facility } = require('../models');

exports.getAllFacService = async () => {
  const allFacility = await Facility.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  return allFacility;
};

exports.getFacService = async (id) => {
  const facility = await Facility.findOne({
    where: { id: Number(id) },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  console.log(facility);
  return facility;
};
