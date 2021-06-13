const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { isLoggedIn, isAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { cloudinary, storage } = require("../cloudinary/index");
const upload = multer({ storage });

router.get("/", catchAsync(async (req, res, next) => {
    const allBlogs = await Blog.find({}).populate("author");
    res.render("./blog/index", { allBlogs });
}))
router.get("/new", isLoggedIn, (req, res) => {
    res.render("./blog/new");
})
router.post("/new", isLoggedIn, upload.array("image"), catchAsync(async (req, res, next) => {
    const blog = new Blog(req.body.blog);
    blog.author = res.locals.currentUser;
    const image = req.files;
    for (let img of image) {
        blog.images.push({ url: img.path, filename: img.filename });
    }
    await blog.save();
    res.locals.currentUser.blogs.push(blog);
    await res.locals.currentUser.save();
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
router.put("/:id", isLoggedIn, isAuthor, upload.array("image"), catchAsync(async (req, res, next) => {
    let blog = await Blog.findById(req.params.id);
    for (let img of req.files) {
        blog.images.push({ url: img.path, filename: img.filename });
    }
    await blog.save();
    blog = await Blog.findByIdAndUpdate(req.params.id, req.body.blog);
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
        for (let img of blog.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
        await Blog.findByIdAndDelete(req.params.id);
        req.flash("success", "Blog successfully deleted!!");
        res.redirect("/blog");
    }
}))

module.exports = router;