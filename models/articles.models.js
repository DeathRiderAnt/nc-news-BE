const db = require('../db/connection.js')

exports.selectArticles = () => {
    return db.query("SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count FROM articles AS a JOIN comments AS c ON c.article_id = a.article_id GROUP BY a.article_id ORDER BY a.created_at DESC")
}

exports.selectArticlesById = (articleId) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [articleId])
}