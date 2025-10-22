const {selectArticles} = require('../models/articles.js')

exports.getArticles = (req, res) => {
    selectArticles().then(({rows}) => {
        res.status(200).send({articles: rows})
    })
}