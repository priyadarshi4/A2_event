const express = require("express");
const router = express.Router();




router.get("/",(req,res)=>{
    res.render("mambership")
})




module.exports = router