const db = require('../db/connection.js')
const format = require('pg-format')

exports.selectArticles = (sortBy, order) => {
    const validSortColumns = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'comment_count'];
    const validOrders = ['ASC', 'DESC'];

    if(!validSortColumns.includes(sortBy))
        return Promise.reject({status: 400, msg: 'Invalid sort_by request'})
    if(!validOrders.includes(order))
        return Promise.reject({status: 400, msg: 'Invalid order request'})

    const queryStr = format("SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id)::INT AS comment_count FROM articles AS a LEFT JOIN comments AS c ON c.article_id = a.article_id GROUP BY a.article_id ORDER BY %I %s", sortBy, order);

    return db.query(queryStr);
}

exports.selectArticleById = (articleId) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then(({rows}) => {
        if (rows.length === 0)
            return Promise.reject({status: 404, msg: "Not Found"})
        return rows
    })
}

exports.updateArticle = (incVote,articleId) => {
    return db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *", [incVote,articleId])
}