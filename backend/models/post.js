const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
  title: {type: String, default: "Title"},
  content: {type: String, default: "Hi"},
 imagePath: {type: String, required: true },
})

module.exports = mongoose.model("Post", postSchema);
