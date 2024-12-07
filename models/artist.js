const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },  // You can add an image URL or path for artist image
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
