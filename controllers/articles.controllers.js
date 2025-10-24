const {selectArticles, selectArticleById, updateArticle} = require('../models/articles.models.js')

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

exports.patchArticle = (req,res,next) => {
    const articleId = req.params.article_id;
    const incVote = req.body.inc_votes;
    updateArticle(incVote,articleId).then(({rows}) => {
        res.status(200).send(rows[0])
    })
    .catch(next);
}