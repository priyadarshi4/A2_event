const express = require("express");
const router = express.Router();
const songModel= require("../models/song");
const Artist = require('../models/artist');




router.get("/",async(req,res)=>{
    try {
        // Fetch all artists
        const artists = await Artist.find();  

        // Fetch all songs (or you can filter by artist if necessary)
        const songs = await songModel.find(); 

        // Render the 'artists-songs' view and pass both artists and songs
        res.render('music', { artists, songs });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error fetching artists and songs");
    }
})



module.exports = router