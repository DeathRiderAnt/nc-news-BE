const db = require('../db/connection.js')
const format = require('pg-format')
const {checkIfExists} = require('../utils.js')

exports.selectArticles = (topic, sortBy, order) => {
    const validSortColumns = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'comment_count'];
    const validOrders = ['ASC', 'DESC'];
    
    
    if(!validSortColumns.includes(sortBy))
        return Promise.reject({status: 400, msg: 'Invalid sort_by request'})
    if(!validOrders.includes(order))
        return Promise.reject({status: 400, msg: 'Invalid order request'})

    let queryStr = "SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id)::INT AS comment_count FROM articles AS a LEFT JOIN comments AS c ON c.article_id = a.article_id"
    let queryValues = [];

    let topicPromise = Promise.resolve();

    if (topic)
    {
        topicPromise = checkIfExists('topics','slug',topic)
        .then(() => {
            queryValues.push(topic)
            queryStr += ' WHERE a.topic = $1'
        })
    }

    return topicPromise.then(() => {
        queryStr = format(`${queryStr} GROUP BY a.article_id ORDER BY %I %s`, sortBy, order);
        return db.query(queryStr, queryValues);
    })
}

exports.selectArticleById = (articleId) => {
    return db.query("SELECT a.article_id, a.title, a.topic, a.author, a.body, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id)::INT AS comment_count FROM articles AS a LEFT JOIN comments AS c ON c.article_id = a.article_id WHERE a.article_id = $1 GROUP BY a.article_id, a.title, a.topic, a.author, a.body, a.created_at, a.votes, a.article_img_url", [articleId])
    .then(({rows}) => {
        if (rows.length === 0)
            return Promise.reject({status: 404, msg: "Not Found"})
        return rows
    })
}

exports.updateArticle = (incVote,articleId) => {
    return db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *", [incVote,articleId])
}