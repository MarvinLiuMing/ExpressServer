var mongoose = require('mongoose')

var TokenSchema = new mongoose.Schema({
  token: {
    unique: true,
    type: String
  },
  username: String,
  role: {
    type: Number,
    default: 0
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})


TokenSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findByToken: function (token, cb) {
    return this
      .findOne({ token: token })
      .exec(cb)
  }
}

module.exports = TokenSchema;