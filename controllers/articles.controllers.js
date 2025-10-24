const {selectArticles, selectArticleById} = require('../models/articles.models.js')

exports.getArticles = (req, res) => {
    selectArticles().then(({rows}) => {
        res.status(200).send({articles: rows})
    })
}

exports.getArticleById = (req,res,next) => {
    const articleId = req.params.article_id;
    selectArticleById(articleId).then((rows) => {
        res.status(200).send({article: rows[0]})
    })
    .catch(next);
}