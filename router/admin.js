const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { adminModel,validateAdminModel} = require("../models/admin");
const jwt = require("jsonwebtoken");
const {validateAdmin , userIsLoggedIn} = require("../middleware/adminValidate");
const {eventModel,validateeventModel} = require("../models/event")
const upload = require("../configuration/multerConnection");
const songModel= require("../models/song");
const Artist = require('../models/artist');

router.get("/create",async(req,res)=>{

    let salt =await bcrypt.genSalt(10);
    let hash =await bcrypt.hash("admin",salt);

    let admin =await adminModel.create({
        name:"Priyadarshi",
        email:"admin123@gmail.com",
        password:hash
    })
    let token=  jwt.sign({email:"admin123@gmail.com "},process.env.JWT_KEY);
    res.cookie("token",token);
    res.send("admin created succesfully")
})

router.get("/login",(req,res)=>{
    res.render("adminlogin");
});

router.post("/login",async(req,res)=>{
    let {email,password} = req.body;
    let admin =await adminModel.findOne({email});

    if(!admin) return res.send("Admin not found");

    let valid = bcrypt.compare(password,admin.password);

    if(valid){
        let token=  jwt.sign({email:"admin123@gmail.com "},process.env.JWT_KEY);
    res.cookie("token",token);
    }
    res.redirect("/admin/dashboard")
})

router.get("/logout",(req,res)=>{
    let token=  jwt.sign({email:"admin123@gmail.com "},process.env.JWT_KEY);
    res.cookie("token","");
    res.redirect("/admin/login")
})

router.get("/dashboard",validateAdmin,(req,res)=>{
    res.render("event")
})

router.get("/event",validateAdmin,(req,res)=>{
    res.render("addEvent")
})

router.post("/event/add", validateAdmin,upload.single("eventLogo"),async (req, res) => {
    try {
        let { name, prizeMoney,eventLogo } = req.body; // Ensure eventLogo is included in your form

        // Check if the event already exists
        let event = await eventModel.findOne({ name });
        if (event) return res.status(400).send("Event already exists");

        // Create new event
        event = await eventModel.create({
            name,
            prizeMoney,
            eventLogo:req.file.buffer// This might be undefined unless you include it in the form
        });
        res.render("addSucess")
    } catch (err) {
        console.error('Error occurred:', err.message);
        return res.status(500).send(err.message);
    }
});

router.get("/allevent",validateAdmin,async(req,res)=>{
    try {
        const events = await eventModel.find();
      //  console.log(events)// Fetch all events
        res.render("allevent",{events}); // Return events as JSON
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: err.message }); // Handle error
    }
    
})

router.get("/delete/:id",validateAdmin,async(req,res)=>{
    let event = await eventModel.findOneAndDelete({_id:req.params.id})
     return res.redirect("/admin/allevent")
 
})


router.get('/addartist', (req, res) => {
    res.render('addartist');  // Render the 'addartist' view for adding an artist
});

// Route to handle adding a new artist
router.post('/addartist', async (req, res) => {
    const { name, image } = req.body;

    if (!name || !image) {
        return res.status(400).send("Name and Image are required.");
    }

    try {
        const newArtist = new Artist({ name, image });
        await newArtist.save();  // Save the artist to the database
        res.redirect('/admin/addsong');  // Redirect to add song page
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error adding artist");
    }
});

// Route to display all artists (for selecting when adding a song)
router.get('/artists', async (req, res) => {
    try {
        const artists = await Artist.find();  // Fetch all artists
        res.render('song', { artists });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error fetching artists");
    }
});




router.get('/addsong', async (req, res) => {
    try {
        const artists = await Artist.find();  // Fetch all artists
        res.render('addsong', { artists });   // Render the 'addsong' view with artist data
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error fetching artists for the song form");
    }
});

// Route to handle adding a new song
router.post('/addsong', async (req, res) => {
    const { title, artist, audio, icon } = req.body;

    if (!title || !artist || !audio || !icon) {
        return res.status(400).send("All fields are required.");
    }

    try {
        const newSong = await songModel.create({
            title,
            artist,  // artist is an ObjectId linked to the Artist model
            audio,
            icon
        });

        await newSong.save();  // Save to MongoDB
        res.redirect('/admin/addsong');  // Redirect to the list of songs (or wherever you want)
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error adding song");
    }
});


// Route to render the page with both artists and songs
router.get('/artistssongs', async (req, res) => {
    try {
        // Fetch all artists
        const artists = await Artist.find();  

        // Fetch all songs (or you can filter by artist if necessary)
        const songs = await songModel.find(); 

        // Render the 'artists-songs' view and pass both artists and songs
        res.render('song', { artists, songs });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error fetching artists and songs");
    }
});



module.exports = router;