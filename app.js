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

module.exports = app;