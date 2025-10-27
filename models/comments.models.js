const db = require('../db/connection')
const {checkIfExists} = require('../utils.js')


exports.selectCommentsByArticle = (articleId) => {
    return checkIfExists('articles','article_id',articleId)
    .then(() => {
        return db.query("SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC", [articleId])
        .then(({rows}) => {
            return rows
        })
    })  
}

exports.insertComment = (author, body, articleId) => {
    return db.query('INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *', [author, body, articleId])
}

exports.deleteComment = (commentId) => {
    return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [commentId])
    .then(({rows}) => {
        if (rows.length === 0)
            return Promise.reject({status: 404, msg: "Not Found"})
        return rows
    })
}