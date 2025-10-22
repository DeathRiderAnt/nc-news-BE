const { selectTopics } = require('../models/topics.js')

exports.getTopics = (req, res) => {
    selectTopics().then(({rows}) => {
        res.status(200).send({topics: rows})
    })
}