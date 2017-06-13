var mongoose = require('mongoose')
require('express');
require("../models/article")
var Article = mongoose.model('Article')

exports.loadArticles = function (req, res) {
    Article.fetch(function (err, articles) {
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