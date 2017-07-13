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
      resjson = {
        errorCode: 102,
        status: "200",
      }
      return res.json(resjson)
    }
    else {
      console.log(_user)
      user = new User(_user)
      user.save(function (err, user) {

        if (err) {
          console.log(err)
          resjson = {
            errorCode: 103,
            status: "200",
          }
        }
        resjson = {
          errorCode: 100,
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
  console.log("name:" +password)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Max-Age', '86400')
  User.findOne({ username: name }, function (err, user) {
    if (err) {
      console.log(err)
    }

    if (!user) {
      return res.json({
        errorCode: 101,
        status: "200",
      })
    }
console.log("user"+user)
    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        console.log(err)
      }

      if (isMatch) {
        var token = jwt.sign({ username: user.username, iat: Math.floor(Date.now() / 1000) - 30 }, 'app.get(superSecret)', {
          // 'expiresInMinutes':1440
        });
        //        req.session.save(function(err){})
        var tokeninfo = {
          token: token,
          username: user.username
        }
        token = new Token(tokeninfo)
        token.save(function (err, token) {
          if (err) { console.log(err) }
        })

        user.password = "";

        var resjson = {
          "status": 200,
          "errorCode": "100",
          "user": user,
          "token": token
        }

        return res.json(resjson);
      }
      else {
        return res.json({
          "status": "200",
          "errorCode": "104",
        });
      }
    })
  })
}

// signout
exports.signout = function (req, res) {
  if (req.session.user != null) {
    delete req.session.user;
    res.json({
      status: 200,
      errorCode: 100
    })
  } else {
    res.json({
      status: 200,
      errorCode: 107  //用户没有登陆
    })
  }
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
    if (!user) {
      return res.json({
        errorCode: 101,
        status: "200",
      })
    }

    user.comparePassword(userInfo.password, function (err, isMatch) {
      if (err) { console.log(err) }

      if (isMatch) {

        user.EncryptionPas(userInfo.newpassword, function (hash) {
          user.update({ password: hash }, function (err, raw) {
            if (err) return handleError(err);

            return res.json({
              errorCode: 100,
              status: "200",
            });
          });
        })
      }
      else {
        return res.json({
          errorCode: 104,
          status: "200",
        });
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
  var verifyflag = req.body.verifyflag
  Token.findByToken(token, function (err, _token) {
    if (err) return err;
    if (!_token) {
      return res.json({
        status: 200,
        errorCode: 105
      });
    }
    //req.session.user = showUserInfo(_token.username)
    showUserInfo(_token.username, function (err, user) {
      req.session.user = user;
      if (verifyflag === "true") {
      return res.json({
        status: 200,
        errorCode: 100
      });
    }
    next();
    })
    
  })
}


exports.saveavatar = function (req, res, next) {
  var reqjson = req.body
  var _user = req.session.user
  console.log("saveavatar ：" + _user)
  _user.avatarUrl = reqjson.imageUrl;
  _user.save(function (err, user) {
    if (err) {
      console.log(err)
      resjson = {
        errorCode: 103,
        status: "200",
      }
    }
    resjson = {
      errorCode: 100,
      status: "200",
    }
    res.json(resjson)
  })
}


function showUserInfo(username, cb) {
  User.findOne({ username: username }, function (err, user) {
    if (err) { console.log(err) }
    if (!user) { return new User(); }
    user.password = "imageUrl";

    return cb(err, user);
  })
}


exports.verifyTokenExist = function (req, res, nexy) {
  console.log("in  verifyTokenExist")

  Token.findByToken(token, function (err, _token) {
    if (err) return err;
    if (!_token) {
      return res.json({
        status: 200,
        success: false,
        err: '用户没登陆'
      });
    }
    console.log("verifyTokenExist")
    req.session.user = showUserInfo(_token.username)
    next();
  })
  //console.log("verifyTokenExist :"+ Token.findOne({token:token}))
  console.log("out verifyTokenExist : " + req.session.user)

}


exports.testmethod1 = function (req, res, next) {
  console.log("testmethod1:" + req.session.user.username)
  User.findOne({ username: "Marvin" }, function (err, user) {
    this.body = {
      success: false
    }
    req.session.user = user
    next()
  })

}

exports.testmethod2 = function (req, res, next) {
  console.log(req.session.user)
  return res.json(this.body)
}