const {selectCommentsByArticle, insertComment, deleteComment} = require('../models/comments.models.js')

exports.getCommentsByArticle = (req, res, next) => {
    const articleId = req.params.article_id;
    selectCommentsByArticle(articleId).then((rows) => {
        res.status(200).send({comments: rows})
    })
    .catch(next);
}

exports.postComment = (req, res, next) => {
    const articleId = req.params.article_id;
    const author = req.body.author;
    const body = req.body.body;
    insertComment(author, body, articleId).then(({rows}) => {
        res.status(201).send(rows[0])
    })
    .catch(next);
}

exports.reqDeleteComment = (req, res, next) => {
    const commentId = req.params.comment_id;
    deleteComment(commentId).then((rows) => {
        console.log(rows)
        res.status(204).send()
    })
    .catch(next);
}