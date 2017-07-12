var mongoose = require('mongoose')
require('express');
require("../models/article")
var Article = mongoose.model('Article')

exports.loadArticles = function (req, res) {
    Article.fetch(function (err, articles) {
        console.log("articles"+articles)
        if (err) {
            res.json({
                status: 200,
                errorCode: 106,//读取失败
                articles: articles
            })
        }

        res.json({
            status: 200,
            errorCode: 100,
            articles: articles
        })
    })
}

exports.AddArticles = function (req, res) {
    var reqInfo = req.body
       console.log("session user"+reqInfo.content) 
    var articleFSave = new Article();
    articleFSave.title = reqInfo.title
    //articleFSave.author = req.session.user.username
    articleFSave.author = reqInfo.author
    articleFSave.content = reqInfo.content
    articleFSave.imgs = reqInfo.imgs

    articleFSave.save(function (err, art) {
        if (err) {
            resjson = {
                errorCode: 106,
                status: "200",
            }
        }
        resjson = {
            errorCode: 100,
            status: "200",
        }
        return res.json(resjson)
    });
}