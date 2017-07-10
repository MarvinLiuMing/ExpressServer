var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
  username: {
    unique: true,
    type: String
  },
  password: String,
  avatarUrl: String,
  // 0: nomal user
  // 1: verified user
  // 2: professonal user
  // >10: admin
  // >50: super admin
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

UserSchema.pre('save', function (next) {
  var user = this
console.log("pre : "+user)
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
  if (user.password.length < 20) {
    UserSchema.methods.EncryptionPas(user.password, function (hash) {
      user.password = hash
      next()
    })
  }
  else {
    next()
  }

})


UserSchema.methods = {
  // comparePassword: function (_password, cb) {
  //   bcrypt.compare(_password, this.password, function (err, isMatch) {
  //     if (err) return cb(err)

  //     cb(null, isMatch)
  //   })
  //   //cb(null, true)
  // },
  comparePassword: function (_password, cb) {
    if(_password== this.password)  
      {isMatch = true}
    else isMatch =false
      cb(null, isMatch)
  },
  EncryptionPas: function (_password, cb) {
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {

      if (err) return err

      bcrypt.hash(_password, salt, function (err, hash) {
        if (err) return err

        return cb(hash)
      })
    })
  }
}

UserSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({ _id: id })
      .exec(cb)
  }
}

module.exports = UserSchema;

