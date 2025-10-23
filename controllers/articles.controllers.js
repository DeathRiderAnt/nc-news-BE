const {selectArticles, selectArticlesById} = require('../models/articles.models.js')

exports.getArticles = (req, res) => {
    selectArticles().then(({rows}) => {
        res.status(200).send({articles: rows})
    })
}

exports.getArticlesById = (req,res,next) => {
    const articleId = req.params.article_id;
    selectArticlesById(articleId).then(({rows}) => {
        if (rows.length === 0)
            return Promise.reject({status: 404, msg: "Not Found"})
        else
            res.status(200).send({article: rows[0]})
    })
    .catch((err) => {
        if (err.code === '22P02')
            next({status: 400, msg: "Bad Request"})
        else
         next(err)
    })
}