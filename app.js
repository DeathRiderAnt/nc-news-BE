const express = require('express');
const app = express();
const db = require('./db/connection');
const { getTopics, getArticles, getArticleById, getUsers, getCommentsByArticle } = require('./controllers/index.controllers.js')

app.use(express.json());

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticle)

app.get('/api/users', getUsers)

app.use((err, req, res, next) => {
    console.log(err)

    if(err.status)
        res.status(err.status).send({msg: err.msg})
    else
        res.status(500).send({msg: "Internal Server Error"})
})

module.exports = app;