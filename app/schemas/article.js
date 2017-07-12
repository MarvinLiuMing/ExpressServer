var mongoose = require('mongoose')

var ArticleSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  imgs: [{ path: String }],
  comments: [{ username: String, commentTittle: String, commentContent: String, }],
  date: { type: Date, default: Date.now },
  hidden: Boolean
})


ArticleSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('date.default')
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({ _id: id })
      .exec(cb)
  }
}

module.exports = ArticleSchema;

