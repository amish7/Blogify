const Blog = require("./models/blog");
const Comment = require("./models/comment");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You need to login");
        res.redirect("/user/login");
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author");
    if (!res.locals.currentUser._id.equals(blog.author._id)) {
        req.flash("error", "Can be done only by the author!!");
        res.redirect(`/blog/${id}`);
    }
    else {
        next();
    }
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, cid } = req.params;
    const comment = await Comment.findById(cid).populate("author");
    if (!res.locals.currentUser._id.equals(comment.author._id)) {
        req.flash("error", "Can be done only by the author!!");
        res.redirect(`/blog/${id}`);
    }
    else {
        next();
    }
}