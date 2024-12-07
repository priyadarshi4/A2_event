const express = require("express");
const router = express.Router();
const passport = require("passport")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {uerModel, userModel} = require("../models/users")
const upload = require("../configuration/multerConnection");




router.get("/",(req,res)=>{
    res.render("auth")
})

router.post("/register",upload.single("image"),async(req,res)=>{
    let {name,email,password,image,collage} = req.body

    let user =await userModel.findOne({email});
    if(user) return res.send("user allready exist !");

    let salt =await bcrypt.genSalt(10)
    let hash =await bcrypt.hash(password,salt)

    user =await userModel.create({
        name,
        email,
        password:hash,
        image:req.file.buffer,
        collage,
    })

    user.save();

    let token = jwt.sign({email},process.env.JWT_KEY);
    res.cookie("token",token);
    res.redirect("/auth")

})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/front/user', 
    failureRedirect: '/login', 
    failureFlash: false 
}));

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/'); // Redirect after destroying session
    });
});



router.get("/profile",async(req,res)=>{
    let userId = req.session.passport.user;
    let user = await userModel.findById(userId);
    res.render("account",{user})
})



module.exports = router
