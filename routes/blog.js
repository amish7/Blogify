const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { isLoggedIn, isAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

router.get("/", catchAsync(async (req, res, next) => {
    const allBlogs = await Blog.find({}).populate("author");
    res.render("./blog/index", { allBlogs });
}))
router.get("/new", isLoggedIn, (req, res) => {
    res.render("./blog/new");
})
router.post("/new", isLoggedIn, catchAsync(async (req, res, next) => {
    const blog = new Blog(req.body.blog);
    blog.author = res.locals.currentUser;
    await blog.save();
    req.flash("success", "Blog successfully created!!");
    res.redirect(`/blog/${blog._id}`);
}))
router.get("/:id", catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id)
        .populate({
            path: "comments",
            populate: {
                path: "author"
            }
        })
        .populate("author");
    if (!blog) {
        req.flash("error", "Blog does not exist.");
        res.redirect("/blog");
    }
    else {
        res.render("./blog/show", { blog });
    }
}))
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        req.flash("error", "Blog does not exist.");
        res.redirect("/blog");
    }
    else {
        res.render("./blog/edit", { blog });
    }

}))
router.put("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body.blog);
    req.flash("success", "Blog successfully edited!!");
    res.redirect(`/blog/${blog._id}`);
}))
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id).populate("comments");
    if (!blog) {
        req.flash("error", "Blog does not exist.");
        res.redirect("/blog");
    }
    else {
        for (let comment of blog.comments) {
            await Comment.findByIdAndDelete(comment._id);
        }
        await Blog.findByIdAndDelete(req.params.id);
        req.flash("success", "Blog successfully deleted!!");
        res.redirect("/blog");
    }
}))

module.exports = router;