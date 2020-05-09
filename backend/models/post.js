const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
  title: { type: String, default: "Title" },
  content: { type: String, default: "Hi" },
  imagePath: { type: String, required: true },
  creater: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true }
})

module.exports = mongoose.model("Post", postSchema);
