var express = require('express');
var router = express.Router();
var assert = require('assert');
var user = require("../app/controllers/user")
var article = require("../app/controllers/article")


/* index */
router.get('/', user.showindex);

/* signin */
router.get('/signin', user.showSignin);

router.post('/signin', user.signin);

/* signin */
router.post('/signout', user.signout);

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
router.post('/getsignature', user.verifytoken, user.saveavatar);

/* Articles. */
router.post('/loadArticles', article.loadArticles);

//router.post('/AddArticles', user.verifytoken, article.AddArticles);

router.post('/AddArticles', article.AddArticles);

router.get('/test', function (req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");

    console.log("!!!!intest!!!!!")
    res.json({
        status: "200",
        data: "Marvin" 
    })
});







router.get('/testuser', user.testmethod1, user.testmethod2);


























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