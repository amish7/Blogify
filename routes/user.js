const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");

router.get("/register", (req, res) => {
    res.render("./user/register");
})
router.post("/register", catchAsync(async (req, res, next) => {
    const { email, username, password } = req.body;
    const user = new User({
        email: email,
        username: username
    })
    const registeredUser = await User.register(user, password);
    req.flash("success", `Welcome to Blogify, ${username}!!`);
    res.redirect("/blog");
}))
router.get("/login", (req, res) => {
    res.render("./user/login");
})
router.post("/login", passport.authenticate("local", { failureFlash: "Invalid", failureRedirect: "/user/login" }), (req, res) => {
    req.flash("success", `Welcome back ${req.body.username}`);
    res.redirect("/blog");
})
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/blog");
})

module.exports = router;