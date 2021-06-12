const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Comment", commentSchema);