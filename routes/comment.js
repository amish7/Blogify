const express = require("express");
const router = express.Router({ mergeParams: true });
const Comment = require("../models/comment");
const Blog = require("../models/blog")
const { isLoggedIn, isCommentAuthor } = require("../middleware");


router.post("/", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    const comment = new Comment(req.body.comment);
    comment.author = res.locals.currentUser;
    comment.save();
    blog.comments.push(comment);
    blog.save();
    req.flash("success", "Comment successfully added!")
    res.redirect(`/blog/${blog._id}/`)
})
router.delete("/:cid", isCommentAuthor, isLoggedIn, async (req, res) => {
    const { id, cid } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, { $pull: { comments: cid } });
    await Comment.findByIdAndDelete(cid);
    req.flash("success", "Comment successfully deleted!")
    res.redirect(`/blog/${id}`);
})
module.exports = router;