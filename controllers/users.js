const {selectUsers} = require('../models/users.js')

exports.getUsers = (req,res) => {
    selectUsers().then(({rows}) => {
        res.status(200).send({users: rows})
    })
}