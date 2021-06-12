const { quotes, noun } = require("./quotes.js");
const Blog = require("./models/blog");
const mongoose = require("mongoose");
const User = require("./models/user");
const Comment = require("./models/comment");

mongoose.connect('mongodb://localhost:27017/blogify', { useNewUrlParser: true, useUnifiedTopology: true })

// console.log(quotes[0]);
// console.log(quotes[0].quote);
const seedDB = async () => {
    await Blog.deleteMany({});
    await Comment.deleteMany({});
    let count = 1;
    while (count <= 20) {
        let num = Math.floor(Math.random() * 50);
        let n = Math.floor(Math.random() * 10);
        const user = await User.findById("60c35268ec7ef34808e677b1");
        const blog = new Blog({
            author: user,
            title: `${noun[n]}`,
            data: `${quotes[num].quote}`,
        });
        await blog.save();
        count++;
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})
