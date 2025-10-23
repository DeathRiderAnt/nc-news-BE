const {selectCommentsByArticle} = require('../models/comments.models.js')

exports.getCommentsByArticle = (req, res, next) => {
    const articleId = req.params.article_id;
    selectCommentsByArticle(articleId).then(({rows}) => {
        if (rows.length === 0)
            return Promise.reject({status: 404, msg: "Not Found"})
        else
            res.status(200).send({comments: rows})
    })
    .catch((err) => {
        if (err.code === '22P02')
            next({status: 400, msg: "Bad Request"})
        else
         next(err)
    })
}