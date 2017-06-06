var mongoose = require('mongoose')
var UserSchema = require('../schemas/token')
var Token = mongoose.model('Token', TokenSchema)

module.exports =Token
