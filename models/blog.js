const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    filename: {
        type: String
    }
})
const blogSchema = new mongoose.Schema({
    images: [imgSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Blog", blogSchema);