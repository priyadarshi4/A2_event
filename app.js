const express = require("express");
const app = express();
const expressSession = require("express-session")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

require('dotenv').config()
const indexRouter = require("./router/index");
const authRouter = require("./router/auth")
const frontRouter = require("./router/front")
const musicRouter = require("./router/music")
const adminRouter = require("./router/admin")





const path = require("path");
const passportConnection = require("./configuration/passportConfig")
const mongoDbConnection = require("./configuration/mongoDbConfig")
const multerConnection = require("./configuration/multerConnection")



app.use(expressSession({
    secret: process.env.SECRETE_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser());
mongoDbConnection();
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use("/",indexRouter)
app.use("/auth",authRouter)
app.use("/front",frontRouter)
app.use("/music",musicRouter)
app.use("/admin",adminRouter)









app.listen(process.env.PORT || 3000)