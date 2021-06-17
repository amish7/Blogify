const express = require("express");
const router = express.Router({ mergeParams: true });
const Comment = require("../models/comment");
const Blog = require("../models/blog")
const { isLoggedIn, isCommentAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

router.post("/", isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
        req.flash("error", "Blog does not exist");
        res.redirect("/blog");
    }
    const comment = new Comment(req.body.comment);
    comment.author = res.locals.currentUser;
    await comment.save();
    blog.comments.push(comment);
    await blog.save();
    req.flash("success", "Comment successfully added!")
    res.redirect(`/blog/${blog._id}/`)
}))
router.delete("/:cid", isLoggedIn, isCommentAuthor, catchAsync(async (req, res, next) => {
    const { id, cid } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, { $pull: { comments: cid } });
    if (!blog) {
        req.flash("error", "Blog does not exist");
        res.redirect("/blog");
    }
    await Comment.findByIdAndDelete(cid);
    req.flash("success", "Comment successfully deleted!")
    res.redirect(`/blog/${id}`);
}))

module.exports = router;