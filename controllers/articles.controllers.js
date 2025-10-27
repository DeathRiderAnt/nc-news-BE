const {selectArticles, selectArticleById, updateArticle} = require('../models/articles.models.js')

exports.getArticles = (req, res, next) => {
    const sortBy = req.query.sort_by||'created_at';
    const order = (req.query.order||'DESC').toUpperCase();
    const topic = req.query.topic
    selectArticles(topic, sortBy, order).then(({rows}) => {
        res.status(200).send({articles: rows})
    })
    .catch(next)
}

exports.getArticleById = (req,res,next) => {
    const articleId = req.params.article_id;
    selectArticleById(articleId).then((rows) => {
        console.log(rows)
        res.status(200).send({article: rows[0]})
    })
    .catch(next);
}

exports.patchArticle = (req,res,next) => {
    const articleId = req.params.article_id;
    const incVote = req.body.inc_votes;
    if (incVote === undefined || incVote === 0)
        return res.status(400).send({msg: "Bad Request"})
    updateArticle(incVote,articleId).then(({rows}) => {
        res.status(200).send(rows[0])
    })
    .catch(next);
}