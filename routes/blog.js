const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const { isLoggedIn, isAuthor } = require("../middleware");


router.get("/", async (req, res) => {
    const allBlogs = await Blog.find({}).populate("author");
    res.render("./blog/index", { allBlogs });
})
router.get("/new", isLoggedIn, (req, res) => {
    res.render("./blog/new");
})
router.post("/new", isLoggedIn, async (req, res) => {
    const blog = new Blog(req.body.blog);
    blog.author = res.locals.currentUser;
    await blog.save();
    req.flash("success", "Blog successfully created!!");
    res.redirect(`/blog/${blog._id}`);
})
router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id)
        .populate({
            path: "comments",
            populate: {
                path: "author"
            }
        })
        .populate("author");
    res.render("./blog/show", { blog });
})
router.get("/:id/edit", isLoggedIn, isAuthor, async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.render("./blog/edit", { blog });
})
router.put("/:id", isLoggedIn, isAuthor, async (req, res) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body.blog);
    req.flash("success", "Blog successfully edited!!");
    res.redirect(`/blog/${blog._id}`);
})
router.delete("/:id", isLoggedIn, isAuthor, async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    req.flash("success", "Blog successfully deleted!!");
    res.redirect("/blog");
})

module.exports = router;