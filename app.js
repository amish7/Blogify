require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Blog = require("./models/blog");
const User = require('./models/user');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const blogRoutes = require("./routes/blog");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment");
const { isLoggedIn, isAuthor } = require("./middleware");
const ExpressError = require("./utils/ExpressError");
const multer = require("multer");
const { storage } = require("./cloudinary/index");
const upload = multer({ storage });

mongoose.connect('mongodb://localhost:27017/blogify', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("CONNECTED TO DATABASE");
    })
    .catch(() => {
        console.log("CONNECTION FAILED");
    });


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionConfig = {
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/blog", blogRoutes);
app.use("/user", userRoutes);
app.use("/blog/:id/comment", commentRoutes);

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found!!", "404"));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("SERVING ON PORT 3000");
});