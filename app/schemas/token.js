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


module.exports = TokenSchema;