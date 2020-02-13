const Dev = require('../models/Dev');
const stringToArray = require('../utils/StringToArray');

module.exports = {
  async index(req, res) {
    // Buscar devs num raio de 10km
    // Filtrar por tecnologias
    const { latitude, longitude, techs } = req.query;

    const techsArray = stringToArray(techs);

    const devs = await Dev.find({
      techs: {
        $in: techsArray,
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000,
        }
      }
    })

    return res.json({ devs });
  }
}