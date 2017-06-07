var express = require('express');
var router = express.Router();
var assert = require('assert');
var user = require("../app/controllers/user")


/* index */
router.get('/', user.showindex);

/* login */
router.get('/signin', user.showSignin);

router.post('/signin', user.signin);


/* sign up. */
router.get('/signup', user.showSignup);

router.post('/signup', user.signup);


/* users. */
router.get('/userlist', user.showSignin);

router.post('/userlist', user.signin);

/* password. */
router.get('/changePassword', user.showChaPas);

router.post('/changePassword', user.changePassword);

/* token. */
router.post('/verifytoken', user.verifytoken);

/* signature. */
router.post('/getsignature',user.saveavatar);


























/* test. */
router.get('/test', function (req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");

    console.log("!!!!intest!!!!!")
    res.json({
        status: "200",
        data: "Marvin" 
    })
});
router.post('/test', function (req, res) {

    console.log("!!!!intest!!!!!")
    res.jsonp({ username: "Marvin" })
});

module.exports = router;