const express = require('express');
const app = express();
const db = require('./db/connection');
const { getTopics, getArticles, getArticleById, getUsers, getCommentsByArticle, postComment, patchArticle, reqDeleteComment} = require('./controllers/index.controllers.js')
const { customErrorCheck, psqlErrorCheck } = require('./controllers/errors.controllers.js');
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use('/api', express.static('public'))

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticle)

app.get('/api/users', getUsers)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticle)

app.delete('/api/comments/:comment_id', reqDeleteComment)


app.use(psqlErrorCheck);

app.use(customErrorCheck);

module.exports = app;