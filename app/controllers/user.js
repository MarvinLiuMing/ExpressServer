var mongoose = require('mongoose')
require('express');
require("../models/user")
var User = mongoose.model('User')
require("../models/token")
var Token = mongoose.model('Token')
var jwt = require('jsonwebtoken');

// index 
exports.showindex = function (req, res) {
  var jsonfile = { title: 'Express', head: 'login page' };
  res.render('index', jsonfile);
}

// signup
exports.showSignup = function (req, res) {
  var jsonfile = { title: 'signup', head: 'showsignup' };
  res.render('signup', jsonfile);
}

exports.showSignin = function (req, res) {
  var jsonfile = { title: 'signin', head: 'sign in page' };
  res.render('signin', jsonfile);
}

exports.signup = function (req, res) {
  var _user = req.body
  var resjson = {}

  User.findOne({ username: _user.username }, function (err, user) {
    if (err) {
      console.log("err:" + err)
    }

    if (user) {
      var jsonfile = { title: 'signup', head: '!!!mes error!!!' };
      return res.render('signup', jsonfile)
    }
    else {
      user = new User(_user)
      console.log("new user " + user.password)
      user.save(function (err, user) {

        if (err) {
          console.log(err)
          resjson = {
            errormsg: err,
            status: "500",
          }
        }
        resjson = {
          errormsg: "",
          status: "200",
        }
        res.json(resjson)
      })
    }
  })
}

// signin
exports.signin = function (req, res) {
  var _user = req.body
  var name = _user.username
  var password = _user.password

  User.findOne({ username: name }, function (err, user) {
    if (err) {
      console.log(err)
    }

    if (!user) {
      return res.redirect('/')
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        console.log(err)
      }

      if (isMatch) {
        var token = jwt.sign({ username: user.username, iat: Math.floor(Date.now() / 1000) - 30 }, 'app.get(superSecret)', {
          // 'expiresInMinutes':1440
        });
        //        req.session.save(function(err){})

        users = User.fetch(function (err, users) {
          console.log(token)
          var tokeninfo = {
            users: users,
            token: token
          }
          token = new Token(tokeninfo)
          token.save(function (err, token) {
            if (err) { console.log(err) }
          })

          var resjson = {
            status: "200",
            users: users,
            token: token
          }
          return res.json(resjson);
          //return res.render('userlist', { users: users,token:token })
        });

      }
      else {
        return res.redirect('/')
      }
    })
  })
}

// logout
exports.logout = function (req, res) {
  delete req.session.user
  //delete app.locals.user

  res.redirect('/')
}

// userlist page
exports.list = function (req, res) {
  User.fetch(function (err, users) {
    if (err) {
      console.log(err)
    }

    res.render('userlist', {
      title: 'imooc 用户列表页',
      users: users
    })
  })
}


// change Password 
exports.showChaPas = function (req, res) {
  res.render('changePassword', { head: "修改密码" });
}

exports.changePassword = function (req, res, next) {
  var userInfo = req.body;

  User.findOne({ username: userInfo.username }, function (err, user) {
    if (err) { console.log(err) }
    if (!user) { res.render('changePassword', { head: "用户不存在" }); }

    user.comparePassword(userInfo.password, function (err, isMatch) {
      if (err) { console.log(err) }

      if (isMatch) {

        user.EncryptionPas(userInfo.newpassword, function (hash) {
          console.log("hash : " + hash)
          user.update({ password: hash }, function (err, raw) {
            if (err) return handleError(err);
            console.log('The raw response from Mongo was ', raw);
            res.render('index');
          });
        })
      }
      else {
        res.render('changePassword', { head: "密码错误" });
      }
    })
  })
}

// midware for user
exports.signinRequired = function (req, res, next) {
  var user = req.session.user

  if (!user) {
    return res.redirect('/signin')
  }

  next()
}

exports.adminRequired = function (req, res, next) {
  var user = req.session.user

  if (user.role <= 10) {
    return res.redirect('/signin')
  }

  next()
}
exports.verifytoken = function (req, res, next) {
  var token = req.body.token
  var resjson = { status: 401, message: "token不存在", success: false }
  var resu = verifyTokenExist(token)
  if (resu != "FALSE") {
    resjson.status = 200
    resjson.message = "验证通过"
  }
  return res.json(resjson);
}


exports.saveavatar = function (req, res, next) {
  var reqjson = req.body
  var _user = showUserInfo(verifyTokenExist(reqjson.token))
  _user.avatarUrl = reqjson.imageUrl;
  _user.save(function (err, user) {
    if (err) {
      console.log(err)
      resjson = {
        success:false,
        errormsg: err,
        status: "500",
      }
    }
    resjson = {
      success:true,
      errormsg: "",
      status: "200",
    }
    res.json(resjson)
  })
}


function showUserInfo(username) {
  User.findOne({ username: userInfo.username }, function (err, user) {
    if (err) { console.log(err) }
    if (!user) { return new User(); }
    user.password = "imageUrl";
    return user;
  })
}


function verifyTokenExist(token) {
  Token.findOne({ 'token': token }, function (err, _token) {
    if (err) return err;
    if (!_token) return 'FALSE';
    return _token.username;
  })
}