// var mongoose = require('mongoose')
// var UserSchema = require('../schemas/user')
// //var User = mongoose.model('Cat', { name: String });
// // mongoose.model('User', {
// //   name: {
// //     unique: true,
// //     type: String
// //   },
// //   password: String})

// module.exports = User

var mongoose = require('mongoose')
var UserSchema = require('../schemas/user')
var User = mongoose.model('User', UserSchema)

module.exports = User