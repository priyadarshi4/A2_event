const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true }, // Linking to Artist
    audio: { type: String, required: true },
    icon: { type: String, required: true }
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
