const express = require('express');
const app = express();
const db = require('./db/connection');

app.use(express.json());

app.get('/api/topics', (req, res) => {
    return db.query("SELECT * FROM topics")
    .then((body) => {
        res.status(200).send(body.rows)
    })
})

app.get('/api/articles', (req,res) => {
    return db.query("SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count FROM articles AS a JOIN comments AS c ON c.article_id = a.article_id GROUP BY a.article_id ORDER BY a.created_at DESC")
    .then((body) => {
        console.log(body.rows)
        res.status(200).send({articles: body.rows})
    })
})

module.exports = app;