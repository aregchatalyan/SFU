const mongo = require('mongoose');

module.exports = async (mongoUri) => {
  await mongo.connect(mongoUri);
}