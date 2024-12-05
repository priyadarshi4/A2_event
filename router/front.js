const express = require("express");
const router = express.Router();




router.get("/",(req,res)=>{
    res.render("main")
})

router.get("/user",(req,res)=>{
    res.render("main2")
})



module.exports = router