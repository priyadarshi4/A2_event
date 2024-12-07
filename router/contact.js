const express = require("express");
const router = express.Router();
const {eventModel,validateeventModel} = require("../models/event")



router.get("/",(req,res)=>{
    res.render("contact")
})

router.get("/dress",(req,res)=>{
    res.render("dress")
})

router.get("/resturant",async(req,res)=>{
    try {
        const events = await eventModel.find();
      //  console.log(events)// Fetch all events
        res.render("resturant",{events}); // Return events as JSON
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: err.message }); // Handle error
    }
})



module.exports = router