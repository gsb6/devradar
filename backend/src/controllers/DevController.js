const axios = require('axios');
const Dev = require('../models/Dev');

const stringToArray = require('../utils/StringToArray');
const { findConnections, sendMessage } = require('../websocket');

// Geralmente tem 5 funções:

// index: retornar uma lista de elementos
// show: retornar um único elementos
// store: criar
// update: atualizar
// destroy: deletar


module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const techsArray = stringToArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }

      const response = await axios.get(`https://api.github.com/users/${github_username}`);

      const { name = login, avatar_url, bio } = response.data;

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return res.json(dev);
  }
}